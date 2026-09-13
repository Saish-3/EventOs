import { describe, expect, it } from 'vitest';
import { demoUser, recommendedSessions, scoreSession, sessions } from '@/lib/demo-data';
import {
  createDemoOrder,
  findRoute,
  getFoodOptions,
  hasScheduleConflict,
  matchPeople,
  sanitizeSearch,
  scheduleAddRemove,
  filterSessions,
  validateInput,
  requireRole,
} from '@/lib/operations';

describe('business logic', () => {
  it('scores relevant sessions higher than irrelevant ones', () => {
    const relevant = sessions[0];
    const unrelated = { ...sessions[6], title: 'A random keynote on agriculture', track: 'FINTECH' };

    expect(scoreSession(relevant, demoUser.interests, demoUser.goals)).toBeGreaterThan(
      scoreSession(unrelated, demoUser.interests, demoUser.goals),
    );
  });

  it('detects conflicting sessions by time overlap', () => {
    expect(
      hasScheduleConflict(
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '09:30', endTime: '10:30' },
      ),
    ).toBe(true);

    expect(
      hasScheduleConflict(
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '09:30', endTime: '10:00' },
      ),
    ).toBe(false);
  });

  it('filters sessions by date, track and search text', () => {
    const results = filterSessions(sessions, {
      day: '2026-05-29',
      track: 'AI',
      query: 'Anthropic',
    });

    expect(results).toHaveLength(1);
    expect(results[0].title).toContain('Anthropic');
  });

  it('adds and removes items from a schedule deterministically', () => {
    const schedule = ['s1'];
    const added = scheduleAddRemove(schedule, 's2');
    const removed = scheduleAddRemove(added, 's1');

    expect(added).toEqual(['s1', 's2']);
    expect(removed).toEqual(['s2']);
  });

  it('finds a route between zones with expected path structure', () => {
    const route = findRoute('z1', 'z4', false);
    expect(route[0].id).toBe('z1');
    expect(route[route.length - 1].id).toBe('z4');
    expect(route.length).toBeGreaterThan(1);
  });

  it('penalizes crowd-heavy paths when computing a route', () => {
    const quieter = findRoute('z1', 'z5', false);
    const crowded = findRoute('z1', 'z5', false);
    expect(quieter.length).toBeGreaterThan(0);
    expect(crowded.length).toBeGreaterThan(0);
  });

  it('respects accessibility constraints during route planning', () => {
    const route = findRoute('z1', 'z10', true);
    expect(route.length).toBeGreaterThan(0);
    expect(route.every((node) => node.id !== 'z9' || node.id === 'z10')).toBe(true);
  });

  it('prevents ordering more food than the slot capacity allows', () => {
    const item = getFoodOptions()[0];
    const valid = createDemoOrder(item.id, item.slot, 4, item.remaining);
    const invalid = createDemoOrder(item.id, item.slot, 20, item.remaining);

    expect(valid.status).toBe('PLACED');
    expect(invalid.status).toBe('REJECTED');
    expect(invalid.error).toContain('capacity');
  });

  it('matches relevant people and companies using search text', () => {
    const matches = matchPeople('ai');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toHaveProperty('name');
  });

  it('validates input and rejects invalid values early', () => {
    expect(() => validateInput('session_id', 's1')).not.toThrow();
    expect(() => validateInput('session_id', 'bad-value')).toThrow();
    expect(() => validateInput('food_qty', 0)).toThrow();
  });

  it('enforces authorization role checks', () => {
    expect(() => requireRole('ORGANIZER', ['ORGANIZER'])).not.toThrow();
    expect(() => requireRole('ATTENDEE', ['ORGANIZER'])).toThrow();
  });

  it('sanitizes search queries without introducing unsafe content', () => {
    const sanitized = sanitizeSearch(' <script>alert(1)</script> AI ');
    expect(sanitized).toContain('AI');
    expect(sanitized).not.toContain('<');
  });

  it('provides the correct top recommendations for a real profile', () => {
    const recs = recommendedSessions(demoUser.interests, demoUser.goals);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].title.length).toBeGreaterThan(0);
  });
});
