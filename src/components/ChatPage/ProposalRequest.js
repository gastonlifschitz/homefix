import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import React from 'react';
import { areaTypes, translations } from '../../config.json';

function ProposalRequest({
  price,
  title,
  description,
  serviceType,
  employee,
  neighbour,
  handleChange,
  open,
  handleCloseDialog,
  submitProposal
}) {
  return (
    <>
      <Dialog
        open={open}
        style={{ zIndex: '5000' }}
        onClose={handleCloseDialog}
        id="proposalRequest"
      >
        <DialogTitle>Presupuesto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete los campos para completar su presupuesto
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Título"
            value={title}
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Descripción"
            value={description}
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            multiline
            rows={2}
          />
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Precio Total"
            value={price}
            type="number"
            variant="standard"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
          />
          <p>Rubro</p>
          <Select
            label="Rubros"
            value={serviceType}
            name="serviceType"
            onChange={handleChange}
            style={{
              width: '95%',
              height: '2em'
            }}
            native
            inputProps={{
              name: 'serviceType',
              id: 'serviceType'
            }}
          >
            <option aria-label="None" value="" />
            {areaTypes.map((rubro, i) => (
              <option key={i} value={rubro}>
                {translations[rubro]}
              </option>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
        <DialogActions>
          <Button onClick={submitProposal}>Enviar presupuesto</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProposalRequest;
