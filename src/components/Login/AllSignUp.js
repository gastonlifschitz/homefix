import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Alert,
  AlertTitle,
  Button,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from '@mui/material';
import Joi from 'joi-browser';
import _ from 'lodash';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { roles } from '../../config.json';
import { createUser, getNeighborhood } from '../../services/apiService';
import { SFormBtn, SUploadButton } from '../../styles/buttons';
import { STypography } from '../../styles/headings';
import { SCard } from '../../styles/styles';
import GoogleSearch from '../GoogleSearch';

class AllSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: '',
        lastName: '',
        cellphone: '',
        email: '',
        password: '',
        pwconfirm: '',
        profilePic: null,
        role: roles.NEIGHBOUR,
        neighborhood: '',
        address: {
          lat: -34.603832,
          lng: -58.381736,
          address: '',
          administrative_area_level_2: ''
        }
      },
      errors: {
        name: false,
        lastName: false,
        cellphone: false,
        email: false,
        password: false,
        pwconfirm: false,
        profilePic: false,
        role: false,
        neighborhood: false,
        address: false
      },
      photo: null,
      openSnackBar: false,
      errorMsg: 'Chequear Errores',
      submit: false,
      submitError: false,

      redirect: false,
      fileRef: React.createRef(),
      fileName: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProfilePicClick = this.handleProfilePicClick.bind(this);
  }

  async componentDidUpdate(_prevProps, prevState) {
    if (prevState.data.neighborhood !== this.state.data.neighborhood)
      this.getAddressOfNeighborhood();
  }

  //------------------------User schema------------------------
  validationSchema = {
    name: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(20).required(),
    pwconfirm: Joi.any(),
    cellphone: Joi.string()
      .min(10)
      .max(15)
      .regex(/^[0-9-]+$/)
      .required(),
    profilePic: Joi.any(),
    role: Joi.object(),
    neighborhood: Joi.any(),
    address: Joi.any()
    
  };

  validateProperty = ({ id, value }) => {
    const obj = { [id]: value };
    const propSchema = { [id]: this.validationSchema[id] };
    var res = Joi.validate(obj, propSchema);
    return res.error ? true : false;
  };

  validateForm() {
    const options = { abortEarly: false };
    var errorRta;

    const error = Joi.validate(this.state.data, this.validationSchema, options);
    errorRta = error.error;

    if (this.state.data.pwconfirm !== this.state.data.password) {
      this.setState({ passConfError: true, openSnackBar: true });
      return 4;
    }
    if (!errorRta) return 1;
    else this.setState({ openSnackBar: true });

    return errorRta;
  }

  //------------------------Handlers------------------------
  handleRoleChange = (event) => {
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        role: event.target.value
      }
    }));
  };
  handleChange = (event) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };

    data[event.target.id] = event.target.value;
    errors[event.target.id] = this.validateProperty(event.target);

    this.setState({ data, errors });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { role, lastName, email, cellphone, password, pwconfirm, name } =
      this.state.data;
    const valid = await this.validateForm();
    if (valid !== 1) return;

    const { value } = role;
    if (value === roles.EMPLOYEE.value)
      this.redirectToEmployeeSignUp(
        name,
        lastName,
        email,
        cellphone,
        password,
        pwconfirm
      );
    else if (value === roles.ADMIN.value) this.handleAdminSignUp();
    else if (value === roles.NEIGHBOUR.value) this.handleNeighbourSignUp();
  };

  redirectToEmployeeSignUp = (
    name,
    lastName,
    email,
    cellphone,
    password,
    pwconfirm
  ) => {
    this.props.history.push(
      `/signup?name=${name}&lastName=${lastName}&email=${email}&cellphone=${cellphone}&password=${password}&passwordConfirm=${pwconfirm}`
    );
  };

  handleAdminSignUp = async () => {
    var { data: payload } = this.state;
    payload = _.omit(payload, ['pwconfirm']);
    createUser(roles.ADMIN.endpoint, { ...payload, join: false })
      .then(async (res) => {
        const { status } = res;
        if (status === 200) {
          this.setState({ submit: true, submitError: false });
        }
      })
      .catch((err, aux) => {
        this.setState({
          openSnackBar: true,
          errorMsg: err.response.data
        });
      });
  };

  handleNeighbourSignUp = async () => {
    var { data: payload } = this.state;
    payload = _.omit(payload, ['pwconfirm', 'address']);

    createUser(roles.NEIGHBOUR.endpoint, payload)
      .then(async (res) => {
        const { status } = res;
        if (status === 200) {
          this.setState({ submit: true, submitError: false });
        }
      })
      .catch((err, aux) => {
        this.setState({
          openSnackBar: true,
          errorMsg: err.response.data
        });
      });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  };

  handleAddressChange = (newAddress) => {
    const { data } = this.state;
    data.address = newAddress;
    this.setState({ data });
  };

  //-----------------------Middleware-----------------------
  getAddressOfNeighborhood = async () => {
    var { neighborhood } = this.state.data;
    neighborhood = await getNeighborhood(neighborhood);

    if (!neighborhood) return;
    else neighborhood = neighborhood.data;

    const { address } = neighborhood;
    if (neighborhood) {
      const { data } = this.state;
      data.address = address;
      this.setState({ data });
    }
  };
  handleCloseSubmit(event, reason) {
    this.setState({ redirect: true });
  }

  handleProfilePicClick() {
    const fileElem = this.state.fileRef.current;
    if (fileElem) {
      fileElem.click();
    }
  }
  render() {
    const { data } = this.state;
    const { name, lastName, email, cellphone, role, neighborhood, address } =
      data;
    const { redirect, fileRef, fileName } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Snackbar
          open={this.state.openSnackBar}
          autoHideDuration={4000}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={this.handleClose} severity="error">
            {this.state.errorMsg}
          </Alert>
        </Snackbar>
        <Dialog
          open={this.state.submit === true && this.state.submitError === false}
          onClose={() => this.handleCloseSubmit()}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center'
          }}
        >
          <Alert severity="success">
            <AlertTitle>
              <strong>Usuario creado!</strong>
            </AlertTitle>
            Un mail fue enviado a su casilla de correo electrónico. <br></br>Por
            favor siga las instrucciones del mismo para activar su cuenta.
          </Alert>
          <DialogActions
            style={{
              backgroundColor: 'rgb(237, 247, 237)'
            }}
          >
            <Button onClick={() => this.handleCloseSubmit()} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <SCard>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    placeholder="Nombre *"
                    variant="standard"
                    type="text"
                    onChange={this.handleChange}
                    required={true}
                    id="name"
                    value={name}
                    error={this.state.errors.name}
                    helperText={
                      this.state.errors.name ? 'Mínimos 3 caracteres' : ''
                    }
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    placeholder="Apellido *"
                    id="lastName"
                    type="text"
                    onChange={this.handleChange}
                    required
                    value={lastName}
                    error={this.state.errors.lastName}
                    helperText={
                      this.state.errors.lastName ? 'Mínimos 3 caracteres' : ''
                    }
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={!this.props.edit ? this.handleChange : null}
                    error={this.state.errors.email}
                    helperText={this.state.errors.email ? 'Error' : ''}
                    placeholder="Email *"
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="tel"
                    variant="standard"
                    id="cellphone"
                    onChange={this.handleChange}
                    required
                    value={cellphone}
                    error={this.state.errors.cellphone}
                    helperText={
                      this.state.errors.cellphone
                        ? 'Al menos 10 caracteres'
                        : ''
                    }
                    placeholder="Celular *"
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    type="password"
                    id="password"
                    onChange={this.handleChange}
                    error={this.state.errors.password}
                    helperText={this.state.errors.password ? 'Error' : ''}
                    placeholder="Contraseña *"
                    required
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="password"
                    variant="standard"
                    id="pwconfirm"
                    onChange={this.handleChange}
                    error={
                      this.state.data.pwconfirm !== this.state.data.password
                    }
                    helperText={
                      this.state.data.pwconfirm !== this.state.data.password
                        ? 'El contraseña no coincide'
                        : ''
                    }
                    required
                    placeholder="Repetir Contraseña *"
                  ></TextField>
                </Grid>
                <Grid item xs={10}>
                  <SUploadButton
                    classes={{ label: 'label' }}
                    size="small"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={this.handleProfilePicClick}
                  >
                    Foto de perfil
                  </SUploadButton>
                  <input
                    ref={fileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profilePic"
                    multiple={false}
                    type="file"
                    onChange={(e) => {
                      e.preventDefault();
                      var reader = new FileReader();
                      let file = e.target.files[0];
                      reader.onloadend = () => {
                        var data = this.state.data;
                        data['profilePic'] = reader.result;
                        this.setState({ data, fileName: file.name });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <label>{fileName}</label>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{ padding: ' 0px 16px 16px 16px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <STypography variant="h6">Tipo de usuario</STypography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Select
                    style={{ width: '50%' }}
                    labelId="role-selectl"
                    id="role-select"
                    required
                    value={role}
                    onChange={this.handleRoleChange}
                    error={this.state.errors.role}
                    helpertext={
                      this.state.errors.role ? 'Seleccione un rol' : ''
                    }
                  >
                    <MenuItem value={roles.NEIGHBOUR}>Vecino</MenuItem>
                    <MenuItem value={roles.ADMIN}>Administrador</MenuItem>
                    <MenuItem value={roles.EMPLOYEE}>Trabajador</MenuItem>
                  </Select>
                </Grid>
                {!_.isEqual(role, roles.EMPLOYEE) ? (
                  <>
                    {' '}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="string"
                        id="neighborhood"
                        onChange={this.handleChange}
                        required
                        value={neighborhood}
                        error={this.state.errors.neighborhood}
                        placeholder="Nombre del grupo *"
                      ></TextField>
                    </Grid>
                    {_.isEqual(role, roles.ADMIN) ? (
                      <Grid item xs={12} sm={12}>
                        <GoogleSearch
                          address={address}
                          setAddress={this.handleAddressChange}
                          role={role}
                        />
                      </Grid>
                    ) : null}
                  </>
                ) : null}

                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <SFormBtn type="submit">Registrarse</SFormBtn>
                </Grid>
              </Grid>
            </CardActions>
          </form>
        </SCard>
      </div>
    );
  }
}

export default AllSignUp;
