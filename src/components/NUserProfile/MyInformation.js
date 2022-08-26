import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Joi from 'joi-browser';
import { Component } from 'react';
import { CLIENT_URL } from '../../env.json';
import { H2Heading } from '../../styles/headings';
import ProfilePicAvatar from '../common/ProfilePicAvatar';

export class MyInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEdit: false,
      errors: {
        name: false,
        lastName: false,
        cellphone: false,
        profilePic: false
      },
      data: {
        name: this.props.user.name,
        lastName: this.props.user.lastName,
        cellphone: this.props.user.cellphone,
        profilePic: CLIENT_URL + '/img/unknown.png'
      },
      user: {
        name: this.props.user.name,
        lastName: this.props.user.lastName,
        cellphone: this.props.user.cellphone,
        profilePic: CLIENT_URL + '/img/unknown.png',
        email: this.props.user.email
      },
      profilePic: this.props.profilePic,
      openSnackBar: false,
      SBSeverity: 'error',
      errorMsg: 'Ha ocurrido un error',
      succMsg: 'Se han guardado los cambios',
      refresh: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user &&
      (nextProps.user.name !== this.state.data.name ||
        nextProps.user.lastName !== this.state.data.lastName ||
        nextProps.user.cellphone !== this.state.data.cellphone ||
        nextProps.user.profilePic !== this.state.data.profilePic ||
        nextProps.user.email !== this.state.data.email ||
        nextProps.profilePic !== this.state.profilePic)
    ) {
      this.setState({
        data: { ...nextProps.user },
        user: { ...nextProps.user },
        profilePic: nextProps.profilePic
      });
    }
  }

  clearErrors() {
    this.setState({
      errors: {
        name: false,
        lastName: false,
        cellphone: false,
        profilePic: false
      }
    });
  }

  validationSchema = {
    name: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    cellphone: Joi.string()
      .min(10)
      .max(15)
      .regex(/^[0-9-]+$/)
      .required(),
    profilePic: Joi.any()
  };

  callbackModal = () => {
    this.setState({ showEdit: false });
    window.location.reload();
  };

  handleChange = (event) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    data[event.target.id] = event.target.value;
    errors[event.target.id] = this.validateProperty(event.target);
    this.setState({ data, errors });
  };

  validateProperty = ({ id, value }) => {
    const obj = { [id]: value };
    const propSchema = { [id]: this.validationSchema[id] };
    var res = Joi.validate(obj, propSchema);

    return res.error ? true : false;
  };

  handleCloseSubmit = async (event) => {
    // event.preventDefault();
    const valid = await this.validateForm();
    if (valid !== 1) return;
    const { name, lastName, cellphone } = this.state.data;
    this.props.updateProfileInfo(name, lastName, cellphone);
  };

  validateForm() {
    const options = { abortEarly: false };
    var errorRta;
    const validateData = (({ name, lastName, cellphone, profilePic }) => ({
      name,
      lastName,
      cellphone,
      profilePic
    }))(this.state.data);
    const error = Joi.validate(validateData, this.validationSchema, options);
    errorRta = error.error;
    if (!errorRta) return 1;
    this.setState({ openSnackBar: true, SBSeverity: 'error' });
    return errorRta;
  }

  handleSBClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  };

  render() {
    const { user } = this.props;
    const { showEdit, SBSeverity, succMsg, errorMsg, profilePic } = this.state;
    const { name, lastName, cellphone } = this.state.data;

    return (
      <>
        <Snackbar
          open={this.state.openSnackBar}
          autoHideDuration={4000}
          onClose={this.handleSBClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={this.handleSBClose} severity={SBSeverity}>
            {SBSeverity === 'error' ? errorMsg : succMsg}
          </Alert>
        </Snackbar>
        <Dialog
          open={showEdit}
          onClose={() => {
            this.setState({ showEdit: false });
          }}
        >
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre"
              type="text"
              onChange={this.handleChange}
              required={true}
              id="name"
              value={name}
              variant="standard"
              error={this.state.errors.name}
              helperText={this.state.errors.name ? 'Mínimos 3 caracteres' : ''}
            ></TextField>
            <TextField
              label="Apellido"
              type="text"
              onChange={this.handleChange}
              required={true}
              id="lastName"
              value={lastName}
              variant="standard"
              error={this.state.errors.lastName}
              helperText={
                this.state.errors.lastName ? 'Mínimos 3 caracteres' : ''
              }
            ></TextField>
            <TextField
              label="Celular"
              type="text"
              onChange={this.handleChange}
              required={true}
              id="cellphone"
              value={cellphone}
              variant="standard"
              error={this.state.errors.cellphone}
              helperText={this.state.errors.cellphone ? 'Error' : ''}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleCloseSubmit()} color="primary">
              Guardar Cambios
            </Button>
            <Button
              onClick={() => this.setState({ showEdit: false })}
              color="error"
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={4} id="editGrid">
          <Grid item xs={12} style={{ display: 'flex' }}>
            <H2Heading style={{ paddingRight: '20px' }}>
              Mi Información
            </H2Heading>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => this.setState({ showEdit: true })}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          {user ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  value={user.name}
                  InputProps={{
                    readOnly: true
                  }}
                  variant="standard"
                  label="Nombre"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  value={user.lastName}
                  InputProps={{
                    readOnly: true
                  }}
                  variant="standard"
                  label="Apellido"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  value={user.email}
                  InputProps={{
                    readOnly: true
                  }}
                  variant="standard"
                  label="Email"
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  value={user.cellphone}
                  InputProps={{
                    readOnly: true
                  }}
                  variant="standard"
                  label="Celular"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ProfilePicAvatar profilePic={profilePic} />
              </Grid>{' '}
            </>
          ) : (
            <Alert
              variant="outlined"
              severity="error"
              style={{ marginLeft: '10px' }}
            >
              Error al cargar su perfil. Reintente mas tarde
            </Alert>
          )}
        </Grid>
      </>
    );
  }
}

export default MyInformation;
