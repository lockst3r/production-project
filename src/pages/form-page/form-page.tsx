import * as React from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Typography } from "@mui/material";
import { TextField } from "../../components/text-field";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TournamentInterface } from "../../store/reducers/tournament/types";
import { tournamentSchema } from "../../schemas";
import { addTournament } from "../../store/reducers/tournament";
import { SnackBar } from "../../components/snackbar";
import { useBoolean } from "../../hooks/useBoolean";

const DynamicForm: React.FC = () => {
  const dispatch = useDispatch();

  const [numberOfPlayers, setNumberOfPlayers] = React.useState<number>(0);
  const [entryFee, setEntryFee] = React.useState<number>(0);
  const [prizes, setPrizes] = React.useState([]);
  const [totalPrizePool, setTotalPrizePool] = React.useState<number>(0);
  const [remainingPrizePool, setRemainingPrizePool] = React.useState<number>(0);
  const [isOpen, { on, off }] = useBoolean();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<TournamentInterface>({
    resolver: yupResolver(tournamentSchema),
    defaultValues: {
      id: (Math.floor(Math.random() * 1000) + 1).toString(),
      title: "",
      description: "",
      numberOfPlayers: 0,
      entryFee: 0,
      prizeDistribution: [],
    },
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    off();
  };

  const handleReset = () => {
    reset();
    setTotalPrizePool(0)
    setRemainingPrizePool(0);
    setEntryFee(0);
    setNumberOfPlayers(0);
    setPrizes([]);
  };

  const onSubmit = React.useCallback((data: TournamentInterface) => {
    dispatch(addTournament(data));
    on();
    handleReset();
  }, []);

  const handleEntryFeeChange = React.useCallback(
    (e: { target: { value: string } }) => {
      const fee = parseInt(e.target.value);
      setEntryFee(fee);
      setTotalPrizePool(fee * numberOfPlayers);
      setRemainingPrizePool(fee * numberOfPlayers);
    },
    [numberOfPlayers]
  );

  const handleNumberOfPlayersChange = React.useCallback(
    (e: { target: { value: string } }) => {
      const players = parseInt(e.target.value);
      setNumberOfPlayers(players);
      setTotalPrizePool(entryFee * players);
      setRemainingPrizePool(entryFee * players);
    },
    [entryFee]
  );

  const handlePrizeChange = React.useCallback(
    (index: number, field: "place" | "prize", value: number) => {
      const updatedPrizes = [...prizes];
      updatedPrizes[index][field] = value;
      setPrizes(updatedPrizes);
      setValue("prizeDistribution", updatedPrizes);
      calculateRemainingPrizePool();
    },
    [prizes]
  );

  const addPrize = React.useCallback(() => {
    const newPrize = { place: "", prize: "" };
    setPrizes([...prizes, newPrize]);
    setValue("prizeDistribution", [...prizes, newPrize]);
    calculateRemainingPrizePool();
  }, [prizes]);

  const removePrize = React.useCallback(
    (index: number) => {
      const updatedPrizes = [...prizes];
      updatedPrizes.splice(index, 1);
      setPrizes(updatedPrizes);
      setValue("prizeDistribution", updatedPrizes);
      calculateRemainingPrizePool();
    },
    [prizes]
  );

  const calculateRemainingPrizePool = React.useCallback(() => {
    let total = totalPrizePool;
    prizes.forEach((prize) => {
      if (prize.prize !== "") {
        const prizeValue = parseInt(prize.prize);
        total -= prizeValue;
      }
    });
    setRemainingPrizePool(total);
  }, [prizes]);

  React.useEffect(() => {
    if (!!errors.prizeDistribution) {
      on();
    }
  }, [errors.prizeDistribution]);

  return (
    <Box
      sx={{
        display: "flex",
        padding: "10px",
        width: "100%",
        height: "100%",
        flex: 1,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SnackBar
        text={
          !!errors.prizeDistribution
            ? errors.prizeDistribution.message
            : "Save!"
        }
        open={isOpen}
        type={!!errors.prizeDistribution ? "error" : "success"}
        onClose={handleClose}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
          padding: "10px",
          width: "30%",
          marginBottom: "auto",
          marginTop: "20px",
          border: "2px solid black",
        }}
      >
        <Typography
          fontSize="xl"
          sx={{ mb: 0.5 }}
          color="black"
        >{`Price pull ${totalPrizePool}`}</Typography>
        <Typography
          fontSize="xl"
          color="black"
        >{`Remaining pull ${remainingPrizePool}`}</Typography>
      </Box>
      <Box display="flex" sx={{ marginTop: "20px", width: "70%" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                rowGap: "20px",
                flexDirection: "column",
                width: { xs: "100%", md: "50%" },
                padding: "10px",
              }}
            >
              <TextField
                id="title"
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                placeholder="Enter"
                {...register("title")}
              />

              <TextField
                {...register("description")}
                id="description"
                label="Description"
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <TextField
                {...register("entryFee")}
                label="Entry Fee"
                type="number"
                error={!!errors.entryFee}
                helperText={errors.entryFee?.message}
                onChange={handleEntryFeeChange}
              />

              <TextField
                {...register("numberOfPlayers")}
                label="Number of Players"
                type="number"
                onChange={handleNumberOfPlayersChange}
                error={!!errors.numberOfPlayers}
                helperText={errors.numberOfPlayers?.message}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  color="secondary"
                  onClick={addPrize}
                  sx={{ marginRight: "10px" }}
                >
                  Add Prize
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Create Tournament
                </Button>
              </Box>
            </Box>
            {prizes.length !== 0 && (
              <Box
                sx={{
                  padding: "10px",
                  rowGap: "20px",
                  width: { xs: "100%", md: "50%" },
                }}
              >
                {prizes.map((prize, index) => {
                  return (
                    <div key={index}>
                      <TextField
                        id={`place-${index}`}
                        type="number"
                        {...register(`prizeDistribution.${index}.place`)}
                        label="Place:"
                        error={!!errors.prizeDistribution?.[index]?.place}
                        helperText={
                          errors.prizeDistribution?.[index]?.place?.message
                        }
                        onChange={(e) =>
                          handlePrizeChange(index, "place", +e.target.value)
                        }
                      />

                      <TextField
                        id={`prize-${index}`}
                        {...register(`prizeDistribution.${index}.prize`)}
                        type="number"
                        label="Prize:"
                        error={!!errors.prizeDistribution?.[index]?.prize}
                        helperText={
                          errors.prizeDistribution?.[index]?.prize?.message
                        }
                        onChange={(e) =>
                          handlePrizeChange(index, "prize", +e.target.value)
                        }
                        style={{ marginTop: "10px" }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => removePrize(index)}
                        sx={{ margin: "10px 0px" }}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </Box>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default DynamicForm;
