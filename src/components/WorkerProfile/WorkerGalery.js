import React from 'react';
import FilesUploadComponent from './FilesUploadComponent';
import { ColumnImg, GaleryColumn, GaleryRow } from './WorkerGaleryStyle';

export const WorkerGalery = ({
  uploadImagesToGallery,
  onGalleryFileChange,
  gallery,
  amICurrentEmployee
}) => {
  return (
    <GaleryRow>
      {gallery.map((image, i) => (
        <GaleryColumn key={i}>
          <ColumnImg src={image} />
        </GaleryColumn>
      ))}
      {amICurrentEmployee ? (
        <FilesUploadComponent
          uploadImagesToGallery={uploadImagesToGallery}
          onGalleryFileChange={onGalleryFileChange}
        />
      ) : null}
    </GaleryRow>
  );
};
