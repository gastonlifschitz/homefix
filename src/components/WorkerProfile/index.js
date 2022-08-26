import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Alert, AlertTitle, Snackbar, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
//from material UI
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash';
import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { days, timeFrames } from '../../config.json';
import { CLIENT_URL } from '../../env.json';
import {
  createProposal,
  deleteEmplotee,
  disLikeReview,
  getAverageRating,
  getEmployee,
  getEmployeeConversations,
  getEmployeeInfo,
  getEmployeeProfilePic,
  getEmployeeProposals,
  getGalleryImages,
  getNeighbour,
  getReviews,
  likeReview,
  reportReview,
  updateLastSeen,
  uploadUserGallery
} from '../../services/apiService';
import { getCurrentUser, logout } from '../../services/authService';
import proposals from '../../services/proposals';
import {
  formatDate,
  paymentMethodsIcons,
  rubroTranslator
} from '../../services/util';
import { SButton } from '../../styles/buttons';
import colors from '../../styles/colors';
import { H2Heading, H3Heading, PHeading } from '../../styles/headings';
import ChatPage from '../ChatPage';
import ProposalRequest from '../ChatPage/ProposalRequest';
import HomefixLoading from '../common/HomefixLoading';
import ProfilePicAvatar from '../common/ProfilePicAvatar';
import Header from '../Header';
import Map from '../Map';
import SignUpForm from '../SignUp/SignUpForm';
//from homefix
import Neighborhood from '../../services/neighborhood';
import BudgetArrangements from './BudgetArrangements';
import FilesUploadComponent from './FilesUploadComponent';
import GalleryCarrousel from './GalleryCarrousel';
import MyConversations from './MyConversations';

//from homeFix style
import {
  EmployeeActionController,
  SGrid,
  STab,
  STabList,
  STabPanel,
  STabs
} from './WorkerProfileStyle';
import WorkerReview from './WorkerReview';
import { ReviewDescription } from './WorkerReviewsStyle';

const initialState = {
  show: false,
  myConversations: [],
  reviews: [],
  showContact: false,
  reportError: false,
  showEdit: false,
  showDeleteProfile: false,
  redirect: false,
  employeeInfo: {},
  galleryUpload: [],
  gallery: [],
  review: {
    text: '',
    value: 2.5
  },
  averageRating: 0,
  reviewError: false,
  reportSucess: false,
  selectedDistrictsIds: [],
  currentUser: null,
  showEmployeeConversation: false,
  neighbourToContact: null,
  openDialogContact: false,
  employeeData: null,
  neighbourData: null,
  price: 0,
  title: '',
  description: '',
  serviceType: '',
  openProposalRequest: false,
  conversation: null,
  openReviewDialog: false,
  proposalType: 'WAIT',
  waitingProposals: [],
  acceptedProposals: [],
  finalizedProposals: [],
  reportLikeDislike: false,
  reportLikeDislikeMsg: 'Error',
  severitySnackBar: 'error',
  messageSnackBar: 'error',
  openSnackBar: false,
  openDialog: false,
  dialogTitle: '',
  dialogMsg: '',
  dialogSeverity: 'error',
  picturesNames: [],
  redirectToLogin: false,
  isLoading: true
};

