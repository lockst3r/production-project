import { forwardRef } from "react";
import { TextField as Input, TextFieldProps } from "@mui/material";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return <Input color="primary" size="small" focused ref={ref} fullWidth {...props} />;
  }
);
