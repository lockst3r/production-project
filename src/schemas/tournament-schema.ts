import * as yup from "yup";

export const tournamentSchema = yup.object().shape({
  id: yup.string(),
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must not exceed 50 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(100, "Description must not exceed 100 characters")
    .required("Description is required"),
  numberOfPlayers: yup
    .number()
    .min(2, "Number of players must be at least 2")
    .max(100, "Number of players must not exceed 100")
    .required("Number of players is required"),
  entryFee: yup
    .number()
    .min(0, "Entry fee must be at least 0")
    .max(1000, "Entry fee must not exceed 1000")
    .required("Entry fee is required"),
  prizeDistribution: yup
    .array()
    .of(
      yup.object().shape({
        place: yup
          .number()
          .min(1, "Place must be at least 1")
          .required("Place is required"),
        prize: yup
          .number()
          .min(0, "Prize must be at least 0")

          .required("Prize distribution is required"),
      })
    )
    .test(
      "prizes-sum",
      "The sum of prizes should be equal to the total prize pool",
      function (prizes) {
        const entryFee = this.parent.entryFee || 0;
        const numberOfPlayers = this.parent.numberOfPlayers || 0;
        const totalPrizePool = entryFee * numberOfPlayers;

        const totalPrizes = prizes.reduce(
          (total, prize) => total + prize.prize,
          0
        );

        return totalPrizes === totalPrizePool;
      }
    )
    .required("Entry fee is required"),
});
