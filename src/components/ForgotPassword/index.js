//from material ui

import { Alert, AlertTitle } from '@mui/material';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Joi from 'joi-browser';
import React, { Component } from 'react';
import { forgotPassword } from '../../services/apiService';
import { SFormBtn } from '../../styles/buttons';
//from homefix styles
import { STypography } from '../../styles/headings';
import { SCard, SContainer } from '../../styles/styles';
//from homefix
import Header from '../Header';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errors: {
        email: false
      },
      error: false,
      submit: false,
      openAlert: false,
      successMsg: 'Chequear Errores'
    };
    //this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  validationSchema = {
    email: Joi.string().email().required()
  };

  validateProperty = ({ id, value }) => {
    const obj = { [id]: value };
    const propSchema = { [id]: this.validationSchema[id] };
    return Joi.validate(obj, propSchema).error ? true : false;
  };

  handleChange = (event) => {
    event.persist();
    const { errors } = this.state;
    const { target } = event;
    const { id, value } = target;
    errors[id] = this.validateProperty(target);
    this.setState({ [id]: value, errors });
  };
  validateForm = () => {
    const options = { abortEarly: false };
    const { email } = this.state;
    const data = { email };
    const { error } = Joi.validate(data, this.validationSchema, options);
    if (!error) return null;
    return error;
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const { email } = this.state;
    await forgotPassword({ email }).then(
      (resp) => {
        const { status } = resp;
        if (status === 200) {
          this.setState({ submit: true, error: false });
        } else if (status === 404) {
          //Problemas de usuario no existe
          this.setState({
            errorMessage: 'El email no se encuentra registrado',
            error: true
          });
        } else {
          //problemas de mail
          this.setState({
            errorMessage: 'An  has ocurred, please try again later',
            error: true
          });
        }
        return null;
      },
      () =>
        this.setState({
          errorMessage: 'Ha ocurrido un error',
          error: true
        })
    );
  };
  handleClose(event, reason) {
    this.props.history.push('/');
  }

  render() {
    return (
      <>
        <Header hideSearchBar />
        <Dialog
          open={this.state.submit === true && this.state.error === false}
          onClose={() => this.handleClose()}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        >
          <Alert severity="success">
            <AlertTitle>
              <strong>Reseteo Exitoso!</strong>
            </AlertTitle>
            Un mail fue enviado a su casilla de correo electrónico. <br></br>Por
            favor siga las instrucciones del mismo
          </Alert>
          <DialogActions style={{ backgroundColor: 'rgb(237, 247, 237)' }}>
            <Button onClick={() => this.handleClose()} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <SContainer
          component="main"
          maxWidth="lg"
          style={{ textAlign: 'center' }}
        >
          <Grid container style={{ justifyContent: 'center' }}>
            <SCard style={{ maxWidth: '500px' }}>
              <CardContent>
                <STypography style={{ textAlign: 'center' }}>
                  Verificar Mail
                </STypography>
                <STypography
                  component="h6"
                  variant="h4"
                  style={{ textAlign: 'center', color: 'red' }}
                >
                  {this.state.errorMessage}
                </STypography>
                <form onSubmit={this.handleSubmit} className="form" noValidate>
                  <TextField
                    type="email"
                    required
                    error={this.state.error}
                    id="email"
                    placeholder="email"
                    style={{ display: 'grid' }}
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <br />

                  <SFormBtn
                    fullWidth
                    onClick={this.handleSubmit}
                    disabled={this.validateForm() ? true : false}
                  >
                    Resetear contraseña
                  </SFormBtn>
                </form>
              </CardContent>
            </SCard>
          </Grid>
        </SContainer>
      </>
    );
  }
}
