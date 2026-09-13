// ============================================================
// EventOS — Application Constants
// ============================================================

/** User roles */
export const USER_ROLES = {
  ATTENDEE: 'ATTENDEE',
  ORGANIZER: 'ORGANIZER',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/** Event status */
export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  ENDED: 'ENDED',
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

/** Session types */
export const SESSION_TYPES = {
  TALK: 'TALK',
  PANEL: 'PANEL',
  FIRESIDE: 'FIRESIDE',
  KEYNOTE: 'KEYNOTE',
  WORKSHOP: 'WORKSHOP',
  INAUGURAL: 'INAUGURAL',
} as const;

export type SessionType = (typeof SESSION_TYPES)[keyof typeof SESSION_TYPES];

/** Session tracks */
export const TRACKS = {
  AI: 'AI',
  FINTECH: 'FINTECH',
  STARTUP: 'STARTUP',
  PRODUCT: 'PRODUCT',
  ENGINEERING: 'ENGINEERING',
  KEYNOTE: 'KEYNOTE',
} as const;

export type Track = (typeof TRACKS)[keyof typeof TRACKS];

/** Venue zone types */
export const ZONE_TYPES = {
  ENTRANCE: 'entrance',
  REGISTRATION: 'registration',
  HANGOUT: 'hangout',
  STAGE: 'stage',
  LOUNGE: 'lounge',
  FOOD: 'food',
  MASTERCLASS: 'masterclass',
  STARTUP_SHOWCASE: 'startup_showcase',
  SPONSOR: 'sponsor',
  JOB_FAIR: 'job_fair',
  EXIT: 'exit',
} as const;

export type ZoneType = (typeof ZONE_TYPES)[keyof typeof ZONE_TYPES];

/** Crowd levels */
export const CROWD_LEVELS = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  BUSY: 'BUSY',
  CRITICAL: 'CRITICAL',
} as const;

export type CrowdLevel = (typeof CROWD_LEVELS)[keyof typeof CROWD_LEVELS];

/** Booking statuses */
export const BOOKING_STATUS = {
  BOOKED: 'BOOKED',
  ATTENDED: 'ATTENDED',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

/** Company categories */
export const COMPANY_CATEGORIES = {
  STARTUP_SHOWCASE: 'STARTUP_SHOWCASE',
  JOB_FAIR: 'JOB_FAIR',
  SPONSOR: 'SPONSOR',
  PARTNER: 'PARTNER',
} as const;

export type CompanyCategory = (typeof COMPANY_CATEGORIES)[keyof typeof COMPANY_CATEGORIES];

/** Food item categories */
export const FOOD_CATEGORIES = {
  VEG: 'VEG',
  NON_VEG: 'NON_VEG',
  BEVERAGE: 'BEVERAGE',
  SNACK: 'SNACK',
} as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[keyof typeof FOOD_CATEGORIES];

/** Route paths */
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Attendee
  ATTENDEE_DASHBOARD: '/dashboard',
  ATTENDEE_SCHEDULE: '/schedule',
  ATTENDEE_MAP: '/map',
  ATTENDEE_FOOD: '/food',
  ATTENDEE_NETWORK: '/network',
  ATTENDEE_COPILOT: '/copilot',
  ATTENDEE_PROFILE: '/profile',

  // Organizer
  ORGANIZER_COMMAND: '/command',
  ORGANIZER_SESSIONS: '/sessions',
  ORGANIZER_ATTENDEES: '/attendees',
  ORGANIZER_VENUES: '/venues',
  ORGANIZER_FOOD: '/org-food',
  ORGANIZER_ANALYTICS: '/analytics',

  // API
  API_AUTH_LOGIN: '/api/auth/login',
  API_AUTH_REGISTER: '/api/auth/register',
  API_AUTH_ME: '/api/auth/me',
  API_AUTH_LOGOUT: '/api/auth/logout',
} as const;
