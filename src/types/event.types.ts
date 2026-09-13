// ============================================================
// EventOS — Shared Type Definitions
// ============================================================

import type {
  UserRole,
  EventStatus,
  SessionType,
  Track,
  ZoneType,
  CrowdLevel,
  BookingStatus,
  CompanyCategory,
  FoodCategory,
} from '@/lib/constants';

// ────────────────────────────────────────────────────────────
// Source Attribution — attached to any record from official data
// ────────────────────────────────────────────────────────────

export interface SourceAttribution {
  sourceUrl: string | null;
  sourceName: string | null;
  isSimulated: boolean;
}

// ────────────────────────────────────────────────────────────
// API Response Wrapper
// ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// ────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  jobTitle?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// ────────────────────────────────────────────────────────────
// Event
// ────────────────────────────────────────────────────────────

export interface EventDTO extends SourceAttribution {
  id: string;
  name: string;
  slug: string;
  description: string;
  theme: string | null;
  startDate: string;
  endDate: string;
  status: EventStatus;
  estimatedCapacity: number | null;
  simulatedLiveAttendance: number | null;
  organizerName: string | null;
  websiteUrl: string | null;
}

// ────────────────────────────────────────────────────────────
// Venue & Zones
// ────────────────────────────────────────────────────────────

export interface VenueDTO extends SourceAttribution {
  id: string;
  name: string;
  address: string;
  city: string;
  mapDisclaimer: string;
  zones: VenueZoneDTO[];
}

export interface VenueZoneDTO extends SourceAttribution {
  id: string;
  zoneNumber: number;
  name: string;
  subtitle: string | null;
  type: ZoneType;
  floor: number;
  x: number;
  y: number;
  capacity: number | null;
  accessible: boolean;
  crowdLevel: CrowdLevel;
}

// ────────────────────────────────────────────────────────────
// Sessions
// ────────────────────────────────────────────────────────────

export interface SessionDTO extends SourceAttribution {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  speaker: string | null;
  speakerRole: string | null;
  company: string | null;
  sessionType: SessionType;
  track: Track | null;
  venueZoneName: string | null;
}

// ────────────────────────────────────────────────────────────
// Masterclasses
// ────────────────────────────────────────────────────────────

export interface MasterclassDTO extends SourceAttribution {
  id: string;
  title: string;
  description: string | null;
  speaker: string;
  speakerRole: string | null;
  organization: string | null;
  date: string;
  startTime: string;
  endTime: string;
  sessionCapacity: number | null;
  registeredCount: number;
  availableSeats: number | null;
  registrationUrl: string | null;
}

// ────────────────────────────────────────────────────────────
// Pass Types
// ────────────────────────────────────────────────────────────

export interface PassTypeDTO extends SourceAttribution {
  id: string;
  name: string;
  price: number;
  currency: string;
  foodIncluded: boolean;
  networkingAccess: boolean;
  masterclassAccess: boolean;
  jobFairAccess: boolean;
  ventureArenaAccess: boolean;
  awardsAccess: boolean;
  afterPartyAccess: boolean;
  mainStageAccess: boolean;
  merchIncluded: boolean;
  approvalRequired: boolean;
}

// ────────────────────────────────────────────────────────────
// Companies
// ────────────────────────────────────────────────────────────

export interface CompanyDTO extends SourceAttribution {
  id: string;
  name: string;
  description: string | null;
  category: CompanyCategory;
  sector: string | null;
  website: string | null;
  venueZoneName: string | null;
}

// ────────────────────────────────────────────────────────────
// Food
// ────────────────────────────────────────────────────────────

export interface FoodVendorDTO {
  id: string;
  name: string;
  description: string | null;
  cuisine: string | null;
  isDemo: boolean;
  items: FoodItemDTO[];
}

export interface FoodItemDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  category: FoodCategory;
  available: boolean;
  prepTime: number;
  isSimulated: boolean;
}

// ────────────────────────────────────────────────────────────
// Crowd Intelligence
// ────────────────────────────────────────────────────────────

export interface CrowdSnapshotDTO {
  zoneId: string;
  zoneName: string;
  level: CrowdLevel;
  count: number | null;
  timestamp: string;
  isSimulated: boolean;
}
