import * as React from "react";
import { Alert, Snackbar as CommonSnackBar } from "@mui/material";
import { SnackbarProps } from "./snackbar.interfaces";

export const SnackBar: React.FC<SnackbarProps> = ({ text, type, ...otherProps }) => {
  return (
    <CommonSnackBar
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      {...otherProps}
    >
      <Alert severity={type ?? "success"} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </CommonSnackBar>
  );
};
