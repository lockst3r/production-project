import * as React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { SnackBar } from "../../components/snackbar";
import { RootState } from "../../store/strore";
import { TournamentInterface } from "../../store/reducers/tournament/types";
import { removePrize } from "../../store/reducers/tournament";
import { useBoolean } from "../../hooks/useBoolean";

const MainPage: React.FC = () => {
  const [sortBy, setSortBy] = React.useState<
    keyof TournamentInterface | "totalPrizePool" | "numberOfWinners" | null
  >(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const dispatch = useDispatch();
  const [isOpen, { on, off }] = useBoolean();
  const tournaments = useSelector(
    (state: RootState) => state.tournament.tournaments
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    off();
  };

  const handleSort = (
    column: keyof TournamentInterface | "totalPrizePool" | "numberOfWinners"
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedTournaments = React.useMemo(
    () =>
      [...tournaments]
        .map((tournament) => ({
          ...tournament,
          totalPrizePool: tournament.numberOfPlayers * tournament.entryFee,
          numberOfWinners: tournament.prizeDistribution.length,
        }))
        .sort((a, b) => {
          if (sortBy) {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            if (sortOrder === "asc") {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          }
          return 0;
        }),
    [tournaments, sortBy]
  );

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    on();
  };

  return (
    <div>
      <SnackBar
        text="Copied to clipboard!!"
        open={isOpen}
        onClose={handleClose}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ cursor: "pointer" }}>
              <TableCell onClick={() => handleSort("id")}>ID</TableCell>
              <TableCell onClick={() => handleSort("title")}>Title</TableCell>
              <TableCell onClick={() => handleSort("description")}>
                Description
              </TableCell>
              <TableCell onClick={() => handleSort("numberOfPlayers")}>
                Number of Players
              </TableCell>
              <TableCell onClick={() => handleSort("entryFee")}>
                Entry Fee
              </TableCell>
              <TableCell onClick={() => handleSort("totalPrizePool")}>
                Total Prize Pool
              </TableCell>
              <TableCell onClick={() => handleSort("numberOfWinners")}>
                Number of Winners
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTournaments.map((tournament) => {
              return (
                <TableRow key={tournament.id}>
                  <TableCell
                    onClick={() => copyToClipboard(tournament.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {tournament.id}
                  </TableCell>
                  <TableCell>{tournament.title}</TableCell>
                  <TableCell>{tournament.description}</TableCell>
                  <TableCell>{tournament.numberOfPlayers}</TableCell>
                  <TableCell>{tournament.entryFee}</TableCell>
                  <TableCell>{tournament.totalPrizePool}</TableCell>
                  <TableCell>{tournament.numberOfWinners}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      href={`/tournament/${tournament.id}`}
                    >
                      Go to Tournament
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => dispatch(removePrize(tournament.id))}
                    >
                      Remove a Prize
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MainPage;
