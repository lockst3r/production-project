export interface Prize {
  place?: number;
  prize?: number;
}

export interface TournamentState {
  tournaments: TournamentInterface[];
}

export interface TournamentInterface {
  id: string;
  title: string;
  description: string;
  numberOfPlayers: number;
  entryFee: number;
  prizeDistribution: Prize[];
}
