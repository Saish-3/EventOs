import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getAttendee } from '@/app/api/attendee/route';
import { GET as getProfile, PATCH as patchProfile } from '@/app/api/attendee/profile/route';
import { GET as getCrowd, POST as postCrowd } from '@/app/api/crowd/route';
import { GET as getNavigation } from '@/app/api/navigation/route';
import { POST as postFoodOrder } from '@/app/api/food/order/route';
import { GET as getPeople } from '@/app/api/network/people/route';
import { GET as getCompanyMatches } from '@/app/api/network/companies/route';
import { GET as getOrganizer } from '@/app/api/organizer/insights/route';
import { POST as postCopilot } from '@/app/api/attendee/copilot/route';

describe('api routes', () => {
  it('returns attendee data for the dashboard', async () => {
    const res = await getAttendee();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.user.name).toBeTruthy();
  });

  it('returns the attendee profile and updates interests', async () => {
    const req = new NextRequest('http://localhost/api/attendee/profile');
    const getRes = await getProfile();
    const patchRes = await patchProfile(new NextRequest('http://localhost/api/attendee/profile', {
      method: 'PATCH',
      body: JSON.stringify({ interests: ['AI agents'], goals: ['build AI products'] }),
      headers: { 'Content-Type': 'application/json' },
    }));

    expect((await getRes.json()).success).toBe(true);
    expect(patchRes.status).toBe(200);
    expect((await patchRes.json()).data.user.interests).toContain('AI agents');
  });

  it('exposes crowd data and simulates surge safely', async () => {
    const getRes = await getCrowd();
    const postRes = await postCrowd(new NextRequest('http://localhost/api/crowd', {
      method: 'POST',
      body: JSON.stringify({ zoneId: 'z1' }),
      headers: { 'Content-Type': 'application/json' },
    }));

    expect((await getRes.json()).success).toBe(true);
    expect(postRes.status).toBe(200);
    expect((await postRes.json()).data.level).toBe('CRITICAL');
  });

  it('validates route navigation inputs and returns a route', async () => {
    const res = await getNavigation(new NextRequest('http://localhost/api/navigation?from=z1&to=z4&accessible=true'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.path[0].id).toBe('z1');
    expect(body.data.path.at(-1).id).toBe('z4');
  });

  it('rejects invalid food orders and accepts valid ones', async () => {
    const valid = await postFoodOrder(new NextRequest('http://localhost/api/food/order', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'f1', slot: '12:40–12:50', quantity: 2 }),
      headers: { 'Content-Type': 'application/json' },
    }));
    const invalid = await postFoodOrder(new NextRequest('http://localhost/api/food/order', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'missing', slot: 'bad' }),
      headers: { 'Content-Type': 'application/json' },
    }));

    expect(valid.status).toBe(200);
    expect(invalid.status).toBe(400);
  });

  it('returns networking matches for search queries', async () => {
    const people = await getPeople(new NextRequest('http://localhost/api/network/people?q=ai'));
    const companies = await getCompanyMatches(new NextRequest('http://localhost/api/network/companies?q=AI'));

    expect((await people.json()).data.length).toBeGreaterThan(0);
    expect((await companies.json()).data.length).toBeGreaterThan(0);
  });

  it('returns organizer insights and requires safe access', async () => {
    const res = await getOrganizer(new NextRequest('http://localhost/api/organizer/insights', {
      headers: { 'x-eventos-role': 'ORGANIZER' },
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveProperty('insight');
  });

  it('answers the copilot with grounded context and valid input', async () => {
    const res = await postCopilot(new NextRequest('http://localhost/api/attendee/copilot', {
      method: 'POST',
      body: JSON.stringify({ message: 'What should I attend next?' }),
      headers: { 'Content-Type': 'application/json' },
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.text).toContain('I');
  });
});
