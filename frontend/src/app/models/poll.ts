export interface PollOption {
  id: number;
  poll: number;
  datetime: string;
  vote_count: number;
  has_voted: boolean;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  team: number;
  created_by: string;
  deadline: string;
  is_closed: boolean;
  options: PollOption[];
  created_at: string;
}

export interface PollResults {
  poll: Poll;
  winner: PollOption | null;
  is_closed: boolean;
}
