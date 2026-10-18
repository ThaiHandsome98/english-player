export interface Track {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  type: string;
  isSample?: boolean;
}

export interface ABRepeatState {
  enabled: boolean;
  pointA: number | null;
  pointB: number | null;
}

export interface Bookmark {
  id: string;
  trackId: string;
  trackName: string;
  pointA: number;
  pointB: number;
  note: string;
  createdAt: number;
}

