import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
//from homefix
import { SButton } from '../../styles/buttons';

const GenericDialog = ({ open, onClose, title, children }) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <SButton onClick={onClose} color="primary">
            Cancel
          </SButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GenericDialog;
