export type UserRole = 'ORGANIZER' | 'AUTHORITY' | 'VENUE_MANAGER';

export type BookingStatus = 'pending' | 'approved' | 'rejected';
export type PermitStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  images: string[];
  managerId: string;
  managerName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  district: string;
  availability: boolean;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  startDate: string;
  endDate: string;
  attendees: number;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
  totalCost: number;
}

export interface Permit {
  id: string;
  bookingId: string;
  organizerId: string;
  organizerName: string;
  eventName: string;
  eventType: string;
  venue: string;
  district: string;
  eventDate: string;
  expectedAttendees: number;
  description: string;
  noiseLevel: 'low' | 'medium' | 'high';
  securityPlan: string;
  status: PermitStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
