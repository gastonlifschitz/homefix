import { Alert, AlertTitle, Dialog } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Joi from 'joi-browser';
import React, { Component } from 'react';
import { loginUser } from '../../services/authService.js';
import { SButton, SFormBtn } from '../../styles/buttons';
//from homefix styles
import { H1Heading, STypography } from '../../styles/headings';
import { SCard, SContainer, SLink, STab, STabs } from '../../styles/styles';
import Header from '../Header';
import AllSignUp from './AllSignUp';
import './styles.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {
        email: false,
        password: false
      },
      errorMsg: '',
      error: false,
      open: false,
      tabValue: 0,
      openDialog: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm = () => {
    const options = {
      abortEarly: false
    };
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    const { error } = Joi.validate(data, this.validationSchema, options);

    if (!error) {
      return null;
    } else {
      return error;
    }
  };

  validationSchema = {
    email: Joi.string().email().required(),

    password: Joi.string().min(1).max(30)
  };

  validateProperty = ({ id, value }) => {
    const obj = { [id]: value };
    const propSchema = { [id]: this.validationSchema[id] };
    return Joi.validate(obj, propSchema).error ? true : false;
  };

  handleChange = (event) => {
    event.persist(); // allow native event access (see: https://facebook.github.io/react/docs/events.html)
    const { errors } = this.state;
    errors[event.target.id] = this.validateProperty(event.target);
    this.setState({ [event.target.id]: event.target.value });
  };
  handleSubmit = async (event) => {
    const { email, password } = this.state;
    event.preventDefault();

    try {
      const jwt = await loginUser(email, password);

      if (jwt.admin) {
        this.props.history.push('/myProfile');
      } else {
        this.props.history.push('/');
      }
      return null;
    } catch (ex) {
      const error = ex.response ? ex.response.data : ex.response;
      let { errors } = this.state;
      if (ex.response.status === 401) {
        errors.password = true;
        this.setState({ errorMessage: error, errors, error: true });
      } else if (ex.response.status === 400) {
        this.setState({
          openDialog: true,
          dialogSeverity: 'error',
          dialogMsg:
            ex.response.data + ' Comuniquese con Homefix para mas información',
          dialogTitle: 'Error'
        });
      } else {
        errors.email = true;
        this.setState({ errorMessage: error, errors, error: true });
      }
    }
  };

  //handle tabs
  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>{<STypography component={'span'}>{children}</STypography>}</Box>
        )}
      </div>
    );
  }
  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  handleDialogClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openDialog: false,
      dialogSeverity: '',
      dialogMsg: '',
      dialogTitle: ''
    });
  };

  render() {
    return (
      <>
        <Header hideSearchBar />
        <SContainer component="main">
          <Grid
            container
            spacing={9}
            style={{ justifyContent: 'center', paddingBottom: '50px' }}
          >
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <H1Heading style={{ marginBottom: '30px' }}>
                Tu lugar de reseñas confiables
              </H1Heading>
              <SButton onClick={() => this.props.history.push('/')}>
                Continuar como invitado
              </SButton>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ justifyContent: 'center', maxWidth: '700px' }}
            >
              <AppBar position="static">
                <STabs
                  value={this.state.tabValue}
                  onChange={this.handleTabChange}
                  aria-label="full width tabs "
                >
                  <STab label="Iniciar Sesión" {...this.a11yProps(0)} />
                  <STab label="Registrarse" {...this.a11yProps(1)} />
                </STabs>
              </AppBar>
              <this.TabPanel value={this.state.tabValue} index={0}>
                <SCard>
                  <CardContent>
                    <Grid container spacing={4}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          type="email"
                          error={this.state.errors.email}
                          id="email"
                          placeholder="Email *"
                          required
                          value={this.state.email}
                          onChange={this.handleChange}
                          helperText={
                            this.state.errors.email ? 'Email incorrecto' : ''
                          }
                          variant="standard"
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          type="password"
                          required
                          error={this.state.errors.password}
                          id="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                          helperText={
                            this.state.errors.password ? 'Invalido' : ''
                          }
                          placeholder="Contraseña *"
                          variant="standard"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions style={{ padding: '16px', paddingTop: '30px' }}>
                    <Grid container spacing={1}>
                      <Grid item xs={10}>
                        <SFormBtn
                          onClick={this.handleSubmit}
                          disabled={this.validateForm() ? true : false}
                        >
                          Iniciar sesión
                        </SFormBtn>
                      </Grid>
                      <Grid item xs={10}>
                        <SLink
                          onClick={() =>
                            this.props.history.push('/forgotPassword')
                          }
                        >
                          Olvido su contraseña?
                        </SLink>
                      </Grid>
                    </Grid>
                  </CardActions>
                </SCard>{' '}
              </this.TabPanel>
              <this.TabPanel value={this.state.tabValue} index={1}>
                <AllSignUp {...this.props}></AllSignUp>
              </this.TabPanel>
            </Grid>
          </Grid>
          <Dialog
            open={this.state.openDialog}
            onClose={() => this.handleDialogClose()}
          >
            <Alert
              onClose={this.handleDialogClose}
              severity={this.state.dialogSeverity}
            >
              <AlertTitle>
                <strong>{this.state.dialogTitle}</strong>
              </AlertTitle>
              {this.state.dialogMsg}
            </Alert>
          </Dialog>
        </SContainer>
      </>
    );
  }
}

export default Login;
