import { action, makeObservable, observable } from 'mobx';
import { getCurrentUser } from './authService';

class Store {
  searchFilter = {
    wildcard: null,
    areaType: null,
    pageNumber: 1,
    neighborhood: null
  };
  possibleNeighborhoods = [];

  constructor() {
    makeObservable(this, {
      searchFilter: observable,
      setSearchFilter: action.bound,
      setPossibleNeighborhoods: action.bound
    });
  }

  setSearchFilter = (searchFilter) => {
    this.searchFilter = searchFilter;
  };
  setPossibleNeighborhoods = (neighborhoods) => {
    this.possibleNeighborhoods = neighborhoods;
  };


  get getSearchFilters() {
    return this.searchFilter;
  }
  get getLoggedUser() {
    return getCurrentUser();
  }
  get getPossibleNeighborhoods() {
    return this.possibleNeighborhoods;
  }
}

export default new Store();
