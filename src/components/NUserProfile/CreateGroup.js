import TextField from '@mui/material/TextField';
import React from 'react';
import { SOutlineButton } from '../../styles/buttons';
import GoogleSearch from '../GoogleSearch';

export default function CreateGroup(props) {
  return (
    <form onSubmit={props.submit}>
      <TextField
        name="createGroupName"
        onChange={props.handleChange}
        autoFocus
        margin="dense"
        id="createGroupName"
        type="text"
        fullWidth
        value={props.createGroupName}
        label="Nombre del Grupo"
      />
      <GoogleSearch
        address={props.newGroupAddress}
        setAddress={props.handleAddressChange}
        create={true}
      />
      <SOutlineButton onClick={props.submit} color="primary">
        Crear
      </SOutlineButton>
    </form>
  );
}
