import React from 'react';
import { SButton } from '../../styles/buttons';
import { H3Heading } from '../../styles/headings';
import colors from '../../styles/colors';

export default function FilesUploadComponent({
  uploadImagesToGallery,
  onGalleryFileChange,
  picturesNames
}) {
  const inputFile = React.useRef(null);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    await uploadImagesToGallery();
  };

  return (
    <>
      <H3Heading                         
        style={{ textAlign: 'left', marginLeft: '0px' }}
      >
        Subir imagenes</H3Heading>
      <div className="form-group">
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          ref={inputFile}
          onChange={onGalleryFileChange}
          style={{ display: 'none' }}
        />
        <label style={{float:"left"}}>
          <SButton
            className="btn btn-primary"
            onClick={() => inputFile.current.click()}
          >
            Elegir archivos
          </SButton>
        </label>
      </div>
        <form onSubmit={onSubmit} style={{display: "flex",flexDirection:" column"}}>

            <div className="form-group">
              <SButton className="btn btn-primary" type="submit" style={{float:"left"}}>
                Upload
              </SButton>
            </div>
        </form>
        {picturesNames.length?<p style={{textAlign:"left"}}>Archivos seleccionados</p>:null}
        {picturesNames.map((i)=>(
          <p key={i} style={{textAlign:"left",color:colors.lightGrey}}>{i}</p>
        ))}

    </>
  );
}
