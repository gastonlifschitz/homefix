import { Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { Component } from 'react';
import {
  getAllEmployees,
  getAverageRating,
  getReportedReviews
} from '../../services/apiService';
import { H2Heading } from '../../styles/headings';
import { NavBtnModal } from '../Buttons/buttonsStyle';
import HomefixLoading from '../common/HomefixLoading';
import BlackList from './BlackList';
import ListReviews from './ListReviews';
import ListWorkers from './ListWorkers';
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      employees: [],
      reviews: [],
      blackList: [],
      reload: false,
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    let { data: reviews } = await getReportedReviews();
    let { data: employees } = await getAllEmployees();
    let blackList = [];
    let noBlackEmployees = [];

    for (let i in employees) {
      employees[i].rating = await this.getRating(employees[i]._id);
    }
    for (let i in employees) {
      if (employees[i].blackList) {
        blackList.push(employees[i]);
      } else {
        noBlackEmployees.push(employees[i]);
      }
    }

    this.setState({
      reviews,
      employees: noBlackEmployees,
      blackList,
      isLoading: false
    });
  }

  getRating = async (id) => {
    let { data: avg } = await getAverageRating(id);
    if (avg.length === 0) return 0;
    return avg[0].avg;
  };

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  handleReload() {
    this.setState({ reload: true });
  }

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
          <Box  id="box">
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  render() {
    const { value, isLoading } = this.state;
    return (
      <Grid container style={{padding:"20px"}} direction="column" spacing={3}>
        <HomefixLoading isLoading={isLoading} />
        <Grid item >
          <H2Heading>Página de Administrador</H2Heading>
        </Grid>
        <Grid item >

          <AppBar position="static" style={{background:"white"}}>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Trabajadores"></Tab>
              <Tab label="Reseñas Reportadas" />
              <Tab label="Trabajadores Reportados" />
            </Tabs>
          </AppBar>
          <this.TabPanel value={value} index={0}>
            <ListWorkers employeesArgument={this.state.employees} />
          </this.TabPanel>

          <this.TabPanel value={value} index={1}>
            <ListReviews reviewsArgument={this.state.reviews} />
          </this.TabPanel>
          <this.TabPanel value={value} index={2}>
            <BlackList blackListArgument={this.state.blackList} />
          </this.TabPanel>
        </Grid>
        <Grid item xs={3}>
        <NavBtnModal
          visible={false}
          style={{ margin: '10px',width:"20%" }}
          onClick={() => {
            this.props.history.push('/logout');
          }}
        >
          Log Out
        </NavBtnModal>
        </Grid>
      </Grid>
    );
  }
}

export default Admin;
