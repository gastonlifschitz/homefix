import MuiAlert from '@mui/material/Alert';
import React from 'react';

export default function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
