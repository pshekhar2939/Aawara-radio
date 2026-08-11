/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  movie?: string;
  year?: string;
  youtubeId: string;
  duration?: string;
  genre?: string;
  coverImage?: string;
}

export type PlayerStatus =
  | 'UNSTARTED'
  | 'ENDED'
  | 'PLAYING'
  | 'PAUSED'
  | 'BUFFERING'
  | 'CUED'
  | 'TUNING'
  | 'ERROR';

export interface RadioState {
  isPlaying: boolean;
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  currentTrackIndex: number;
  currentTrackTitle: string;
  currentTrackArtist: string;
  currentTrackId: string;
  errorMessage: string | null;
  frequency: number;
}

export interface MemoryNote {
  id: string;
  year: string;
  movie: string;
  quote: string;
  artists: string;
}