class WorkerProfile extends Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState, id: this.props.match.params.id };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.uploadImagesToGallery = this.uploadImagesToGallery.bind(this);
    this.onGalleryFileChange = this.onGalleryFileChange.bind(this);
    this.handleLocalStorage = this.handleLocalStorage.bind(this);
  }

  async componentDidMount() {
    await this.loadSite();
  }

  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    const oldId = prevProps.match.params.id;
    const newId = this.props.match.params.id;

    if (oldId && newId && newId !== oldId) {
      this.setState(
        { ...initialState, id: newId, isLoading: true },
        async () => await this.loadSite()
      );
    }
  };

  loadSite = async () => {
    const user = getCurrentUser();
    const { id } = this.state;
    await getEmployeeInfo(id)
      .then(async (res) => {
        const employeeInfo = res.data;
        await getEmployeeProfilePic(id).catch((err) => {
          employeeInfo.profilePic = CLIENT_URL + '/img/unknown.png';
        });
        await this.calculateAverageRating(id);
        await this.getAllReviews(id);

        await this.getGalleryImages(id);

        const selectedDistrictsIds = [];
        if (employeeInfo.selectedDistricts) {
          employeeInfo.selectedDistricts.forEach((district) =>
            selectedDistrictsIds.push(district.id)
          );
        }

        this.setState(
          { employeeInfo, selectedDistrictsIds, currentUser: user },
          async () => {
            await this.getConversationsAndProposals();
            if (this.amICurrentEmployee()) await updateLastSeen();
          }
        );
        this.handleLocalStorage();
      })
      .catch((err) => {
        this.setState({
          openDialog: true,
          dialogSeverity: 'error',
          dialogMsg:
            err.response.data + ' Comuniquese con Homefix para mas información',
          dialogTitle: 'Error',
          redirectToLogin: true
        });
        return;
      });
    this.setState({ isLoading: false });
  };

  getConversationsAndProposals = async () => {
    const user = getCurrentUser();
    const { id } = this.state;

    var resp;
    if (user) {
      resp = await getEmployeeConversations(id);
    }

    this.setState({
      myConversations: resp ? resp.data : null
    });

    if (user) {
      const { data: employeeProposal, status } = await getEmployeeProposals(id);
      if (status === 200) this.setState({ ...employeeProposal });
    }
  };

  calculateAverageRating = async (id) => {
    let { data: avg } = await getAverageRating(id);
    if (avg.length === 0) avg = 0;
    else avg = avg[0].avg;
    this.setState({ averageRating: avg });
  };

  getAllReviews = async (id) => {
    let { data: reviews } = await getReviews(id);

    // Check if review is anonymous or not
    for (let rev of reviews) {
      const isMyNeighbour = await Neighborhood.userIsMyNeighbour(
        rev._issuer._id
      );
      rev.isMyNeighbour = isMyNeighbour;
    }

    reviews = reviews.sort((a, b) => b.isMyNeighbour - a.isMyNeighbour);

    this.setState({ reviews });
  };

  onGalleryFileChange = (e) => {
    const { files } = e.target;

    for (let file of files) {
      let { picturesNames } = this.state;
      picturesNames.push(file.name);
      this.setState({ picturesNames });
      this.setUpReader(file);
    }
  };

  setUpReader = (file) => {
    var reader = new FileReader();
    reader.onloadend = () => {
      let { galleryUpload } = this.state;
      galleryUpload.push(reader.result);
      this.setState({ galleryUpload });
    };
    reader.readAsDataURL(file);
  };

  uploadImagesToGallery = async () => {
    const { galleryUpload, id } = this.state;

    this.setState({ isLoading: true });

    await uploadUserGallery(id, { galleryUpload })
      .then((res) => {
        this.setState({
          openSnackBar: true,
          severitySnackBar: 'success',
          messageSnackBar: 'Imagenes subidas con exito'
        });
      })
      .catch((error) => {
        this.setState({
          openSnackBar: true,
          severitySnackBar: 'error',
          messageSnackBar: error.response.data
        });
      });
    this.setState({ galleryUpload: [], picturesNames: [], isLoading: false });
    await this.getGalleryImages(id);
  };

  getGalleryImages = async (id) => {
    const { data: resp } = await getGalleryImages(id).catch((error) => {
      this.setState({
        openSnackBar: true,
        severitySnackBar: 'error',
        messageSnackBar: error.response.data
      });
    });
    if (resp.gallery) {
      const { imgCollection: gallery } = resp.gallery;
      this.setState({ gallery });
    }
  };

  handleDeleteProfile = async () => {
    await deleteEmplotee(this.state.id).then((res) => {
      logout();
      this.setState({ redirect: true });
    });
  };

  like = async (reviewId, index) => {
    if (!this.state.currentUser || this.amICurrentEmployee()) {
      this.setState({
        reportLikeDislike: true,
        openSnackBar: true,
        severitySnackBar: 'error',
        messageSnackBar: 'No puede likear la reseña'
      });
      return;
    }

    const { status, data } = await likeReview(reviewId);
    if (status === 201) {
      this.setState({
        openSnackBar: true,
        severitySnackBar: 'error',
        messageSnackBar: data
      });
    }

    await this.getAllReviews(this.state.id);
  };

  disLike = async (reviewId, index) => {
    if (!this.state.currentUser || this.amICurrentEmployee()) {
      this.setState({
        openSnackBar: true,
        severitySnackBar: 'error',
        messageSnackBar: 'No puede deslikear la reseña'
      });
      return;
    }
    const { status, data } = await disLikeReview(reviewId);
    if (status === 201) {
      this.setState({
        openSnackBar: true,
        severitySnackBar: 'error',
        messageSnackBar: data
      });
    }

    await this.getAllReviews(this.state.id);
  };

  showEditButton = () => {
    const { currentUser } = this.state;
    if (!currentUser) return;
    const { id } = this.state;

    const myEmployeeRole = currentUser.employee;

    if (myEmployeeRole && myEmployeeRole === id) {
      return (
        <EmployeeActionController id="EmployeeActionController">
          <Tooltip title="Editar Perfil">
            <SButton
              onClick={() => this.setState({ showEdit: true })}
              startIcon={<EditIcon />}
              size="large"
            >
              Editar Perfil
            </SButton>
          </Tooltip>

          <Tooltip title="Log Out">
            <SButton
              aria-label="logOut"
              startIcon={<ExitToAppIcon />}
              onClick={this.handleLogout}
              size="large"
            >
              Log Out
            </SButton>
          </Tooltip>
        </EmployeeActionController>
      );
    }
  };

  handleLogout = async () => {
    this.props.history.push('/logout');
  };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  callbackModal = () => {
    this.setState({ showEdit: false });
    window.location.reload();
  };

  handleChange = (event) => {
    const data = this.state;

    data[event.target.id] = event.target.value;

    this.setState({ data });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      reportSucess: false,
      reportError: false,
      reportLikeDislike: false
    });
  };

  updateSelectedDistricts = (newPols) => {
    const selectedDistricts = [];

    newPols.forEach((pol) => selectedDistricts.push(pol.props));
    this.setState({ selectedDistricts });
  };

  contactEmployee = async () => {
    const { currentUser, id } = this.state;

    if (currentUser && currentUser.employee !== id && currentUser.neighbour) {
      var neighbour = await getNeighbour(currentUser.neighbour);
      var employee = await getEmployee(id);

      this.setState({
        openDialogContact: true,
        employeeData: employee.data,
        neighbourData: neighbour.data
      });
    }
  };

  submitProposal = async () => {
    const { conversation, price, title, description, serviceType } = this.state;
    await createProposal({
      price,
      title,
      description,
      serviceType,
      _receiver: conversation._receiver._id
        ? conversation._receiver._id
        : conversation._receiver,
      _provider: conversation._provider
    })
      .then((res) => {
        this.setState({ openProposalRequest: false });
        if (res.status === 200) {
          localStorage.setItem('status', 'successCreateProposal');
          window.location.reload();
        }
      })
      .catch((error) => {
        this.setState({ openProposalRequest: false });
        this.setState({
          openDialog: true,
          dialogTitle: 'Error!',
          dialogSeverity: 'error',
          dialogMsg: error.response.data,
          isLoading: false
        });
      });
  };

  amICurrentEmployee = () => {
    const { currentUser, id } = this.state;

    return currentUser && currentUser.employee === id;
  };

  handleChangeWithUpdate = async (event) => {
    const data = this.state;

    data[event.target.id] = event.target.value;
    await this.getConversationsAndProposals();
    this.setState({ data });
  };

  handleSBClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  };

  handleDialogClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (this.state.redirectToLogin) {
      this.props.history.push('/logout');
      return;
    }
    this.setState({
      openDialog: false,
      dialogSeverity: '',
      dialogMsg: '',
      dialogTitle: ''
    });
  };

  handleLocalStorage = () => {
    var item = localStorage.getItem('status');
    if (item) {
      switch (item) {
        case 'successCreateProposal':
          this.setState({
            dialogMsg: 'Se ha creado el presupuesto correctamente'
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

  finalizeProposal = async (proposalId) => {
    const { severitySnackBar, messageSnackBar } =
      await proposals.finalizeProposal(proposalId);

    await this.getConversationsAndProposals();

    this.setState({
      openSnackBar: true,
      severitySnackBar,
      messageSnackBar
    });
  };

  deleteProposal = async (proposalId) => {
    const { severitySnackBar, messageSnackBar } =
      await proposals.cancelProposal(proposalId);

    await this.getConversationsAndProposals();

    this.setState({
      openSnackBar: true,
      severitySnackBar,
      messageSnackBar
    });
  };

  openConversation = ({ _receiver }) =>
    this.setState({
      neighbourToContact: _receiver,
      showEmployeeConversation: true
    });

  render() {
    const {
      name,
      rubros,
      lastName,
      description,
      email,
      cellPhone,
      paymentMethods,
      availableDates,
      profilePic,
      availableHours,
      updatedAt
    } = this.state.employeeInfo;

    const {
      redirect,
      selectedDistrictsIds,
      waitingProposals,
      acceptedProposals,
      finalizedProposals,
      messageSnackBar,
      severitySnackBar,
      openDialog,
      dialogSeverity,
      dialogMsg,
      dialogTitle,
      picturesNames,
      isLoading
    } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <>
          {this.state.openDialogContact ? (
            <ChatPage
              employee={this.state.employeeData}
              neighbour={this.state.neighbourData}
              openDialog={this.state.openDialogContact}
              handleCloseDialog={() =>
                this.setState({ openDialogContact: false })
              }
              amIEmployee={false}
            />
          ) : null}
          <Header />
          <HomefixLoading isLoading={isLoading} />

          <Grid container spacing={0} style={{ height: '100%' }} id="grid">
            {/* costado */}
            <SGrid
              style={{ paddingTop: '30px' }}
              id="sgrid"
              item={true}
              xs={12}
              md={3}
              container
              spacing={0}
            >
              <div id="workerInfo">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: ' center'
                  }}
                >
                  {this.amICurrentEmployee() ? (
                    <ProfilePicAvatar profilePic={profilePic} />
                  ) : (
                    <Avatar
                      alt="Remy Sharp"
                      src={profilePic}
                      sx={{ width: 150, height: 150 }}
                    />
                  )}
                </div>
                <H3Heading>
                  {name} {lastName}
                </H3Heading>

                <PHeading>{description}</PHeading>

                <PHeading>
                  {updatedAt
                    ? `Ultima vez activo: ${formatDate(updatedAt)}`
                    : null}
                </PHeading>

                <div
                  style={{
                    float: 'center',
                    paddingBottom: '20px',
                    zIndex: 0,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Rating
                    name="half-rating-read"
                    value={this.state.averageRating}
                    defaultValue={this.state.averageRating}
                    readOnly
                    precision={0.5}
                  />
                  {this.state.reviews && this.state.reviews[0] ? (
                    <Link
                      href="#"
                      onClick={() => this.setState({ openReviewDialog: true })}
                      underline="always"
                    >
                      Ver reseñas ({this.state.reviews.length})
                    </Link>
                  ) : null}
                </div>
              </div>

              <Grid id="workerButtons">
                <Dialog
                  open={this.state.showContact}
                  onClose={() => this.setState({ showContact: false })}
                  aria-labelledby="form-dialog-title"
                >
                  {' '}
                  <DialogTitle>
                    <strong>Información de contacto</strong>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>Email: {email}</Typography>
                    <Typography>
                      Teléfono: {cellPhone ? cellPhone : 'No Disponible'}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => this.setState({ showContact: false })}
                    >
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>
                {this.state.currentUser &&
                this.state.currentUser.employee !== this.state.id &&
                this.state.currentUser.neighbour ? (
                  <Tooltip title="Contactar">
                    <IconButton
                      aria-label="contact"
                      onClick={() => this.contactEmployee()}
                      size="large"
                    >
                      <ContactPhoneIcon /> <strong>Contactar</strong>
                    </IconButton>
                  </Tooltip>
                ) : null}

                {this.showEditButton()}
                <Dialog
                  open={this.state.showEdit}
                  onClose={() => {
                    this.setState({ showEdit: false });
                  }}
                  fullWidth
                  maxWidth="md"
                >
                  <SignUpForm
                    edit={true}
                    employeeInfo={this.state.employeeInfo}
                    selectedDistricts={this.state.selectedDistrictsIds}
                    callbackModal={this.callbackModal}
                  />
                  <DialogActions>
                    <Button
                      onClick={() => this.setState({ showEdit: false })}
                      color="primary"
                    >
                      Cancelar
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </SGrid>
            <Grid container xs={12} md={9} item={true} id="workerInfoContainer">
              <STabs
                selectedTabClassName="is-selected"
                selectedTabPanelClassName="is-selected"
                onSelect={async () => await this.getConversationsAndProposals()}
              >
                <STabList
                  id="workerTabList"
                  style={{
                    contentVisibility: this.amICurrentEmployee()
                      ? 'visible'
                      : 'hidden'
                  }}
                >
                  <STab>General</STab>
                  <STab>Contrataciones</STab>
                  <STab>Mis conversiaciones</STab>
                </STabList>

                <STabPanel>
                  <Grid container id="workerInfoContainer">
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      id="workerServices"
                      style={{ padding: '30px' }}
                    >
                      <H3Heading
                        style={{ textAlign: 'left', marginLeft: '0px' }}
                      >
                        Servicios Básicos
                      </H3Heading>
                      {rubros ? (
                        rubros.map((rubro, i) => {
                          return (
                            <div key={i} style={{ display: 'contents' }}>
                              <PHeading
                                style={{
                                  marginBottom: ' 0px',
                                  textAlign: 'left',
                                  paddingLeft: '1rem'
                                }}
                              >
                                {rubroTranslator[rubro.rubroType]}
                              </PHeading>
                              <ul
                                style={{
                                  paddingLeft: '3rem',
                                  fontSize: ' 1rem'
                                }}
                              >
                                {rubro.services.map((service, j) => {
                                  return (
                                    <li key={j} style={{ color: 'grey' }}>
                                      {service}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })
                      ) : (
                        <div />
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      id="workerDay"
                      style={{ padding: '30px' }}
                    >
                      <H3Heading
                        style={{ textAlign: 'left', marginLeft: '0px' }}
                      >
                        Horarios
                      </H3Heading>
                      <div style={{ display: 'grid', paddingLeft: '1rem' }}>
                        {availableDates ? (
                          availableDates.map((day, i) => {
                            return (
                              <div
                                key={i}
                                style={{
                                  display: 'inline-flex',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <PHeading
                                  style={{
                                    paddingRight: '0px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {days[i]} -
                                </PHeading>
                                <ReviewDescription
                                  style={{
                                    paddingRight: '0px',
                                    color: colors.lightGrey
                                  }}
                                >
                                  {day
                                    ? timeFrames[availableHours[i] - 1]
                                    : ' No disponible'}
                                </ReviewDescription>
                              </div>
                            );
                          })
                        ) : (
                          <div />
                        )}
                      </div>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      id="workerPay"
                      style={{ padding: '30px' }}
                    >
                      <H3Heading style={{ textAlign: 'left' }}>
                        Medios de Pago
                      </H3Heading>
                      <ul
                        style={{
                          paddingLeft: '2em',
                          fontSize: ' 1rem'
                        }}
                      >
                        {paymentMethods ? (
                          paymentMethods.map((method, i) => {
                            return (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexWrap: 'wrap'
                                }}
                                key={i}
                              >
                                {paymentMethodsIcons[method]} 
                                <PHeading style={{ marginBottom: '0px' }}>
                                  {method}
                                </PHeading>
                              </div>
                            );
                          })
                        ) : (
                          <div />
                        )}
                      </ul>
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      md={8}
                      id="workerGalery"
                      style={{
                        padding: '30px',
                        textAlign: 'center'
                      }}
                    >
                      <H3Heading
                        style={{ textAlign: 'left', marginLeft: '0px' }}
                      >
                        Galería
                      </H3Heading>
                      <GalleryCarrousel images={this.state.gallery} />
                      {this.amICurrentEmployee() ? (
                        <FilesUploadComponent
                          uploadImagesToGallery={this.uploadImagesToGallery}
                          onGalleryFileChange={this.onGalleryFileChange}
                          picturesNames={picturesNames}
                        />
                      ) : null}
                    </Grid>
                    <Grid
                      item={true}
                      xs={12}
                      md={4}
                      id="workerMap"
                      style={{ padding: '30px' }}
                    >
                      <H3Heading
                        style={{ textAlign: 'left', marginLeft: '0px' }}
                      >
                        Lugares de trabajo
                      </H3Heading>
                      <Map
                        profilePage={true}
                        clickedPoligonos={this.updateSelectedDistricts}
                        polsId={selectedDistrictsIds}
                        clickableMap={false}
                      ></Map>
                    </Grid>
                  </Grid>
                </STabPanel>
                <STabPanel>
                  <Grid container id="ContratacionesTab">
                    {waitingProposals &&
                    waitingProposals.length === 0 &&
                    acceptedProposals &&
                    acceptedProposals.length === 0 &&
                    finalizedProposals &&
                    finalizedProposals.length === 0 ? (
                      <H2Heading>Aun no tiene contrataciones</H2Heading>
                    ) : (
                      <>
                        <FormControl>
                          <Select
                            label="Contrataciones"
                            value={this.state.proposalType}
                            name="proposalType"
                            onChange={this.handleChangeWithUpdate}
                           
                            native
                            inputProps={{
                              name: 'proposalType',
                              id: 'proposalType'
                            }}
                          >
                            <option value="WAIT">En espera</option>
                            <option value="ACCEPT">Aceptadas</option>
                            <option value="FINALIZED">Finalizadas</option>
                          </Select>
                        </FormControl>
                        <BudgetArrangements
                          id="BudgetArrangements"
                          waitingProposals={waitingProposals}
                          acceptedProposals={acceptedProposals}
                          finalizedProposals={finalizedProposals}
                          selectedProposalType={this.state.proposalType}
                          openConversation={this.openConversation}
                          finalizeProposal={this.finalizeProposal}
                          deleteProposal={this.deleteProposal}
                        />
                      </>
                    )}
                  </Grid>
                </STabPanel>
                <STabPanel>
                  {this.state.myConversations &&
                  this.state.myConversations.length === 0 ? (
                    <H2Heading>Aun no tiene conversaciones</H2Heading>
                  ) : (
                    <>
                      <Grid container id="ConversationsTab">
                        <MyConversations
                          myConversations={this.state.myConversations}
                          openConversation={this.openConversation}
                          openProposalRequest={(conversation) =>
                            this.setState({
                              openProposalRequest: true,
                              conversation
                            })
                          }
                        />
                      </Grid>{' '}
                    </>
                  )}
                </STabPanel>
              </STabs>
            </Grid>
          </Grid>
        </>
        <Dialog open={openDialog} onClose={() => this.handleDialogClose()}>
          <Alert onClose={this.handleDialogClose} severity={dialogSeverity}>
            <AlertTitle>
              <strong>{dialogTitle}</strong>
            </AlertTitle>
            {dialogMsg}
          </Alert>
        </Dialog>
        <Dialog
          open={this.state.reviewError}
          onClose={() => this.setState({ reviewError: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ padding: '0px' }}>
            <Alert
              onClose={() => this.setState({ reviewError: false })}
              severity="error"
            >
              La reseña no puede estar vacía
            </Alert>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={this.state.openSnackBar}
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
        <Dialog
          open={this.state.openReviewDialog}
          onClose={() => this.setState({ openReviewDialog: false })}
        >
          <WorkerReview
            like={this.like}
            disLike={this.disLike}
            reportReview={async (reviewId) => {
              await reportReview(reviewId)
                .then(async (response) => {
                  if (response.status === 200) {
                    let { reviews } = this.state;
                    if (response.data.report) {
                      _.remove(reviews, (e) => e._id === reviewId);
                      await this.calculateAverageRating(this.state.id);
                    }
                    this.setState({
                      reviews,
                      openSnackBar: true,
                      severitySnackBar: 'success',
                      messageSnackBar: 'Reporte Exitoso'
                    });
                  }
                })
                .catch((err) => {
                  if (err.response.data.alreadyReported)
                    this.setState({
                      reportError: true,
                      openSnackBar: true,
                      severitySnackBar: 'error',
                      messageSnackBar: 'Error! La reseña ya fue reportada'
                    });
                });
            }}
            reviews={this.state.reviews}
            loggedUser={this.state.currentUser}
          />
        </Dialog>
        {this.state.openProposalRequest ? (
          <ProposalRequest
            submitProposal={this.submitProposal}
            open={this.state.openProposalRequest}
            handleCloseDialog={() =>
              this.setState({ openProposalRequest: false })
            }
            price={this.state.price}
            title={this.state.title}
            description={this.state.description}
            serviceType={this.state.serviceType}
            employee={this.state.employeeInfo}
            neighbour={this.state.neighbourToContact}
            handleChange={this.handleChange}
          />
        ) : null}
        {!this.state.showEmployeeConversation ? null : (
          <ChatPage
            employee={this.state.employeeInfo}
            neighbour={this.state.neighbourToContact}
            amIEmployee={true}
            openDialog={this.state.showEmployeeConversation}
            handleCloseDialog={() =>
              this.setState({ showEmployeeConversation: false })
            }
            openProposalRequest={() => {
              this.setState({
                openProposalRequest: true,
                conversation: {
                  _provider: this.state.employeeInfo._id,
                  _receiver: this.state.neighbourToContact._id
                }
              });
            }}
          />
        )}
      </>
    );
  }
}

export default WorkerProfile;
