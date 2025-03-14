/**
 * @file ConfirmationDialog.tsx
 * @description A reusable dialog component for confirming user actions.
 * Displays a customizable title and body text with confirm/cancel buttons.
 */

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { JSX } from 'react';

// Define the props interface for ConfirmationDialog
interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  bodyText: string;
  confirmColor?: 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmationDialog component renders a modal dialog for user confirmation.
 * @param {ConfirmationDialogProps} props - Component props
 * @returns {JSX.Element} The confirmation dialog UI
 */
function ConfirmationDialog({
  open,
  title,
  bodyText,
  confirmColor = 'primary', // Default value
  onConfirm,
  onCancel,
}: ConfirmationDialogProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          textAlign: 'center',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'grey.900',
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          backgroundColor: 'grey.50',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Typography
          id="confirm-dialog-description"
          variant="body1"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 400,
            color: 'grey.800',
            lineHeight: 1.5,
            textAlign: 'center',
            mt: 2,
          }}
        >
          {bodyText}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            minWidth: 120,
            fontSize: '1rem',
            fontWeight: 500,
            textTransform: 'none',
            color: 'grey.700',
            borderColor: 'grey.400',
            borderRadius: '8px',
            px: 3,
            py: 1,
            '&:hover': {
              borderColor: 'grey.600',
              backgroundColor: 'grey.100',
            },
          }}
          aria-label="Cancel action"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          sx={{
            minWidth: 120,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            py: 1,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backgroundColor: `${confirmColor}.dark`,
            },
          }}
          aria-label={`Confirm ${title.toLowerCase()} action`}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;