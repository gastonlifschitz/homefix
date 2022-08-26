import { CardActions, CardContent, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import React, { useState } from 'react';
import { baseURL } from '../../env.json';
import { SButton } from '../../styles/buttons';
import colors from '../../styles/colors';
import GenericDialog from '../common/GenericDialog';

export default function UserCard({
  user,
  userType,
  isAdmin,
  deleteNeighbourFromNeighborhood,
  self
}) {
  const [open, setOpen] = useState(false);

  const profilePic =
    userType === 'admin'
      ? baseURL + '/api/' + userType + '/profilePic/' + user._id
      : baseURL + '/api/' + userType + 's/profilePic/' + user._id;

  const handleSetOpen = () => {
    setOpen(true);
  };

  const handleSetClose = () => {
    setOpen(false);
  };

  return (
    <>
      <GenericDialog
        open={open}
        onClose={handleSetClose}
        title="Datos de contacto"
      >
        <p>Email: {user.email}</p>
        <p>Celular: <a href={"tel:"+user.cellphone}>{user.cellphone}</a></p>
        
      </GenericDialog>
      <Card style={{ background: colors.backgroundCard, borderRadius: '30px' }}>
        <CardContent
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Avatar src={profilePic} style={{ width: '60px', height: '60px' }} />
          <Typography
            component="div"
            variant="h6"
            style={{ textAlign: 'center' }}
          >
            {user.name} {user.lastName}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <SButton style={{ fontSize: '10px' }} onClick={handleSetOpen}>
            Ver datos
          </SButton>
          {isAdmin && userType === 'neighbour' && !self ? (
            <SButton
              style={{ fontSize: '10px', color: 'red' }}
              onClick={() => deleteNeighbourFromNeighborhood(user._id)}
            >
              Eliminar
            </SButton>
          ) : null}
        </CardActions>
      </Card>
    </>
  );
}
