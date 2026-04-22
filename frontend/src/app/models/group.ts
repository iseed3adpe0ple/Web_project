export interface Member {
  id: number;
  username: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: Member;
  members: Member[];
  invite_code: string;
  created_at: string;
}

export type RsvpStatus = 'going' | 'maybe' | 'not_going';

export interface EventRsvp {
  user: Member;
  status: RsvpStatus;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  event_type: 'study' | 'social' | 'work';
  start_time: string;
  end_time: string;
  team: number;
  created_by: Member;
  created_at: string;
  rsvps: EventRsvp[];
  my_rsvp: RsvpStatus | null;
}

export interface Invitation {
  id: number;
  group: Group;
  invited_user: Member;
  invited_by: Member;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}
