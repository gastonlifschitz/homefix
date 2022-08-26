import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  DialogContentText,
  Grid,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { Component } from 'react';
import { TabPanel } from '../../services/util';
import { SOutlineButton } from '../../styles/buttons';
import { H2Heading, PHeading, SubtitleTypography } from '../../styles/headings';
import MessageCard from '../common/MessageCard';
import UserCard from '../common/UserCard';
import UserDialog from './UserDialog';
export class GroupView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
      newMsg: false
    };
  }
  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  render() {
    const { tabValue } = this.state;
    const { width } = this.props;

    const {
      group,
      groupAdmins,
      groupNeighbours,
      messages,
      isAdmin,
      messageGroup,
      titleMessageGroup,
      submitMessage,
      handleChange,
      deleteNeighbourFromNeighborhood,
      leaveNeighborhoodAsAdmin
    } = this.props;
    return (
      <div>
        <H2Heading>Bienvenido al grupo {group.name}</H2Heading>
        <PHeading style={{ textAlign: 'left' }}>
          {group.address.address}
        </PHeading>
        <SOutlineButton
          style={{ color: 'red' }}
          onClick={() => {
            if (!isAdmin) {
              deleteNeighbourFromNeighborhood(null);
            } else {
              leaveNeighborhoodAsAdmin();
            }
          }}
        >
          Abandonar Grupo
        </SOutlineButton>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <SubtitleTypography> Mensajes Importantes</SubtitleTypography>
          {isAdmin ? (
            <Tooltip title="Agregar Mensaje">
              <IconButton
                onClick={() => this.setState({ newMsg: true })}
                aria-label="Agregar Mensaje"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
        <UserDialog
          open={this.state.newMsg}
          onClose={() => this.setState({ newMsg: false })}
          property="messageGroup"
          title="Crear un nuevo mensaje parroquial"
          desc="Escriba el mensaje que quiera que se muestre a todos los miembros del grupo"
          button="Enviar"
          showTitleInput={true}
          value={messageGroup}
          titleValue={titleMessageGroup}
          submit={() => {
            submitMessage();
            this.setState({ newMsg: false });
          }}
          handleChange={handleChange}
        >
          <DialogContentText>Escriba el titulo del mensaje</DialogContentText>
          <TextField
            name="titleMessageGroup"
            onChange={handleChange}
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            value={titleMessageGroup}
          />
        </UserDialog>
        {messages[0] ? <MessageCard message={messages[0]} /> : null}
        <Tabs
          value={tabValue}
          onChange={this.handleTabChange}
          variant="fullWidth"
          orientation={isWidthUp('sm', width) ? 'horizontal' : 'vertical'}
        >
          <Tab label="Vecinos" />
          <Tab label="Administradores" />
          <Tab label="Mensajes" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Grid
            container
            spacing={4}
            style={{ paddingTop: '20px' }}
            id="vecinosGrid"
          >
            {groupNeighbours &&
              groupNeighbours.map((neighbour, index) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={3}
                  style={{ display: 'flex', flexDirection: 'column' }}
                  key={index}
                >
                  <UserCard
                    user={neighbour}
                    key={index}
                    userType="neighbour"
                    deleteNeighbourFromNeighborhood={
                      deleteNeighbourFromNeighborhood
                    }
                    isAdmin={isAdmin}
                    self={
                      this.props.self
                        ? this.props.self._id === neighbour._id
                        : false
                    }
                  />
                </Grid>
              ))}
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid
            container
            spacing={4}
            style={{ paddingTop: '20px' }}
            id="adminGrid"
          >
            {groupAdmins &&
              groupAdmins.map((admin, index) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={3}
                  style={{ display: 'flex', flexDirection: 'column' }}
                  key={index}
                >
                  <UserCard user={admin} userType="admin" />
                </Grid>
              ))}
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {messages.map((msg, index) => (
            <MessageCard message={msg} key={index} />
          ))}
        </TabPanel>
      </div>
    );
  }
}

export default withWidth()(GroupView);
