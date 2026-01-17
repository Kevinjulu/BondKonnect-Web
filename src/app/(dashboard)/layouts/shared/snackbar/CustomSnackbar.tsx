import * as React from 'react';
import { Snackbar, Alert, AlertTitle } from "@mui/material";

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  title?: string;
  duration?: number;
}

const CustomSnackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
  title,
  duration = 6000, // Default duration
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={duration}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
