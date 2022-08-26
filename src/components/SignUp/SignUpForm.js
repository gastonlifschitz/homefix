//from MaterialUI
import AddIcon from '@mui/icons-material/Add';
import FaceIcon from '@mui/icons-material/Face';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  Alert,
  AlertTitle,
  Button,
  CardActions,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Joi from 'joi-browser';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
//from homefix
import {
  areaTypes,
  days,
  paymentMethods,
  roles,
  timeFrames,
  translations
} from '../../config.json';
import { createUser, updateEmployee } from '../../services/apiService';
import { getEmployeeId, isLogged } from '../../services/util';
import { SFormBtn, SUploadButton } from '../../styles/buttons';
import Map from '../Map';
import { FormH1, FormLabel } from '../SignIn/SignInStyle';
import { CheckboxText, IconHolder } from '../SignUp/SignUpStyle';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    var searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name');
    const lastName = searchParams.get('lastName');
    const cellphone = searchParams.get('cellphone');
    const email = searchParams.get('email');

    this.state = {
      data: this.props.edit
        ? this.props.employeeInfo
        : {
            name: name ? name : '',
            lastName: lastName ? lastName : '',
            description: '',
            cellPhone: cellphone ? cellphone : '',
            email: email ? email : '',
            emailConfirm: email ? email : '',
            availableHours: [0, 0, 0, 0, 0, 0, 0],
            password: '',
            pwconfirm: '',
            rubros: [],
            paymentMethods: [],
            availableDates: [false, false, false, false, false, false, false],
            profilePic: null,
            selectedDistricts: []
          },

      errors: {
        name: false,
        lastName: false,
        description: false,
        availableHours: false,
        cellPhone: false,
        email: false,
        password: false,
        rubros: false,
        paymentMethods: false,
        availableDates: false,
        profilePic: false,
        selectedDistricts: false
      },
      tmpRubro: '',
      tmpSpecialities: [''],
      redirect: false,
      photo: null,
      isSubmitted: false,
      errorMsg: 'Chequear Errores',
      emailConfError: false,
      passConfError: false,
      openSnackBar: false,
      severitySnackBar: 'error',
      submit: false,
      submitError: false,
      fileName: ''
    };
    if (this.props.edit) this.state.data.emailConfirm = this.state.data.email;

    this.handleChange = this.handleChange.bind(this);
    this.addRubro = this.addRubro.bind(this);
    this.handleAddField = this.handleAddField.bind(this);
    this.handleRemoveField = this.handleRemoveField.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.updateSelectedDistricts = this.updateSelectedDistricts.bind(this);
    this.getIds = this.getIds.bind(this);
  }

  clearErrors() {
    this.setState({
      errors: {
        name: false,
        lastName: false,
        description: false,
        email: false,
        password: false,
        cellPhone: false,
        rubros: false,
        paymentMethods: false,
        availableHours: false,
        availableDates: false,
        profilePic: false,
        selectedDistricts: false
      }
    });
  }

  validationSchema = {
    name: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    emailConfirm: Joi.any(),
    password: Joi.string().min(3).max(20).required(),
    pwconfirm: Joi.any(),
    description: Joi.string().required(),
    cellPhone: Joi.string()
      .min(10)
      .max(15)
      .regex(/^[0-9-]+$/)
      .required(),
    availableDates: Joi.array().items(Joi.boolean()),
    paymentMethods: Joi.array().items(Joi.string()),
    availableHours: Joi.array(),
    rubros: Joi.array().min(1).required(),
    profilePic: Joi.any(),
    selectedDistricts: Joi.any()
  };

  validationSchemaEdit = {
    name: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    emailConfirm: Joi.any(),
    description: Joi.string().required(),
    cellPhone: Joi.string()
      .min(10)
      .max(15)
      .regex(/^[0-9-]+$/)
      .required(),
    availableDates: Joi.array().items(Joi.boolean()),
    paymentMethods: Joi.array().items(Joi.string()),
    availableHours: Joi.array(),
    rubros: Joi.array().items(Joi.any().required()),
    _id: Joi.any(),
    timestamp: Joi.any(),
    profilePic: Joi.any(),
    blackList: Joi.boolean().required(),
    selectedDistricts: Joi.any(),
    workedFor: Joi.array(),
    createdAt: Joi.any(),
    updatedAt: Joi.any(),
    __v: Joi.any()
  };

  handleChange = (event) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    data[event.target.id] = event.target.value;
    errors[event.target.id] = this.validateProperty(event.target);
    this.setState({ data, errors });
  };

  handleChangeSelect = (event) => {
    //select de materialUI no anda con ID, hay que definirlo con name
    this.setState({ [event.target.name]: event.target.value });
  };

  mySubmitHandler = async (event) => {
    event.preventDefault();

    const valid = await this.validateForm();
    if (valid !== 1) return;

    const {
      name,
      lastName,
      description,
      email,
      password,
      rubros,
      cellPhone,
      paymentMethods,
      availableDates,
      availableHours,
      profilePic,
      selectedDistricts
    } = this.state.data;
    if (this.props.edit) {
      const log = isLogged();
      var id;
      if (log) {
        id = await getEmployeeId();

        await updateEmployee(id, {
          name,
          lastName,
          description,
          email,
          rubros,
          availableHours,
          paymentMethods,
          cellPhone,
          availableDates,
          blackList: false,
          selectedDistricts
        })
          .then(async (res) => {
            const { status } = res;
            if (status === 200) {
              this.setState({
                openSnackBar: true,
                severitySnackBar: 'success',
                errorMsg: 'Perfil Editado con exito'
              });
            }
          })
          .catch((err, aux) => {
            this.setState({
              errorMsg: err.response ? err.response.data : 'Error',
              openSnackBar: true,
              severitySnackBar: 'error'
            });
          });
        this.props.callbackModal();
      }
    } else {
      await createUser(roles.EMPLOYEE.endpoint, {
        name,
        lastName,
        description,
        email,
        password,
        rubros,
        availableHours,
        paymentMethods,
        cellPhone,
        availableDates,
        profilePic,
        blackList: false,
        selectedDistricts
      })
        .then(async (res) => {
          const { status } = res;
          if (status === 200) {
            this.setState({ submit: true, submitError: false });
          }
        })
        .catch((err, aux) => {
          this.setState({
            errorMsg: err.response.data,
            openSnackBar: true,
            severitySnackBar: 'error'
          });
        });
    }
  };

  getIds() {
    var ids = [];
    this.state.data.selectedDistricts.forEach((elem) => {
      ids.push(elem.id);
    });
    return ids;
  }
  validateForm() {
    const options = { abortEarly: false };
    var errorRta;
    if (this.props.edit) {
      const error = Joi.validate(
        this.state.data,
        this.validationSchemaEdit,
        options
      );
      errorRta = error.error;
    } else {
      const error = Joi.validate(
        this.state.data,
        this.validationSchema,
        options
      );
      errorRta = error.error;
    }

    if (this.state.data.emailConfirm !== this.state.data.email) {
      this.setState({
        emailConfError: true,
        openSnackBar: true,
        severitySnackBar: 'error'
      });
      return 3;
    }
    if (this.state.data.pwconfirm !== this.state.data.password) {
      this.setState({
        passConfError: true,
        openSnackBar: true,
        severitySnackBar: 'error'
      });
      return 4;
    }
    if (!errorRta) {
      return 1;
    } else {
      this.setState({
        openSnackBar: true,
        errorMsg: errorRta.details[0].message,
        severitySnackBar: 'error'
      });
    }
    return errorRta;
  }

  validateProperty = ({ id, value }) => {
    const obj = { [id]: value };
    const propSchema = { [id]: this.validationSchema[id] };
    var res = Joi.validate(obj, propSchema);

    return res.error ? true : false;
  };

  addRubro = (e) => {
    e.preventDefault();
    var rubros = this.state.data.rubros;

    rubros.push({
      rubroType: this.state.tmpRubro,
      services: this.state.tmpSpecialities
    });
    this.setState({
      rubros,
      tmpRubro: '',
      tmpSpecialities: ['']
    });
  };

  handleAddField = () => {
    var tmpSpecialities = this.state.tmpSpecialities;
    tmpSpecialities.push('');
    this.setState({ tmpSpecialities });
  };
  handleRemoveField = () => {
    var tmpSpecialities = this.state.tmpSpecialities;
    if (tmpSpecialities.length > 1) tmpSpecialities.pop();
    else tmpSpecialities[0] = '';
    this.setState({ tmpSpecialities });
  };

  handleCloseSubmit(event, reason) {
    this.setState({ redirect: true });
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  };

  updateSelectedDistricts = (newPols) => {
    const selectedDistrictsAux = [];
    const { data } = this.state;

    newPols.forEach((pol) => selectedDistrictsAux.push(pol.props));
    data.selectedDistricts = selectedDistrictsAux;
    this.setState({ data });
  };

  removeRubro = (_, id) => {
    var rubros = this.state.data.rubros;
    rubros.splice(id, 1);
    this.setState({ rubros });
  };

  render() {
    const { name, lastName, description, email, emailConfirm, cellPhone } =
      this.state.data;
    const { redirect, fileName } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <Snackbar
          open={this.state.openSnackBar}
          autoHideDuration={4000}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={this.handleClose}
            severity={this.state.severitySnackBar}
          >
            {this.state.errorMsg}
          </Alert>
        </Snackbar>
        <Grid
          container
          spacing={9}
          style={{
            justifyContent: 'center',
            paddingBottom: '50px'
          }}
        >
          <Dialog
            open={
              this.state.submit === true && this.state.submitError === false
            }
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
              Un mail fue enviado a su casilla de correo electrónico. <br></br>
              Por favor siga las instrucciones del mismo para activar su cuenta.
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
          <Grid
            id="signUpForm"
            item
            xs={12}
            style={{
              justifyContent: 'center',
              maxWidth: '800px'
            }}
          >
            <form autoComplete="off" onSubmit={this.mySubmitHandler}>
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    {this.props.edit ? (
                      <FormH1>Editar Perfil</FormH1>
                    ) : (
                      <FormH1>
                        Complete los datos para Registrar Trabajador
                      </FormH1>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre"
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
                      label="Apellido"
                      id="lastName"
                      type="text"
                      onChange={this.handleChange}
                      required={true}
                      value={lastName}
                      error={this.state.errors.lastName}
                      helperText={
                        this.state.errors.lastName ? 'Mínimos 3 caracteres' : ''
                      }
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Descripcion"
                      id="description"
                      fullWidth
                      type="text"
                      multiline
                      rows={4}
                      onChange={this.handleChange}
                      value={description}
                      required
                      variant="outlined"
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      id="email"
                      type="email"
                      disabled={this.props.edit}
                      onChange={!this.props.edit ? this.handleChange : null}
                      required
                      value={email}
                      error={this.state.errors.email}
                      helperText={this.state.errors.email ? 'Error' : ''}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirme Email"
                      id="emailConfirm"
                      type="email"
                      disabled={this.props.edit}
                      onChange={!this.props.edit ? this.handleChange : null}
                      required
                      value={emailConfirm}
                      error={
                        this.state.data.emailConfirm !== this.state.data.email
                      }
                      helperText={
                        this.state.data.emailConfirm !== this.state.data.email
                          ? 'El email no coincide'
                          : ''
                      }
                    ></TextField>
                  </Grid>
                  {!this.props.edit ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Contraseña"
                          disabled={this.props.edit}
                          type="password"
                          id="password"
                          onChange={this.handleChange}
                          required={!this.props.edit}
                          error={this.state.errors.password}
                          helperText={this.state.errors.password ? 'Error' : ''}
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Repetir contraseña"
                          disabled={this.props.edit}
                          type="password"
                          id="pwconfirm"
                          onChange={this.handleChange}
                          required={!this.props.edit}
                          error={
                            this.state.data.pwconfirm !==
                            this.state.data.password
                          }
                          helperText={
                            this.state.data.pwconfirm !==
                            this.state.data.password
                              ? 'La contraseña no coincide'
                              : ''
                          }
                        ></TextField>
                      </Grid>{' '}
                    </>
                  ) : null}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular de contacto"
                      type="tel"
                      id="cellPhone"
                      value={cellPhone}
                      onChange={this.handleChange}
                      required
                      error={this.state.errors.cellPhone}
                      helperText={this.state.errors.cellPhone ? 'Error' : ''}
                    ></TextField>
                  </Grid>

                  {/* Grid break */}
                  <Grid style={{ width: '100%' }}></Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl sx={{ width: '95%' }}>
                      <InputLabel id="rubroSelect">Rubro</InputLabel>

                      <Select
                        id="rubroSelect"
                        label="Rubros"
                        value={
                          this.state.tmpRubro === ''
                            ? 'Rubro'
                            : this.state.tmpRubro
                        }
                        name="tmpRubro"
                        onChange={this.handleChangeSelect}
                        style={{
                          width: '95%'
                        }}
                        native
                        inputProps={{
                          name: 'tmpRubro',
                          id: 'tmpRubro'
                        }}
                        error={this.state.errors.rubros}
                      >
                        <option aria-label="None" value="" />
                        {areaTypes.map((rubro, index) => (
                          <option key={index} id={index} value={rubro}>
                            {translations[rubro]}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {this.state.tmpSpecialities.map((speciality, i) => {
                      return (
                        <div key={i}>
                          <TextField
                            style={{
                              width: '70%'
                            }}
                            type="text"
                            value={this.state.tmpSpecialities[i]}
                            key={i}
                            onChange={(e) => {
                              let tmpSpecialities = this.state.tmpSpecialities;
                              tmpSpecialities[i] = e.target.value;
                              this.setState({
                                tmpSpecialities
                              });
                            }}
                            label="Especialidad en Rubro"
                            id="tmpSpecialities"
                            disabled={this.state.tmpRubro === ''}
                          />
                          <Tooltip title="Eliminar Especialidad">
                            <IconHolder
                              id="lessbtn"
                              onClick={this.handleRemoveField}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconHolder>
                          </Tooltip>
                          <Tooltip title="Agregar Especialidad">
                            <IconHolder onClick={this.handleAddField}>
                              <AddIcon />
                            </IconHolder>
                          </Tooltip>
                        </div>
                      );
                    })}
                    <SUploadButton
                      style={{
                        marginTop: '10px'
                      }}
                      variant="outlined"
                      onClick={this.addRubro}
                      disabled={this.state.tmpSpecialities[0] === ''}
                    >
                      Agregar
                    </SUploadButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {this.state.data.rubros.map((rubro, i) => (
                      <div
                        key={i}
                        style={{
                          textAlign: 'left',
                          display: 'flex',
                          paddingLeft: ' 15px'
                        }}
                      >
                        <Tooltip title="Eliminar">
                          <IconHolder
                            id="removeRubro"
                            onClick={() => this.removeRubro(rubro, i)}
                          >
                            <RemoveCircleOutlineIcon fontSize="small" />
                          </IconHolder>
                        </Tooltip>
                        {translations[rubro.rubroType]} :
                        {rubro.services.map((specialty, i) => (
                          <p
                            style={{
                              paddingLeft: '10px'
                            }}
                            key={i}
                          >
                            {specialty},
                          </p>
                        ))}
                      </div>
                    ))}
                  </Grid>
                  {/* Grid Break */}
                  <Grid style={{ width: '100%' }}></Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>
                      Foto de perfil <br />
                    </FormLabel>
                    {this.props.edit ? (
                      'Presione sobre la foto en el perfil principal para editarla'
                    ) : (
                      <>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="profilePic"
                          multiple={false}
                          type="file"
                          onChange={(e) => {
                            e.preventDefault();
                            var reader = new FileReader();
                            let file = e.target.files[0];
                            this.setState({ fileName: file.name });
                            reader.onloadend = () => {
                              var data = this.state.data;
                              data['profilePic'] = reader.result;
                              this.setState({ data });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        <label htmlFor="profilePic">
                          <SUploadButton
                            variant="contained"
                            startIcon={<FaceIcon />}
                            component="span"
                            style={{ margin: '10px' }}
                          >
                            Subir foto
                          </SUploadButton>
                        </label>
                        <label>{fileName}</label>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>
                      Medios de pago <br />
                    </FormLabel>
                    {paymentMethods.map((method, i) => (
                      <label
                        key={i}
                        style={{
                          display: 'inline-block'
                        }}
                      >
                        <Checkbox
                          type="checkbox"
                          name="test"
                          color="primary"
                          defaultChecked={this.state.data[
                            'paymentMethods'
                          ].includes(method)}
                          onClick={(e) => {
                            var data = this.state.data;
                            if (!data['paymentMethods'].includes(method))
                              data['paymentMethods'].push(method);
                            else
                              data['paymentMethods'] = data[
                                'paymentMethods'
                              ].filter((item) => item !== method);
                            this.setState({ data });
                          }}
                        />
                        <CheckboxText htmlFor="rubros">{method}</CheckboxText>
                      </label>
                    ))}
                  </Grid>
                  <Grid item xs={12} sm={6} style={{ display: 'grid' }}>
                    <FormLabel>Dias y Horarios disponible</FormLabel>
                    {days.map((day, i) => (
                      <label
                        key={i}
                        style={{
                          display: 'inline-block',
                          color: 'black',
                          marginBottom: '5px',
                          width: 'fit-content'
                        }}
                      >
                        <Checkbox
                          id={'input' + i}
                          type="checkbox"
                          color="primary"
                          defaultChecked={this.state.data['availableDates'][i]}
                          name="availableDates"
                          onClick={(e) => {
                            var data = this.state.data;
                            if (data['availableDates'][i] === true) {
                              data['availableDates'][i] = false;
                              data['availableHours'][i] = parseInt(0);
                            } else {
                              data['availableDates'][i] = true;
                            }
                            this.setState({ data });
                          }}
                        />
                        <CheckboxText>{day}</CheckboxText>
                        {this.state.data.availableDates[i] ? (
                          <Select
                            native
                            inputProps={{
                              name: 'tmpRubro',
                              id: 'tmpRubro'
                            }}
                            value={this.state.data.availableHours[i]}
                            onChange={(event) => {
                              const data = {
                                ...this.state.data
                              };
                              data['availableHours'][i] = parseInt(
                                event.target.value
                              );
                              this.setState({ data });
                            }}
                            style={{
                              marginBottom: '0px',
                              height: '2em'
                            }}
                          >
                            {this.state.data.availableDates[i] ? (
                              timeFrames.map((timeFrame, idx) => (
                                <option key={idx} value={idx + 1}>
                                  {timeFrame}
                                </option>
                              ))
                            ) : (
                              <div />
                            )}
                          </Select>
                        ) : (
                          <div></div>
                        )}
                      </label>
                    ))}
                  </Grid>
                  {/* Grid break */}
                  <Grid item xs={12} sm={6}></Grid>
                  <Grid item xs={12}>
                    <FormLabel> Zonas de trabajo</FormLabel>
                    <Map
                      clickedPoligonos={this.updateSelectedDistricts}
                      polsId={this.props.selectedDistricts}
                      clickableMap={true}
                    ></Map>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions>
                <Grid container spacing={1}>
                  <Grid item xs={10}>
                    <SFormBtn type="submit">
                      {this.props.edit ? 'Guardar' : 'Registrarse'}
                    </SFormBtn>
                  </Grid>
                </Grid>
              </CardActions>
            </form>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default SignUpForm;
