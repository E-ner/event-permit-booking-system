// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! (Legacy endpoint)';
  }

  getHome(): any {
    return {
      system: 'Event Permit and Venue Booking System',
      description:
        'A centralized digital platform for venue discovery, booking management, and event permit applications in Rwanda.',
      version: '1.0.0',
      status: 'operational',
      timestamp: new Date().toISOString(),
      documentation: {
        swagger: '/api',
        description: 'Interactive API documentation with authentication support',
      },
      quickLinks: {
        login: '/auth/login',
        register: '/users/register',
        searchVenues: '/venues/search',
        bookingsDashboard: '/bookings',
        permitsDashboard: '/permits',
      },
      features: [
        'Geolocation-based venue search',
        'Conflict-free booking system',
        'Role-based workflows (Organizer, Venue Manager, Authority)',
        'Multi-permit support (noise, safety, alcohol, etc.)',
        'Secure JWT authentication',
      ],
      stats: {
        message: 'System ready for use',
        tip: 'Use /api to explore and test all endpoints',
      },
      support: {
        contact: 'nsengiyumva603@example.com',
        repository: 'https://your-repo-or-docs-link.com',
      },
    };
  }
}