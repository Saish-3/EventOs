// ============================================================
// EventOS — Seed Script
// Populates the database with Mumbai Tech Week 2026 data.
//
// Data sources:
//   - Official: https://mumbaitechweek.com/ (various pages)
//   - Simulated: EventOS demo data (clearly marked isSimulated: true)
//
// DISCLAIMER: EventOS is an independent hackathon prototype.
// It is NOT affiliated with, endorsed by, or operated by
// Mumbai Tech Week or TEAM.
// ============================================================

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const MTW_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/',
};

const MTW_MAP_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/map/',
};

const MTW_PROGRAMMING_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/programming/',
};

const MTW_PASSES_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/passes/',
};

const MTW_MASTERCLASS_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/masterclasses/',
};

const MTW_SHOWCASE_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/early-stage-showcase/',
};

const MTW_JOBFAIR_SOURCE = {
  sourceName: 'Mumbai Tech Week Official Website',
  sourceUrl: 'https://mumbaitechweek.com/job-fair/',
};

const EVENTOS_SIMULATED = {
  sourceName: 'EventOS Simulation',
  sourceUrl: null,
  isSimulated: true,
};

async function main() {
  console.log('🌱 Seeding EventOS database...\n');

  // ──────────────────────────────────────────────────────────
  // 1. EVENT
  // ──────────────────────────────────────────────────────────
  console.log('📅 Creating event: Mumbai Tech Week 2026');
  const event = await prisma.event.create({
    data: {
      name: 'Mumbai Tech Week 2026',
      slug: 'mumbai-tech-week-2026',
      description:
        "Asia's biggest AI festival. Two days, 50+ speakers, founders, builders, policymakers, and global leaders shaping the future of technology, AI, and innovation in India.",
      theme: 'AI in Action',
      startDate: new Date('2026-05-29T09:00:00+05:30'),
      endDate: new Date('2026-05-30T21:00:00+05:30'),
      status: 'UPCOMING',
      estimatedCapacity: 10000,
      simulatedLiveAttendance: 7842,
      organizerName: 'Tech Entrepreneurs Association of Mumbai',
      websiteUrl: 'https://mumbaitechweek.com/',
      ...MTW_SOURCE,
      isSimulated: false,
    },
  });

  // ──────────────────────────────────────────────────────────
  // 2. VENUE
  // ──────────────────────────────────────────────────────────
  console.log('🏢 Creating venue: Jio World Convention Centre');
  const venue = await prisma.venue.create({
    data: {
      name: 'Jio World Convention Centre',
      address: 'Jio World Centre, G Block BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'IN',
      floorCount: 1,
      mapDisclaimer: 'Simplified digital venue map — not to scale.',
      eventId: event.id,
      ...MTW_MAP_SOURCE,
      isSimulated: false,
    },
  });

  // ──────────────────────────────────────────────────────────
  // 3. VENUE ZONES (13 Official Zones)
  // ──────────────────────────────────────────────────────────
  console.log('🗺️  Creating 13 venue zones');
  const zoneData = [
    { zoneNumber: 1, name: 'The Gateway', subtitle: 'Enter the World of MTW', type: 'entrance', x: 0, y: 6 },
    { zoneNumber: 2, name: 'Registration', subtitle: "Let's Band Up", type: 'registration', x: 2, y: 6 },
    { zoneNumber: 3, name: 'Docking Area', subtitle: 'Hangout Area', type: 'hangout', x: 4, y: 6 },
    { zoneNumber: 4, name: 'CST', subtitle: 'Creator Source Terminal — Main Stage Area', type: 'stage', x: 6, y: 4 },
    { zoneNumber: 5, name: 'TEAM Lounge', subtitle: null, type: 'lounge', x: 4, y: 4 },
    { zoneNumber: 6, name: 'Foundry Bay', subtitle: 'VIP Lounge', type: 'lounge', x: 2, y: 4 },
    { zoneNumber: 7, name: 'The Origin Harbour', subtitle: 'TEAM Stage', type: 'stage', x: 6, y: 2 },
    { zoneNumber: 8, name: 'The Fuel Dock', subtitle: 'F&B Area', type: 'food', x: 4, y: 2 },
    { zoneNumber: 9, name: 'Idea Transfer Platform', subtitle: 'Breakout Zone — Masterclasses', type: 'masterclass', x: 2, y: 2 },
    { zoneNumber: 10, name: 'Launch Arena', subtitle: 'Early Stage Startup Showcase', type: 'startup_showcase', x: 0, y: 2 },
    { zoneNumber: 11, name: 'Expo Port', subtitle: 'Sponsors', type: 'sponsor', x: 0, y: 4 },
    { zoneNumber: 12, name: 'Uplink Terminal', subtitle: 'Job Fair', type: 'job_fair', x: 8, y: 4 },
    { zoneNumber: 13, name: 'Exit', subtitle: null, type: 'exit', x: 8, y: 6 },
  ];

  const zones: Record<number, string> = {};
  for (const z of zoneData) {
    const zone = await prisma.venueZone.create({
      data: {
        zoneNumber: z.zoneNumber,
        name: z.name,
        subtitle: z.subtitle,
        type: z.type,
        floor: 1,
        x: z.x,
        y: z.y,
        accessible: true,
        crowdLevel: 'LOW',
        venueId: venue.id,
        ...MTW_MAP_SOURCE,
        isSimulated: false,
      },
    });
    zones[z.zoneNumber] = zone.id;
  }

  // ──────────────────────────────────────────────────────────
  // 4. NAVIGATION EDGES (Simplified graph)
  // ──────────────────────────────────────────────────────────
  console.log('🔗 Creating navigation graph edges');
  const edges = [
    // Gateway → Registration → Docking Area (main entrance path)
    [1, 2, 1.0], [2, 3, 1.0],
    // Docking Area branches
    [3, 4, 1.5], [3, 5, 1.0], [3, 8, 1.5],
    // TEAM Lounge connections
    [5, 4, 1.0], [5, 6, 1.0], [5, 8, 1.0],
    // Foundry Bay (VIP) connections
    [6, 11, 1.0], [6, 9, 1.5],
    // CST (Main Stage) connections
    [4, 7, 1.5], [4, 12, 1.5],
    // The Origin Harbour (TEAM Stage) connections
    [7, 8, 1.0], [7, 12, 1.5],
    // Fuel Dock (F&B) connections
    [8, 9, 1.0],
    // Idea Transfer Platform connections
    [9, 10, 1.0],
    // Launch Arena connections
    [10, 11, 1.0],
    // Uplink Terminal connections
    [12, 13, 1.5],
    // Exit also accessible from Docking Area
    [3, 13, 2.0],
  ] as const;

  for (const [from, to, weight] of edges) {
    await prisma.venueEdge.create({
      data: {
        fromZoneId: zones[from],
        toZoneId: zones[to],
        weight,
        accessible: true,
        isSimulated: true,
      },
    });
    // Bidirectional
    await prisma.venueEdge.create({
      data: {
        fromZoneId: zones[to],
        toZoneId: zones[from],
        weight,
        accessible: true,
        isSimulated: true,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 5. SESSIONS (Main Stage Programming)
  // ──────────────────────────────────────────────────────────
  console.log('🎤 Creating main stage sessions');
  const day1 = new Date('2026-05-29T00:00:00+05:30');
  const day2 = new Date('2026-05-30T00:00:00+05:30');
  const mainStageZoneId = zones[4]; // CST

  const sessionsData = [
    // Day 1
    { title: 'MTW 2026 Inaugural Address & Kickoff', company: 'TEAM', speaker: 'Members of Tech Entrepreneurs Association of Mumbai', speakerRole: 'Organizer', startTime: '9:30 AM', endTime: '10:00 AM', date: day1, sessionType: 'INAUGURAL', track: 'KEYNOTE' },
    { title: 'Opening Address', company: 'Government of Maharashtra', speaker: 'TBA', speakerRole: 'Government of Maharashtra', startTime: '10:00 AM', endTime: '11:30 AM', date: day1, sessionType: 'KEYNOTE', track: 'KEYNOTE' },
    { title: 'Anthropic on AI', company: 'Anthropic', speaker: 'Irina Ghose', speakerRole: 'Managing Director, Anthropic India', startTime: '11:40 AM', endTime: '12:10 PM', date: day1, sessionType: 'TALK', track: 'AI' },
    { title: 'OpenAI Session', company: 'OpenAI', speaker: 'Pragya Misra, Thomas Jeng, Arjun Gupta', speakerRole: 'Head of Strategy India; Head of Startups APAC; AI Deployment Engineer', startTime: '12:20 PM', endTime: '1:00 PM', date: day1, sessionType: 'TALK', track: 'AI' },
    { title: 'IDFC FIRST Bank on Technology & Banking', company: 'IDFC FIRST Bank', speaker: 'V. Vaidyanathan', speakerRole: 'MD & CEO, IDFC FIRST Bank', startTime: '1:10 PM', endTime: '1:50 PM', date: day1, sessionType: 'TALK', track: 'FINTECH' },
    { title: 'Swiggy: Building with AI', company: 'Swiggy', speaker: 'Madhusudhan Rao', speakerRole: 'CTO, Swiggy', startTime: '2:00 PM', endTime: '2:20 PM', date: day1, sessionType: 'TALK', track: 'PRODUCT' },
    { title: 'Fireside Chat: The Future of Digital Payments', company: 'NPCI', speaker: 'Dilip Asbe', speakerRole: 'MD & CEO, NPCI', startTime: '2:30 PM', endTime: '2:50 PM', date: day1, sessionType: 'FIRESIDE', track: 'FINTECH' },
    { title: 'Urban Company: Scaling Services with AI', company: 'Urban Company', speaker: 'Raghav Chandra', speakerRole: 'Co-Founder, Urban Company', startTime: '3:00 PM', endTime: '3:20 PM', date: day1, sessionType: 'TALK', track: 'STARTUP' },
    { title: 'Google Cloud: AI Infrastructure for India', company: 'Google Cloud', speaker: 'Arun Srinivas', speakerRole: 'VP & GM, Google Cloud India', startTime: '3:30 PM', endTime: '3:50 PM', date: day1, sessionType: 'TALK', track: 'AI' },
    { title: 'PhonePe: Building India\'s Digital Economy', company: 'PhonePe', speaker: 'Sameer Nigam', speakerRole: 'Founder & CEO, PhonePe', startTime: '4:00 PM', endTime: '4:20 PM', date: day1, sessionType: 'TALK', track: 'FINTECH' },
    { title: 'Meta: The AI-First Future', company: 'Meta', speaker: 'Sandhya Devanathan', speakerRole: 'VP, India, Meta', startTime: '4:30 PM', endTime: '4:50 PM', date: day1, sessionType: 'TALK', track: 'AI' },
    { title: 'MakeMyTrip: AI in Travel', company: 'MakeMyTrip', speaker: 'Rajesh Magow', speakerRole: 'Group CEO, MakeMyTrip', startTime: '5:00 PM', endTime: '5:20 PM', date: day1, sessionType: 'TALK', track: 'PRODUCT' },

    // Day 2 — Sessions from scraped data
    { title: 'Netcore Cloud: AI-Powered Customer Engagement', company: 'Netcore Cloud', speaker: 'Kalpit Jain', speakerRole: 'Group CEO, Netcore Cloud', startTime: '10:00 AM', endTime: '10:20 AM', date: day2, sessionType: 'TALK', track: 'AI' },
    { title: 'Servify: Building a Global Platform from India', company: 'Servify', speaker: 'Sreevathsa Prabhakar', speakerRole: 'Founder & CEO, Servify', startTime: '10:30 AM', endTime: '10:50 AM', date: day2, sessionType: 'TALK', track: 'STARTUP' },
    { title: 'The AI Agent Stack', company: 'TBA', speaker: 'TBA', speakerRole: 'TBA', startTime: '11:00 AM', endTime: '11:30 AM', date: day2, sessionType: 'PANEL', track: 'AI' },
    { title: 'Building AI-First Products in India', company: 'TBA', speaker: 'TBA', speakerRole: 'TBA', startTime: '11:40 AM', endTime: '12:10 PM', date: day2, sessionType: 'PANEL', track: 'PRODUCT' },
    { title: 'Early Stage Startup Showcase', company: 'Various', speaker: 'VC-Curated Startups', speakerRole: 'Founders', startTime: '12:30 PM', endTime: '3:00 PM', date: day2, sessionType: 'WORKSHOP', track: 'STARTUP' },
    { title: 'AI Excellence Awards', company: 'Mumbai Tech Week', speaker: 'TBA', speakerRole: 'TBA', startTime: '5:00 PM', endTime: '6:30 PM', date: day2, sessionType: 'KEYNOTE', track: 'AI' },
  ];

  for (const s of sessionsData) {
    await prisma.session.create({
      data: {
        title: s.title,
        company: s.company,
        speaker: s.speaker,
        speakerRole: s.speakerRole,
        startTime: s.startTime,
        endTime: s.endTime,
        date: s.date,
        sessionType: s.sessionType,
        track: s.track,
        eventId: event.id,
        venueZoneId: mainStageZoneId,
        ...MTW_PROGRAMMING_SOURCE,
        isSimulated: false,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 6. MASTERCLASSES
  // ──────────────────────────────────────────────────────────
  console.log('📚 Creating masterclasses');
  const masterclassZoneId = zones[9]; // Idea Transfer Platform

  const masterclassData = [
    // Day 1
    { title: 'The Future of AI: From Research to Reality', speaker: 'Ojasvi Bhatia', speakerRole: 'Lead — AI Partnerships', organization: 'TBA', date: day1, startTime: '12:45 PM', endTime: '1:30 PM', registrationUrl: 'https://luma.com/iccsbrpb', sessionCapacity: 50 },
    { title: 'Beyond Context Engineering: The Case for Domain-Specific LLMs', speaker: 'Krishanu Adhikary', speakerRole: 'Market Innovation', organization: 'NPCI', date: day1, startTime: '1:45 PM', endTime: '2:30 PM', registrationUrl: 'https://luma.com/lvqfl10k', sessionCapacity: 50 },
    { title: 'From Idea to Production App in 45 Minutes', speaker: 'Syed Adil', speakerRole: 'Head, India Growth', organization: 'Replit', date: day1, startTime: '2:45 PM', endTime: '3:30 PM', registrationUrl: 'https://luma.com/fy9pifue', sessionCapacity: 50 },
    { title: 'Building with Codex', speaker: 'Swagata Dutta, Arjun Gupta', speakerRole: 'OpenAI Engineers', organization: 'OpenAI', date: day1, startTime: '3:45 PM', endTime: '4:30 PM', registrationUrl: 'https://luma.com/xqfas6y5', sessionCapacity: 50 },
    { title: 'Agentic AI and Generative AI for Enterprises: Building Secure, Production-Ready Systems', speaker: 'Jemima Joy Thangaraj', speakerRole: 'Head of AI Build', organization: 'NPCI', date: day1, startTime: '4:45 PM', endTime: '5:30 PM', registrationUrl: 'https://luma.com/j58phrq8', sessionCapacity: 50 },

    // Day 2
    { title: 'Run Your Entire Business From One Dashboard — Built Live on Replit', speaker: 'Syed Adil', speakerRole: 'Head, India Growth', organization: 'Replit', date: day2, startTime: '11:15 AM', endTime: '12:00 PM', registrationUrl: 'https://luma.com/ixe6i6jf', sessionCapacity: 50 },
    { title: 'Staying Calm in the Current Cyberstorm', speaker: 'Vishal Dubey', speakerRole: 'Speaker', organization: 'Made in Mumbai', date: day2, startTime: '12:15 PM', endTime: '1:00 PM', registrationUrl: 'https://luma.com/r15akvpu', sessionCapacity: 50 },
    { title: 'Business AI on WhatsApp', speaker: 'Rohant Shyam Rammohan', speakerRole: 'Lead Business Development, SBM', organization: 'Meta', date: day2, startTime: '1:15 PM', endTime: '2:00 PM', registrationUrl: 'https://luma.com/gksoedpc', sessionCapacity: 50 },
    { title: 'Hiring Engineers in the AI Era: The New Interview Loop', speaker: 'Siddharth Maheshwari, Gaurav Kapatia', speakerRole: 'Co-founder; Head of Engineering', organization: 'Newton School of Technology', date: day2, startTime: '2:15 PM', endTime: '3:00 PM', registrationUrl: 'https://luma.com/it051flq', sessionCapacity: 50 },
    { title: 'AI Builders: From Ideas to Innovation', speaker: 'Meenal Majumder', speakerRole: 'TBA', organization: 'TBA', date: day2, startTime: '3:15 PM', endTime: '4:00 PM', registrationUrl: null, sessionCapacity: 50 },
    { title: 'The Engineering Contract: What Every Engineering Team Needs From Agentic Systems', speaker: 'Yash Kalwani', speakerRole: 'Head of Engineering', organization: 'Saral', date: day2, startTime: '4:15 PM', endTime: '5:00 PM', registrationUrl: 'https://luma.com/m502mhrr', sessionCapacity: 50 },
  ];

  for (const mc of masterclassData) {
    await prisma.masterclass.create({
      data: {
        title: mc.title,
        speaker: mc.speaker,
        speakerRole: mc.speakerRole,
        organization: mc.organization,
        date: mc.date,
        startTime: mc.startTime,
        endTime: mc.endTime,
        sessionCapacity: mc.sessionCapacity,
        registeredCount: Math.floor(Math.random() * 35) + 10, // Simulated registration count
        registrationUrl: mc.registrationUrl,
        eventId: event.id,
        venueZoneId: masterclassZoneId,
        ...MTW_MASTERCLASS_SOURCE,
        isSimulated: false, // Masterclass info is from official source; registeredCount is simulated
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 7. PASS TYPES
  // ──────────────────────────────────────────────────────────
  console.log('🎫 Creating pass types');
  const passTypes = [
    { name: 'Student', price: 1999, foodIncluded: false, networkingAccess: false, awardsAccess: false, afterPartyAccess: false, merchIncluded: false, approvalRequired: false, notes: 'Carry a valid student ID to the event' },
    { name: 'PRO (Both days)', price: 9999, foodIncluded: false, networkingAccess: false, awardsAccess: false, afterPartyAccess: false, merchIncluded: false, approvalRequired: false },
    { name: 'PRO (Day 2 only)', price: 6999, foodIncluded: false, networkingAccess: false, awardsAccess: false, afterPartyAccess: false, merchIncluded: false, approvalRequired: false, dayRestriction: 'DAY_2' },
    { name: 'Premium', price: 29999, foodIncluded: true, networkingAccess: true, awardsAccess: true, afterPartyAccess: false, merchIncluded: true, approvalRequired: false },
    { name: 'All-Access', price: 49999, foodIncluded: true, networkingAccess: true, awardsAccess: true, afterPartyAccess: true, merchIncluded: true, approvalRequired: true, notes: 'Exclusive access to the complete MTW experience including Awards and afterparty' },
  ];

  const passTypeRecords: Record<string, string> = {};
  for (const pt of passTypes) {
    const record = await prisma.passType.create({
      data: {
        name: pt.name,
        price: pt.price,
        foodIncluded: pt.foodIncluded,
        networkingAccess: pt.networkingAccess,
        awardsAccess: pt.awardsAccess,
        afterPartyAccess: pt.afterPartyAccess,
        merchIncluded: pt.merchIncluded,
        approvalRequired: pt.approvalRequired,
        dayRestriction: pt.dayRestriction ?? null,
        notes: pt.notes ?? null,
        eventId: event.id,
        ...MTW_PASSES_SOURCE,
        isSimulated: false,
      },
    });
    passTypeRecords[pt.name] = record.id;
  }

  // ──────────────────────────────────────────────────────────
  // 8. COMPANIES — Startup Showcase
  // ──────────────────────────────────────────────────────────
  console.log('🚀 Creating startup showcase companies');
  const showcaseStartups = [
    'AI Humanize', 'Ambitio', 'Bolna', 'BugRaid AI', 'Cloudanix',
    'ConscioussAI', 'craftAI', 'CredResolve', 'EMoMee', 'extraaedge',
    'FarMart', 'GoKwik', 'GreyLabs AI', 'Grexa', 'Helium',
    'Ignosis AI', 'JuriSynk', 'Kairosity', 'KuboCare', 'Lemonpeel',
    'Lucio', 'Mavs AI', 'modus ai', 'Mosaic Wellness', 'MulltiplyAI',
    'Noveum', 'nugget.ai', 'Ostronaut', 'Phot.AI', 'RevRag AI',
    'Rezolv', 'Ringg', 'ruzo', 'STORIA', 'TerraStack',
    'videosdk', 'Zonko',
  ];

  for (const name of showcaseStartups) {
    await prisma.company.create({
      data: {
        name,
        category: 'STARTUP_SHOWCASE',
        sector: 'AI',
        eventId: event.id,
        venueZoneId: zones[10], // Launch Arena
        ...MTW_SHOWCASE_SOURCE,
        isSimulated: false,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 9. COMPANIES — Job Fair
  // ──────────────────────────────────────────────────────────
  console.log('💼 Creating job fair companies');
  const jobFairCompanies = [
    'Assurekit', 'Drip', 'Excedor', 'FanCode', 'FlexiLoans',
    'Fractal', 'Hungama', 'IDFC FIRST Bank', 'LogiNext', 'NPCI',
    'Nazara', 'PPC', 'Pepperfry', 'Pixeldust', 'Quantiphi',
    'Rebel', 'Rezolv', 'RippleHire', 'Select AI', 'Servify',
    'Shaadi.com', 'Trackwizz', 'Upliance AI',
  ];

  for (const name of jobFairCompanies) {
    await prisma.company.create({
      data: {
        name,
        category: 'JOB_FAIR',
        eventId: event.id,
        venueZoneId: zones[12], // Uplink Terminal
        ...MTW_JOBFAIR_SOURCE,
        isSimulated: false,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 10. DEMO FOOD VENDORS (EventOS Smart Food Prototype)
  // ──────────────────────────────────────────────────────────
  console.log('🍽️  Creating demo food vendors');
  const fuelDockZoneId = zones[8]; // The Fuel Dock

  const vendorA = await prisma.foodVendor.create({
    data: {
      name: 'Demo Food Vendor A — Mumbai Bites',
      description: 'EventOS demo vendor. Not an official MTW vendor.',
      cuisine: 'Indian Street Food',
      isDemo: true,
      eventId: event.id,
      venueZoneId: fuelDockZoneId,
      ...EVENTOS_SIMULATED,
    },
  });

  const vendorB = await prisma.foodVendor.create({
    data: {
      name: 'Demo Food Vendor B — Green Bowl',
      description: 'EventOS demo vendor. Not an official MTW vendor.',
      cuisine: 'Healthy Bowls & Salads',
      isDemo: true,
      eventId: event.id,
      venueZoneId: fuelDockZoneId,
      ...EVENTOS_SIMULATED,
    },
  });

  const vendorC = await prisma.foodVendor.create({
    data: {
      name: 'Demo Food Vendor C — Chai Junction',
      description: 'EventOS demo vendor. Not an official MTW vendor.',
      cuisine: 'Beverages & Snacks',
      isDemo: true,
      eventId: event.id,
      venueZoneId: fuelDockZoneId,
      ...EVENTOS_SIMULATED,
    },
  });

  // Food items
  const foodItems = [
    { name: 'Vada Pav', price: 80, category: 'VEG', vendorId: vendorA.id, prepTime: 5 },
    { name: 'Pav Bhaji', price: 150, category: 'VEG', vendorId: vendorA.id, prepTime: 10 },
    { name: 'Chicken Biryani', price: 250, category: 'NON_VEG', vendorId: vendorA.id, prepTime: 15 },
    { name: 'Paneer Tikka Wrap', price: 180, category: 'VEG', vendorId: vendorA.id, prepTime: 8 },
    { name: 'Quinoa Buddha Bowl', price: 280, category: 'VEG', vendorId: vendorB.id, prepTime: 10 },
    { name: 'Grilled Chicken Salad', price: 300, category: 'NON_VEG', vendorId: vendorB.id, prepTime: 12 },
    { name: 'Avocado Toast', price: 200, category: 'VEG', vendorId: vendorB.id, prepTime: 7 },
    { name: 'Masala Chai', price: 50, category: 'BEVERAGE', vendorId: vendorC.id, prepTime: 3 },
    { name: 'Cold Brew Coffee', price: 150, category: 'BEVERAGE', vendorId: vendorC.id, prepTime: 2 },
    { name: 'Fresh Lime Soda', price: 80, category: 'BEVERAGE', vendorId: vendorC.id, prepTime: 3 },
    { name: 'Samosa (2 pcs)', price: 60, category: 'SNACK', vendorId: vendorC.id, prepTime: 5 },
    { name: 'Energy Bar', price: 100, category: 'SNACK', vendorId: vendorC.id, prepTime: 1 },
  ];

  for (const item of foodItems) {
    await prisma.foodItem.create({
      data: { ...item, isSimulated: true },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 11. SYNTHETIC DEMO ATTENDEES
  // ──────────────────────────────────────────────────────────
  console.log('👥 Creating synthetic demo attendees');
  const passwordHash = await hash('eventos2026', 10);

  const attendees = [
    { name: 'Priya Sharma', email: 'priya@demo.eventos.dev', company: 'NeuralStack AI', jobTitle: 'AI Engineer', interests: '["AI agents","LLMs","computer vision"]', eventGoals: '["learn about AI deployment","meet AI startups","find co-founder"]', passType: 'PRO (Both days)' },
    { name: 'Arjun Mehta', email: 'arjun@demo.eventos.dev', company: 'Finova Capital', jobTitle: 'Investment Associate', interests: '["fintech","AI","early-stage startups"]', eventGoals: '["scout startups","network with founders","attend AI talks"]', passType: 'Premium' },
    { name: 'Sneha Patel', email: 'sneha@demo.eventos.dev', company: 'BuildRight Studios', jobTitle: 'Product Manager', interests: '["product strategy","AI in products","user research"]', eventGoals: '["learn AI product patterns","attend masterclasses","hire engineers"]', passType: 'PRO (Both days)' },
    { name: 'Rahul Desai', email: 'rahul@demo.eventos.dev', company: 'CloudNative Labs', jobTitle: 'Full Stack Developer', interests: '["web development","cloud infrastructure","AI APIs"]', eventGoals: '["learn from tech talks","find job opportunities","network"]', passType: 'Student' },
    { name: 'Ananya Iyer', email: 'ananya@demo.eventos.dev', company: 'DesignForge', jobTitle: 'UX Designer', interests: '["AI UX","design systems","accessibility"]', eventGoals: '["explore AI tools for design","attend workshops","meet product teams"]', passType: 'PRO (Both days)' },
    { name: 'Vikram Joshi', email: 'vikram@demo.eventos.dev', company: 'ScaleUp Ventures', jobTitle: 'General Partner', interests: '["AI infrastructure","SaaS","deeptech"]', eventGoals: '["evaluate startups","meet founders","participate in showcase"]', passType: 'All-Access' },
    { name: 'Meera Krishnan', email: 'meera@demo.eventos.dev', company: 'TechTalent Solutions', jobTitle: 'Recruiter', interests: '["AI talent","hiring","employer branding"]', eventGoals: '["recruit at job fair","network with candidates","attend hiring masterclass"]', passType: 'PRO (Both days)' },
    { name: 'Karthik Nair', email: 'karthik@demo.eventos.dev', company: 'DataMind Analytics', jobTitle: 'Data Scientist', interests: '["machine learning","NLP","recommendation systems"]', eventGoals: '["learn about LLMs","see startup showcase","find collaborators"]', passType: 'Student' },
    { name: 'Riya Gupta', email: 'riya@demo.eventos.dev', company: 'LaunchPad Accelerator', jobTitle: 'Startup Operator', interests: '["startup operations","fundraising","growth"]', eventGoals: '["support portfolio companies","meet investors","learn AI trends"]', passType: 'Premium' },
    { name: 'Aditya Rao', email: 'aditya@demo.eventos.dev', company: 'Quantum Edge', jobTitle: 'CTO & Co-Founder', interests: '["AI agents","infrastructure","developer tools"]', eventGoals: '["showcase at Launch Arena","meet VCs","hire engineers"]', passType: 'All-Access' },
    { name: 'Nisha Verma', email: 'nisha@demo.eventos.dev', company: 'IIT Bombay', jobTitle: 'CS Student', interests: '["AI research","open source","hackathons"]', eventGoals: '["learn from industry leaders","find internships","attend workshops"]', passType: 'Student' },
    { name: 'Sanjay Kumar', email: 'sanjay@demo.eventos.dev', company: 'Enterprise Solutions Corp', jobTitle: 'VP Engineering', interests: '["enterprise AI","system design","team building"]', eventGoals: '["evaluate AI tools","attend enterprise sessions","recruit senior talent"]', passType: 'Premium' },
    { name: 'Tara Singh', email: 'tara@demo.eventos.dev', company: 'GreenTech Innovations', jobTitle: 'Founder & CEO', interests: '["climate tech","AI for sustainability","impact investing"]', eventGoals: '["pitch at showcase","meet impact investors","learn AI applications"]', passType: 'PRO (Both days)' },
    { name: 'Dev Patel', email: 'dev@demo.eventos.dev', company: 'PixelCraft Games', jobTitle: 'Game Developer', interests: '["AI in gaming","generative art","interactive media"]', eventGoals: '["explore AI tools","attend creative sessions","find partnerships"]', passType: 'PRO (Day 2 only)' },
    { name: 'Zara Khan', email: 'zara@demo.eventos.dev', company: 'HealthAI Diagnostics', jobTitle: 'ML Engineer', interests: '["healthcare AI","medical imaging","regulatory tech"]', eventGoals: '["attend health AI sessions","meet investors","explore partnerships"]', passType: 'PRO (Both days)' },
  ];

  // Create organizer account
  const organizer = await prisma.user.create({
    data: {
      name: 'EventOS Admin',
      email: 'admin@eventos.dev',
      passwordHash,
      role: 'ORGANIZER',
      company: 'EventOS',
      jobTitle: 'Event Operations',
      isSimulated: true,
    },
  });

  // Create attendees and register them
  for (const att of attendees) {
    const user = await prisma.user.create({
      data: {
        name: att.name,
        email: att.email,
        passwordHash,
        role: 'ATTENDEE',
        company: att.company,
        jobTitle: att.jobTitle,
        interests: att.interests,
        eventGoals: att.eventGoals,
        isSimulated: true,
      },
    });

    // Register for event
    await prisma.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        passTypeId: passTypeRecords[att.passType],
        checkedIn: Math.random() > 0.3, // ~70% checked in for demo
        qrCode: `EVENTOS-${event.slug}-${user.id}`,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 12. SIMULATED CROWD SNAPSHOTS
  // ──────────────────────────────────────────────────────────
  console.log('📊 Creating simulated crowd snapshots');
  const crowdLevels: Array<{ zoneNum: number; level: string; count: number }> = [
    { zoneNum: 1, level: 'MODERATE', count: 120 },
    { zoneNum: 2, level: 'BUSY', count: 280 },
    { zoneNum: 3, level: 'MODERATE', count: 450 },
    { zoneNum: 4, level: 'BUSY', count: 1200 },
    { zoneNum: 5, level: 'LOW', count: 85 },
    { zoneNum: 6, level: 'LOW', count: 40 },
    { zoneNum: 7, level: 'MODERATE', count: 350 },
    { zoneNum: 8, level: 'BUSY', count: 520 },
    { zoneNum: 9, level: 'MODERATE', count: 45 },
    { zoneNum: 10, level: 'BUSY', count: 380 },
    { zoneNum: 11, level: 'MODERATE', count: 290 },
    { zoneNum: 12, level: 'MODERATE', count: 200 },
    { zoneNum: 13, level: 'LOW', count: 30 },
  ];

  for (const cs of crowdLevels) {
    await prisma.crowdSnapshot.create({
      data: {
        level: cs.level,
        count: cs.count,
        eventId: event.id,
        venueZoneId: zones[cs.zoneNum],
        isSimulated: true,
      },
    });

    // Update zone crowd level
    await prisma.venueZone.update({
      where: { id: zones[cs.zoneNum] },
      data: { crowdLevel: cs.level },
    });
  }

  // ──────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────
  const counts = {
    events: await prisma.event.count(),
    venues: await prisma.venue.count(),
    zones: await prisma.venueZone.count(),
    edges: await prisma.venueEdge.count(),
    sessions: await prisma.session.count(),
    masterclasses: await prisma.masterclass.count(),
    passTypes: await prisma.passType.count(),
    companies: await prisma.company.count(),
    users: await prisma.user.count(),
    registrations: await prisma.eventRegistration.count(),
    foodVendors: await prisma.foodVendor.count(),
    foodItems: await prisma.foodItem.count(),
    crowdSnapshots: await prisma.crowdSnapshot.count(),
  };

  console.log('\n✅ Seed complete!\n');
  console.log('📊 Database summary:');
  Object.entries(counts).forEach(([key, val]) => {
    console.log(`   ${key}: ${val}`);
  });
  console.log('\n🔑 Demo credentials:');
  console.log('   Organizer: admin@eventos.dev / eventos2026');
  console.log('   Attendee:  priya@demo.eventos.dev / eventos2026');
  console.log('   (All demo attendees use password: eventos2026)\n');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
