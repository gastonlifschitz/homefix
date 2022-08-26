import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';
//from homefix
import { SButton } from '../../styles/buttons';
import GoogleSearch from '../GoogleSearch';

const UserDialog = ({
  open,
  onClose,
  title,
  desc,
  label,
  address,
  button,
  email,
  submit,
  handleChange,
  value,
  property,
  children,
  handleAddressChange,
  newGroupAddress
}) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {children}
          <DialogContentText>{desc}</DialogContentText>
          <TextField
            name={property}
            onChange={handleChange}
            autoFocus
            margin="dense"
            id={label}
            label={label}
            type={email ? 'email' : 'text'}
            fullWidth
            value={value}
          />
          {address ? (
            <>
              <GoogleSearch
                address={newGroupAddress}
                setAddress={handleAddressChange}
                create={true}
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <SButton onClick={onClose} color="primary">
            Cancel
          </SButton>
          <SButton onClick={submit} color="primary">
            {button}
          </SButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDialog;
