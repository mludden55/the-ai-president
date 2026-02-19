export interface Distribution {
  [rating: number]: number;
}

export interface VoteStats {
  count: number;
  sum: number;
  distribution: Distribution;
}
