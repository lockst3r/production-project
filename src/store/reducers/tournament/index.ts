import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TournamentInterface, TournamentState } from "./types";

const initialState: TournamentState = {
  tournaments: [],
};

const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    addTournament: (state, action: PayloadAction<TournamentInterface>) => {
      state.tournaments.push(action.payload);
    },
    removePrize: (state, action: PayloadAction<string>) => {
      const tournament = state.tournaments.find((t) => t.id === action.payload);
      if (tournament) {
        tournament.prizeDistribution.pop();
      }
    },
  },
});

export const { addTournament, removePrize } = tournamentSlice.actions;
export default tournamentSlice.reducer;
