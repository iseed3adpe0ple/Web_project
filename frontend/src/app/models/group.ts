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
}

export interface RSVP {
  id: number;
  event: number;
  user: Member;
  status: 'going' | 'maybe' | 'not_going';
}

export interface Invitation {
  id: number;
  group: Group;
  status: 'pending' | 'accepted' | 'declined';
}
