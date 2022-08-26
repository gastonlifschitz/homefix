import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import { PHeading } from '../../styles/headings';

export default function GalleryCarrousel({ images }) {
  const [selected, setSelected] = useState(0);
  return images.length ? (
    <div
      style={{
        display: 'inline-flex',
        minHeight: '270px',
        maxHeight: ' 270px'
      }}
    >
      <IconButton
        aria-label="delete"
        size="large"
        onClick={() => {
          if (selected !== 0) setSelected(selected - 1);
        }}
        style={{alignSelf:"center",height:"fit-content"}}
      >
        <ChevronLeftIcon />
      </IconButton>
      <div>
        <img
          style={{
            width: '100%',
            maxWidth: '350px',
            maxHeight: '270px',
            borderRadius: ' 30px'
          }}
          src={images[selected]}
          alt={selected}
        />
        <p>{selected+1}/{images.length}</p>
          </div>
      <IconButton
        aria-label="delete"
        size="large"
        onClick={() => {
          if (selected !== images.length - 1) setSelected(selected + 1);
        }}
        style={{alignSelf:"center",height:"fit-content"}}
      >
        <ChevronRightIcon />
      </IconButton>
    </div>
  ) : (
    <PHeading style={{ textAlign: 'left', paddingLeft: '1rem' }}>
      No hay imágenes disponibles
    </PHeading>
  );
}
