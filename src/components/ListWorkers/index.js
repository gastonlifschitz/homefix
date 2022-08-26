import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { areaTypes, cat } from '../../config.json';
import {
  getAllEmployeesOrdered,
  getAverageRating
} from '../../services/apiService';
import Neighborhood from '../../services/neighborhood';
import store from '../../services/store';
import { H3Heading } from '../../styles/headings';
import HomefixLoading from '../common/HomefixLoading';
import Header from '../Header';
import {
  ServiceCard,
  ServiceCardTitle,
  ServiceIcon,
  ServicesCardsContainer,
  ServicesTitle
} from './ListWorkersStyle';
import Pagination from './Pag';
import RenderEmployees from './RenderEmployees';

class ListWorkers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      arrayOfProfilePics: [],
      searchText: '',
      possibleNeighborhoods: [],
      sortByRating: true,
      employeesPerPage: 5,
      totalPages: 1,
      isLoading: true
    };
    store.setSearchFilter({
      ...store.getSearchFilters,
      wildcard: this.props.match.params.wildcard,
      areaType: this.props.match.params.id
    });
    this.onChangeSearchInput = this.onChangeSearchInput.bind(this);
  }
  async componentDidMount() {
    const user = store.getLoggedUser;

    if (user) {
      const possibleNeighborhoods =
        await Neighborhood.getNeighborhoodsFromNeighbour(user.neighbour);

      this.setState({ possibleNeighborhoods });
    }
    if (!(this.props.showCategories && this.state.searchText === '')) {
      await this.performSearch();
    }
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this.setState({ isLoading: false });
  }

  setSearchFilter = (params) => {
    store.setSearchFilter({
      ...store.getSearchFilters,
      ...params
    });
  };

  parameterBuilder = (wildcard, areaType, neighborhood, page) => {
    let object = {};

    if (wildcard) object.wildcard = wildcard;
    if (areaType) object.areaType = areaType;
    if (neighborhood) object.neighborhood = neighborhood;
    if (page) object.page = page;

    return object;
  };

  getRating = async (id) => {
    let { data: avg } = await getAverageRating(id);

    if (avg.length === 0) return 0;
    return avg[0].avg;
  };

  onChangeSearchInput = async (event) => {
    const { value } = event.target;

    this.setSearchFilter({ wildcard: value, pageNumber: 1 });

    this.setState({ searchText: value });

    setTimeout(async () => {
      await this.performSearch();
    }, 100);
  };

  paginate = async (pageNumber) => {
    this.setSearchFilter({ pageNumber });
    await this.performSearch();
  };

  performSearch = async () => {
    this.setState({ isLoading: true });

    var {
      wildcard,
      areaType: id,
      neighborhood,
      pageNumber: page
    } = store.getSearchFilters;

    const { data: result } = await getAllEmployeesOrdered(
      this.parameterBuilder(wildcard, areaTypes[id], neighborhood, page)
    );

    if (result.sortByRating) {
      await this.getEmployeesRating(result.employees);

      this.setState({
        isLoading: false,
        employees: result.employees,
        ...result
      });
    } else {
      await this.getEmployeesRating(result.knownEmployees);
      await this.getEmployeesRating(result.nearEmployees);
      await this.getEmployeesRating(result.restOfEmployees);

      this.setState({
        isLoading: false,
        employees: {
          knownEmployees: result.knownEmployees,
          restOfEmployees: result.restOfEmployees,
          nearEmployees: result.nearEmployees
        },
        ...result
      });
    }
  };

  getEmployeesRating = async (employees) => {
    for (let i in employees) {
      employees[i].rating = await this.getRating(employees[i]._id);
    }
  };

  renderFilteredSearch = () => {
    const { wildcard } = store.getSearchFilters;
    return (
      <Stack direction="row" spacing={1}>
        {wildcard ? (
          <Chip
            label={wildcard}
            onDelete={() => this.onChangeSearchInput({ target: { value: '' } })}
          />
        ) : null}
      </Stack>
    );
  };

  handleNeighborhoodChange = async (event) => {
    this.setSearchFilter({
      neighborhood: event.target.value || null,
      pageNumber: 1
    });

    await this.performSearch();
  };

  render() {
    const { employees, possibleNeighborhoods, sortByRating, isLoading } =
      this.state;
    const { areaType: id, neighborhood } = store.getSearchFilters;

    return (
      <>
        <HomefixLoading isLoading={isLoading} />

        <Header
          showSearchBar
          searchText={this.state.searchText}
          onChangeSearch={this.onChangeSearchInput}
          selectNeighborhood={
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="barrioSelect">Grupo</InputLabel>
              <Select
                id="barrioSelect"
                label="Grupo"
                onChange={this.handleNeighborhoodChange}
                value={neighborhood || ''}
                style={{ marginBottom: '25px' }}
              >
                <MenuItem value="">
                  <em>Sin grupo</em>
                </MenuItem>
                {possibleNeighborhoods.map((tmp, index) => (
                  <MenuItem value={tmp.name} key={index}>
                    {tmp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        />
        <ServicesCardsContainer id="services">
          {this.renderFilteredSearch()}
          <ServicesTitle>
            {id ? cat[id].name : 'Nuestros servicios'}
          </ServicesTitle>
          {!sortByRating ? (
            <>
              <H3Heading>Empleados contratados</H3Heading>
              <RenderEmployees
                employees={employees.knownEmployees}
                sortByRating={sortByRating}
              />
              <H3Heading>Empleados cercanos</H3Heading>
              <RenderEmployees
                employees={employees.nearEmployees}
                sortByRating={sortByRating}
              />
              <H3Heading>El resto</H3Heading>
              <RenderEmployees
                employees={employees.restOfEmployees}
                sortByRating={sortByRating}
              />
            </>
          ) : (
            <RenderEmployees
              employees={employees}
              sortByRating={sortByRating}
              categories={
                this.props.showCategories && this.state.searchText === ''
                  ? cat.map((cat, i) => {
                      return (
                        <ServiceCard
                          key={i}
                          to={`/services/category/${cat.id}`}
                        >
                          <ServiceIcon src={`/img/${cat.name}.png`} />
                          <ServiceCardTitle>{cat.name}</ServiceCardTitle>
                        </ServiceCard>
                      );
                    })
                  : null
              }
            />
          )}
          <Pagination
            totalPages={this.state.totalPages}
            paginate={this.paginate}
          ></Pagination>
        </ServicesCardsContainer>
      </>
    );
  }
}

export default withRouter(observer(ListWorkers));
