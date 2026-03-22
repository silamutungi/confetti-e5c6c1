export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  cover_emoji: string;
  share_slug: string;
  created_at: string;
  deleted_at: string | null;
}

export interface Rsvp {
  id: string;
  event_id: string;
  guest_name: string;
  guest_email: string;
  status: 'going' | 'maybe' | 'cant_go';
  created_at: string;
  deleted_at: string | null;
}

export type RsvpStatus = 'going' | 'maybe' | 'cant_go';

export interface User {
  id: string;
  email: string;
}