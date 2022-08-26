import {
  Alert,
  AlertTitle,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  Grid,
  TextField
} from '@mui/material';
import Joi from 'joi-browser';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { resetPassword } from '../../services/apiService';
import { getCurrentUser } from '../../services/authService.js';
import { SFormBtn } from '../../styles/buttons';
//from homefix styles
import { STypography } from '../../styles/headings';
import { SCard, SContainer } from '../../styles/styles';
import Header from '../Header';
import './reset-password.css';

class NewPassword extends Component {
  constructor(props) {
    super(props);
    const { token } = this.props.match.params;
    if (!token) {
      this.props.history.push('/');
      return;
    }
    this.state = {
      password: '',
      repeatPassword: '',
      errors: {
        password: false,
        repeatPassword: false
      },
      error: false,
      submit: false,
      token
    };
    //this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  validationSchema = {
    password: Joi.string().required(),
    repeatPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({ language: { any: { allowOnly: 'must match password' } } })
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
    const { password, repeatPassword } = this.state;
    const data = { password, repeatPassword };
    const { error } = Joi.validate(data, this.validationSchema, options);
    if (!error) return null;
    return error;
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const { password, token } = this.state;

    try {
      const { status } = await resetPassword({
        newPassword: password,
        resetLink: token
      });
      if (status === 200) this.setState({ submit: true, error: false });
      else
        this.setState({
          errorMessage: 'An error has ocurred, please try again later',
          error: true
        });
      return null;
    } catch (ex) {
      this.setState({ errorMessage: 'Reset password error', error: true });
    }
  };
  render() {
    if (getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <Dialog
          open={this.state.submit === true && this.state.error === false}
          onClose={() => this.props.history.push('/login')}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        >
          <Alert severity="success">
            <AlertTitle>
              <strong>Reseteo Exitoso!</strong>
            </AlertTitle>
            Su contraseña se modifico correctamente
          </Alert>
          <DialogActions style={{ backgroundColor: 'rgb(237, 247, 237)' }}>
            <Button
              onClick={() => this.props.history.push('/login')}
              color="primary"
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Header hideSearchBar />
        <SContainer
          component="main"
          maxWidth="lg"
          style={{ textAlign: 'center' }}
        >
          <Grid container style={{ justifyContent: 'center' }}>
            <SCard style={{ maxWidth: '500px' }}>
              <CardContent>
                <STypography
                  component="h1"
                  variant="h5"
                  style={{ textAlign: 'center' }}
                >
                  Resetear contraseña
                </STypography>
                <STypography
                  component="h6"
                  variant="h4"
                  style={{ textAlign: 'center', color: 'red' }}
                >
                  {this.state.errorMessage}
                </STypography>
                
                <form className="form" noValidate>
                  <TextField
                    required
                    error={this.state.error}
                    id="password"
                    placeholder="Contraseña"
                    className="full-width"
                    label="Nueva contraseña "
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  <br />
                  <TextField
                    error={this.state.error}
                    id="repeatPassword"
                    label="Repetir contraseña"
                    placeholder="Contraseña"
                    className="full-width"
                    type="password"
                    required
                    value={this.state.repeatPassword}
                    onChange={this.handleChange}
                  />
                  <br />
                  <SFormBtn
                    fullWidth
                    type="password"
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
      </div>
    );
  }
}
export default NewPassword;
