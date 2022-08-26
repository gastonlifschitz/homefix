

import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export default function HomefixLoading({
    isLoading
  }) {
    return(
        <Backdrop
          sx={{ color: '#fff', zindex: '3' }}
          style={{ zIndex: '3' }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
    )
}