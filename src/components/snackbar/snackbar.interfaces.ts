import { SnackbarProps as Props } from "@mui/material";

export interface SnackbarProps extends Props {
  text: string;
  type?: 'success' | 'error'
}
