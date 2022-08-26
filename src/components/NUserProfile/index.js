import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import {
  Alert,
  AlertTitle,
  Dialog,
  Grid,
  Snackbar,
  Tab,
  Tabs,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { baseURL, CLIENT_URL } from '../../env.json';
import {
  acceptProposal,
  addUserToNeighborhood,
  createNeighborhood,
  deleteNeighbour,
  getAllMyReviews,
  getNeighborhood,
  getNeighbourConversations,
  getNeighbourProposals,
  getUser,
  leaveNeighborhoodAsAdmin,
  saveReview,
  sendMessage,
  updateUser
} from '../../services/apiService';
import proposals from '../../services/proposals';
import { TabPanel } from '../../services/util';
import { SButton } from '../../styles/buttons';
import { H2Heading, SubtitleTypography } from '../../styles/headings';
import ChatCard from '../common/ChatCard';
import HomefixLoading from '../common/HomefixLoading';
import ReviewCard from '../common/ReviewCard';
import Header from '../Header';
import ContratacionesTab from './ContratacionesTab';
import CreateGroup from './CreateGroup';
import GroupView from './GroupView';
import MyInformation from './MyInformation';
import { STabs } from './UserProfileStyle';

export class NUserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //reminder: arranca en 1 y no 0 porque cero es Menu
      tabValue: 1,
      admin: {},
      user: props.user,
      roles: props.roles,
      neighborhoods: [],
      neighbour: {},
      neighborhoodSelected: 0,
      versioning: 0,
      messageGroup: '',
      joinGroupName: '',
      createGroupName: '',
      addAdminToGroup: '',
      titleMessageGroup: '',
      userInfo: {},
      value: 0,
      profilePic: CLIENT_URL + '/img/unknown.png',
      newAdmin: false,
      messages: [],
      newMsg: false,
      openDialog: false,
      reloadWindow: false,
      dialogTitle: '',
      dialogMsg: '',
      dialogSeverity: 'error',
      isLoading: true,
      isAdminFromGroup: false,
      newGroupAddress: {
        lat: -34.603832,
        lng: -58.381736,
        address: '',
        administrative_area_level_2: ''
      },
      myChats: null,
      myProposals: null,
      reviewPayload: {
        text: '',
        value: 0,
        _employee: null
      },
      reviews: [],
      openSnackBar: false,
      severitySnackBar: 'error',
      messageSnackBar: 'Error',
      loadTabs: false
    };

    this.deleteNeighbourFromNeighborhood =
      this.deleteNeighbourFromNeighborhood.bind(this);
    this.isAdminFromGroup = this.isAdminFromGroup.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.handleLocalStorage = this.handleLocalStorage.bind(this);
    this.updateProfileInfo = this.updateProfileInfo.bind(this);
  }

  async componentDidMount() {
    await this.reload();
  }

  reload = async () => {
    var { user } = this.props;
    user = await getUser(user._id);

    if (!user && user.data) return;

    user = user.data;
    const profilePic = baseURL + '/api/users/profilePic/' + user._id;

    var neighborhoodsIds = [],
      neighborhoods = [],
      neighbour = user.neighbour,
      admin = user.admin;

    this.setState({ neighbour, admin, profilePic });
    if (neighbour) {
      for (var n of neighbour.neighborhoods) {
        neighborhoodsIds.push(n);
      }

      await this.getProposals(neighbour._id);

      const chatInfo = await getNeighbourConversations(neighbour._id);
      if (chatInfo.data) this.setState({ myChats: chatInfo.data });

      await this.getMyReviews(neighbour._id);
    }
    if (admin) {
      for (var m of admin.neighborhoods) {
        neighborhoodsIds.push(m);
      }
    }
    //remove duplicates
    neighborhoodsIds = [...new Set(neighborhoodsIds)];

    for (var x of neighborhoodsIds) {
      //Handle error
      neighborhoods.push((await getNeighborhood(x)).data);
    }


    this.setState({ neighborhoods }, () => {
      this.getMessages();
      this.isAdminFromGroup();
    });

    this.handleLocalStorage();
    this.setState({ isLoading: false, loadTabs: true });
  };

  handleLocalStorage = () => {
    var item = localStorage.getItem('status');
    if (item) {
      switch (item) {
        case 'successCreateGroup':
          this.setState({ dialogMsg: 'Se ha creado el grupo correctamente' });
          break;
        case 'successJoinGroup':
          this.setState({ dialogMsg: 'Se ha unido al grupo correctamente' });
          break;
        case 'successEditProfile':
          this.setState({
            dialogMsg: 'Se ha editado el usuario correctamente'
          });
          break;
        case 'successSubmitReview':
          this.setState({
            dialogMsg: 'Se ha guardado la reseña'
          });
          break;
        case 'successCancelProposal':
          this.setState({
            dialogMsg: 'Se ha rechazado el presupuesto'
          });
          break;
        default:
          break;
      }
      localStorage.removeItem('status');
      this.setState({
        openDialog: true,
        dialogTitle: 'En hora buena!',
        dialogSeverity: 'success',
        isLoading: false
      });
    }
  };

  getMyReviews = async (neighbourId) => {
    const { data: reviews, status } = await getAllMyReviews(neighbourId);

    if (status === 200) this.setState({ reviews });
  };

  getProposals = async (neighbourId) => {
    const myProposals = await getNeighbourProposals(neighbourId);
    if (myProposals.data) this.setState({ myProposals: myProposals.data });
  };

  getFullName = () => {
    const { admin, neighbour } = this.state;

    return neighbour
      ? neighbour.name + ' ' + neighbour.lastName
      : admin
      ? admin.name + ' ' + admin.lastName
      : '';
  };

  isAdminFromGroup = () => {
    const { neighborhoods, neighborhoodSelected, admin } = this.state;

    if (
      !admin ||
      !admin.neighborhoods ||
      !neighborhoods ||
      !neighborhoods[neighborhoodSelected]
    ) {
      return false;
    } else {
      var isAdmin = admin.neighborhoods.includes(
        neighborhoods[neighborhoodSelected]._id
      );
      return isAdmin;
    }
  };

  getMessages = () => {
    var { neighborhoods, neighborhoodSelected } = this.state;
    if (
      !neighborhoods ||
      !neighborhoods[neighborhoodSelected] ||
      !neighborhoods[neighborhoodSelected].messages ||
      neighborhoods[neighborhoodSelected].messages.length === 0
    ) {
      this.setState({
        messages: []
      });
      return;
    }
    this.setState({
      messages: neighborhoods[neighborhoodSelected].messages.slice().reverse()
    });
  };

  getNeighbours = () => {
    const { neighborhoods, neighborhoodSelected } = this.state;

    return neighborhoods[neighborhoodSelected]
      ? neighborhoods[neighborhoodSelected].neighbours
      : [];
  };

  getAdmins = () => {
    const { neighborhoods, neighborhoodSelected } = this.state;
    return neighborhoods[neighborhoodSelected]
      ? neighborhoods[neighborhoodSelected].admins
      : [];
  };

  //numeros magicos: tab 0: menu, tab1: contrataciones, ... , tab5: mis grupos
  handleTabChange = (event, value) => {
    var { neighborhoodSelected, neighborhoods } = this.state;
    if (value > 5 && value < 6 + neighborhoods.length)
      neighborhoodSelected = value - 6;
    this.setState({ tabValue: value, neighborhoodSelected }, () =>
      this.getMessages()
    );
  };

  StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: 'none',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1)
    })
  );

  isAdminFromGroup = () => {
    const { neighborhoods, neighborhoodSelected, admin } = this.state;

    if (
      !admin ||
      !admin.neighborhoods ||
      !neighborhoods ||
      !neighborhoods[neighborhoodSelected]
    ) {
      return false;
    } else {
      var isAdmin = admin.neighborhoods.includes(
        neighborhoods[neighborhoodSelected]._id
      );
      return isAdmin;
    }
  };

  leaveNeighborhoodAsAdmin = async () => {
    const { admin, neighborhoods, neighborhoodSelected } = this.state;

    if (!admin) return;

    await leaveNeighborhoodAsAdmin(
      neighborhoods[neighborhoodSelected]._id,
      admin._id
    )
      .then((res) => {
        if (res.status === 200) window.location.reload(false);
      })
      .catch((err) => {
        this.setState({
          openDialog: true,
          dialogTitle: 'Error!',
          dialogSeverity: 'error',
          dialogMsg: err.response.data
            ? err.response.data
            : 'Ha ocurrido un error, intente nuevamente',
          isLoading: false
        });
      });
  };

  sendMessageToNeighborhood = async () => {
    var {
      titleMessageGroup,
      messageGroup,
      neighborhoods,
      neighborhoodSelected
    } = this.state;

    if (!neighborhoods[neighborhoodSelected]) return;

    const response = await sendMessage({
      neighborhood: neighborhoods[neighborhoodSelected].name,
      message: messageGroup,
      title: titleMessageGroup,
      date: Date.now()
    }).catch((error) => {
      this.setState({
        openDialog: true,
        dialogTitle: 'Error!',
        dialogSeverity: 'error',
        dialogMsg: 'Ha ocurrido un error, intente nuevamente',
        isLoading: false
      });
    });


    neighborhoods[neighborhoodSelected].messages.push(response.data);

    this.setState({ neighborhoods }, () => this.getMessages());
    this.setState({ titleMessageGroup: '', messageGroup: '' });
  };

  handleChange = (e, callback) => {
    this.setState({ [e.target.name]: e.target.value }, callback);
  };

  deleteNeighbourFromNeighborhood = async (neighbourId) => {
    if (neighbourId == null) {
      neighbourId = this.state.neighbour._id;
    }
    const { neighborhoods, neighborhoodSelected } = this.state;

    if (!neighborhoods) return;

    await deleteNeighbour(neighborhoods[neighborhoodSelected]._id, neighbourId)
      .then(async (res) => {
        if (res.status === 200) {
          this.setState({
            openDialog: true,
            dialogTitle: 'Exito!',
            dialogSeverity: 'success',
            dialogMsg: 'Se ha eliminado al vecino exitosamente',
            isLoading: false
          });
          await this.reload();
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          this.setState({
            newAdmin: false,
            openDialog: true,
            dialogTitle: 'Error!',
            dialogSeverity: 'error',
            dialogMsg: 'Ha ocurrido un error, intente nuevamente',
            isLoading: false
          });
        }
      });

  };

  updateProfileInfo = async (name, lastName, cellphone) => {
    //tengo que updetear neighbour y admin profiles en la db
    // me fijo si es neighbour
    const { neighbour, admin } = this.state;
    var success = false;
    if (neighbour) {
      await updateUser(
        { name, lastName, cellphone },
        'neighbours',
        neighbour._id
      )
        .then(async (res) => {
          const { status } = res;
          if (status === 200) {
            success = true;
          }
        })
        .catch((err, aux) => {
          success = false;
          this.setState({
            openDialog: true,
            dialogTitle: 'Error',
            dialogSeverity: 'error',
            isLoading: false
          });
        });
    }
    if (admin) {
      await updateUser({ name, lastName, cellphone }, 'admin', admin._id)
        .then(async (res) => {
          const { status } = res;
          if (status === 200) {
            success = true;
          }
        })
        .catch((err, aux) => {
          success = false;
          this.setState({
            openDialog: true,
            dialogTitle: 'Error',
            dialogSeverity: 'error',
            isLoading: false
          });
        });
    }
    if (success) {
      localStorage.setItem('status', 'successEditProfile');
      window.location.reload();
    }
  };

  joinNeighborhood = async () => {
    this.setState({ isLoading: true });
    const { neighborhoods, joinGroupName } = this.state;
    await addUserToNeighborhood({
      neighborhood: joinGroupName,
      role: 'neighbour'
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('status', 'successJoinGroup');
          neighborhoods.push(res.data);
          this.setState({ neighborhoods });
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          this.setState({
            newAdmin: false,
            openDialog: true,
            dialogTitle: 'Error!',
            dialogSeverity: 'error',
            isLoading: false,
            dialogMsg: error.response.data
          });
        }
      });
  };
  handleLogout = () => {
    return <Redirect to="/logout" />;
  };
  renderMenu = () => {
    const { tabValue } = this.state;
    return (
      <Tabs
        id="tabs"
        orientation="vertical"
        variant="scrollable"
        value={tabValue}
        onChange={this.handleTabChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
        fullwidth
      >
        <SubtitleTypography style={{ marginTop: '12px' }}>
          Menu
        </SubtitleTypography>
        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <AccountCircleIcon style={{ verticalAlign: 'middle' }} /> Mi
              Información
            </div>
          }
        />
        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <ChatBubbleOutlineIcon style={{ verticalAlign: 'middle' }} />{' '}
              Contrataciones
            </div>
          }
        />

        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <ReceiptOutlinedIcon style={{ verticalAlign: 'middle' }} /> Chats
            </div>
          }
        />
        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <ReviewsOutlinedIcon style={{ verticalAlign: 'middle' }} /> Mis
              reseñas
            </div>
          }
        />

        <SubtitleTypography>Mis Grupos</SubtitleTypography>
        {this.state.neighborhoods &&
          this.state.neighborhoods.map((group, index) => (
            <this.StyledTab
              key={index}
              style={{ alignItems: 'flex-start' }}
              label={
                <div>
                  <SupervisedUserCircleOutlinedIcon
                    style={{ verticalAlign: 'middle' }}
                  />{' '}
                  {group.name}
                </div>
              }
            />
          ))}

        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <AddIcon style={{ verticalAlign: 'middle' }} /> Crear Grupo
            </div>
          }
        />
        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <PersonAddIcon style={{ verticalAlign: 'middle' }} /> Unirme a
              Grupo
            </div>
          }
        />
        <this.StyledTab
          style={{ alignItems: 'flex-start' }}
          label={
            <div>
              <ExitToAppOutlinedIcon style={{ verticalAlign: 'middle' }} /> Log
              Out
            </div>
          }
        />
      </Tabs>
    );
  };
  handleAddressChange = (newAddress) => {
    this.setState({ newGroupAddress: newAddress });
  };
  handleDialogClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openDialog: false });
    
  };

  createNeighborhood = async () => {
    this.setState({ isLoading: true });
    const { createGroupName, newGroupAddress } = this.state;
    await createNeighborhood({
      name: createGroupName,
      address: newGroupAddress
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('status', 'successCreateGroup');
          window.location.reload();
        }
      })
      .catch((error) => {
        this.setState({
          openDialog: true,
          dialogTitle: 'Error!',
          dialogSeverity: 'error',
          dialogMsg: error.response.data,
          isLoading: false
        });
      });
  };

  acceptProposal = async (proposalId) => {
    const { neighbour } = this.state;

    const { status } = await acceptProposal(proposalId).catch((error) => {
      this.setState({
        openSnackBar: true,
        severitySnackBar: 'error',
        messageSnackBar: 'Error en la aceptacion'
      });
    });

    if (status === 200) {
      await this.getProposals(neighbour._id);
      this.setState({
        openSnackBar: true,
        severitySnackBar: 'success',
        messageSnackBar: 'Presupuesto aceptado'
      });
    }
  };

  cancelProposal = async (proposalId) => {
    const { neighbour } = this.state;

    const { success, severitySnackBar, messageSnackBar } =
      await proposals.cancelProposal(proposalId);

    if (success) await this.getProposals(neighbour._id);

    this.setState({
      openSnackBar: true,
      severitySnackBar,
      messageSnackBar
    });
  };

  finalizeProposal = async (proposalId) => {
    const { neighbour } = this.state;

    const { success, severitySnackBar, messageSnackBar } =
      await proposals.finalizeProposal(proposalId);

    if (success) await this.getProposals(neighbour._id);

    this.setState({
      openSnackBar: true,
      severitySnackBar,
      messageSnackBar
    });
  };

  submitReview = async () => {
    const { neighbour } = this.state;
    const {
      text: comment,
      value: rating,
      _employee,
      proposalId
    } = this.state.reviewPayload;

    await saveReview(proposalId, {
      _employee,
      comment,
      rating: Number(rating),
      report: false
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('status', 'successSubmitReview');
          window.location.reload();
        }
      })
      .catch((error) => {
        this.setState({
          openDialog: true,
          dialogTitle: 'Error!',
          dialogSeverity: 'error',
          dialogMsg: error.response.data,
          isLoading: false
        });
      });

    await this.getProposals(neighbour._id);

    this.clearReview();
  };
  reviewChange = (e) => {
    const { reviewPayload } = this.state;

    reviewPayload.text = e.target.value;

    this.setState({ reviewPayload });
  };

  reviewValueChange = (e) => {
    const { reviewPayload } = this.state;

    reviewPayload.value = e.target.value;

    this.setState({ reviewPayload });
  };

  clearReview = () => {
    this.setState({
      reviewPayload: { text: '', value: 0, _employee: null, proposalId: null }
    });
  };

  setReviewEmployee = (employeeId) => {
    const { reviewPayload } = this.state;

    reviewPayload._employee = employeeId;

    this.setState({ reviewPayload });
  };

  setReviewProposal = (proposalId) => {
    const { reviewPayload } = this.state;

    reviewPayload.proposalId = proposalId;

    this.setState({ reviewPayload });
  };

  handleSBClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  };

  render() {
    const {
      tabValue,
      dialogTitle,
      dialogMsg,
      dialogSeverity,
      openDialog,
      isLoading,
      profilePic,
      neighbour,
      admin,
      openSnackBar,
      severitySnackBar,
      messageSnackBar
    } = this.state;
    return (
      <>
        <HomefixLoading isLoading={isLoading} />
        <Dialog open={openDialog} onClose={() => this.handleDialogClose()}>
          <Alert onClose={this.handleDialogClose} severity={dialogSeverity}>
            <AlertTitle>
              <strong>{dialogTitle}</strong>
            </AlertTitle>
            {dialogMsg}
          </Alert>
        </Dialog>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={4000}
          onClose={this.handleSBClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Alert onClose={this.handleSBClose} severity={severitySnackBar}>
            {messageSnackBar}
          </Alert>
        </Snackbar>
        <Header
          sideBar={this.renderMenu(false)}
          handleTabChange={this.handleTabChange}
          tabSelected={tabValue}
          showMenuIcon={true}
        />
        {this.state.loadTabs ? (
          <Grid
            container
            id="mainGrid"
            style={{ margin: '20px', width: 'unset' }}
          >
            <STabs
              id="tabs"
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={this.handleTabChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
              fullwidth="true"
            >
              <SubtitleTypography style={{ marginTop: '12px' }}>
                Menu
              </SubtitleTypography>

              <this.StyledTab
                style={{ alignItems: 'flex-start' }}
                label={
                  <div>
                    <AccountCircleIcon style={{ verticalAlign: 'middle' }} /> Mi
                    Información
                  </div>
                }
              />
              <this.StyledTab
                style={{ alignItems: 'flex-start' }}
                label={
                  <div>
                    <ChatBubbleOutlineIcon
                      style={{ verticalAlign: 'middle' }}
                    />{' '}
                    Contrataciones
                  </div>
                }
              />
              <this.StyledTab
                style={{ alignItems: 'flex-start' }}
                label={
                  <div>
                    <ReceiptOutlinedIcon style={{ verticalAlign: 'middle' }} />{' '}
                    Chats
                  </div>
                }
              />
              <this.StyledTab
                style={{ alignItems: 'flex-start' }}
                label={
                  <div>
                    <ReviewsOutlinedIcon style={{ verticalAlign: 'middle' }} />{' '}
                    Mis reseñas
                  </div>
                }
              />
              <SubtitleTypography>Mis Grupos</SubtitleTypography>
              {this.state.neighborhoods &&
                this.state.neighborhoods.map((group, index) => (
                  <this.StyledTab
                    key={index}
                    style={{ alignItems: 'flex-start' }}
                    label={
                      <div>
                        <SupervisedUserCircleOutlinedIcon
                          style={{ verticalAlign: 'middle' }}
                        />{' '}
                        {group.name}
                      </div>
                    }
                  />
                ))}
              <this.StyledTab
                style={{ alignItems: 'flex-start', padding: '0px' }}
                label={
                  <div>
                    <AddIcon style={{ verticalAlign: 'middle' }} /> Crear Grupo
                  </div>
                }
              />
              <this.StyledTab
                style={{ alignItems: 'flex-start', padding: '0px' }}
                label={
                  <div>
                    <PersonAddIcon style={{ verticalAlign: 'middle' }} /> Unirme
                    a Grupo
                  </div>
                }
              />
              <this.StyledTab
                style={{ alignItems: 'flex-start', padding: '0px' }}
                label={
                  <div>
                    <ExitToAppOutlinedIcon
                      style={{ verticalAlign: 'middle' }}
                    />{' '}
                    Log Out
                  </div>
                }
              />
            </STabs>
            <TabPanel value={tabValue} index={1}>
              <MyInformation
                key={neighbour}
                user={neighbour ? neighbour : admin}
                profilePic={profilePic}
                updateProfileInfo={this.updateProfileInfo}
              ></MyInformation>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <ContratacionesTab
                acceptProposal={this.acceptProposal}
                cancelProposal={this.cancelProposal}
                finalizeProposal={this.finalizeProposal}
                myProposals={this.state.myProposals}
                neighbour={this.state.neighbour}
                submitReview={this.submitReview}
                reviewChange={this.reviewChange}
                reviewValueChange={this.reviewValueChange}
                clearReview={this.clearReview}
                reviewPayload={this.state.reviewPayload}
                setReviewEmployee={this.setReviewEmployee}
                setReviewProposal={this.setReviewProposal}
                getProposals={async () => {
                  const { neighbour } = this.state;

                  await this.getProposals(neighbour._id);
                }}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {this.state.myChats && this.state.myChats.length !== 0 ? (
                this.state.myChats.map((chat, index) => (
                  <ChatCard
                    key={index}
                    chatInfo={chat}
                    neighbour={this.state.neighbour}
                  />
                ))
              ) : (
                <H2Heading>No tiene chats</H2Heading>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              {this.state.reviews && this.state.reviews.length !== 0 ? (
                this.state.reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))
              ) : (
                <H2Heading>No tiene reseñas</H2Heading>
              )}
            </TabPanel>
            {this.state.neighborhoods &&
              this.state.neighborhoods.map((group, index) => (
                <TabPanel key={index} value={tabValue} index={6 + index}>
                  <GroupView
                    key={index}
                    isAdmin={this.isAdminFromGroup()}
                    messageGroup={this.state.messageGroup}
                    titleMessageGroup={this.state.titleMessageGroup}
                    submitMessage={() => {
                      this.sendMessageToNeighborhood();
                    }}
                    handleChange={this.handleChange}
                    group={group}
                    groupNeighbours={this.getNeighbours()}
                    groupAdmins={this.getAdmins()}
                    messages={this.state.messages}
                    deleteNeighbourFromNeighborhood={
                      this.deleteNeighbourFromNeighborhood
                    }
                    leaveNeighborhoodAsAdmin={this.leaveNeighborhoodAsAdmin}
                    self={this.state.neighbour}
                  ></GroupView>
                </TabPanel>
              ))}
            <TabPanel
              value={tabValue}
              index={6 + this.state.neighborhoods.length}
            >
              <CreateGroup
                handleChange={this.handleChange}
                groupName={this.state.createGroupName}
                newGroupAddress={this.state.newGroupAddress}
                handleAddressChange={this.handleAddressChange}
                submit={this.createNeighborhood}
              />
            </TabPanel>

            <TabPanel
              value={tabValue}
              index={7 + this.state.neighborhoods.length}
            >
              <form onSubmit={this.joinNeighborhood}>
                <TextField
                  name="joinGroupName"
                  onChange={this.handleChange}
                  autoFocus
                  margin="dense"
                  id="joinGroupName"
                  type="text"
                  fullWidth
                  value={this.state.joinGroupName}
                  label="Nombre del Grupo"
                />
                <SButton onClick={this.joinNeighborhood} color="primary">
                  Unirse
                </SButton>
              </form>
            </TabPanel>

            <TabPanel
              value={tabValue}
              index={8 + this.state.neighborhoods.length}
            >
              {tabValue === 8 + this.state.neighborhoods.length
                ? this.handleLogout()
                : null}
            </TabPanel>
          </Grid>
        ) : null}
      </>
    );
  }
}

export default NUserProfile;
