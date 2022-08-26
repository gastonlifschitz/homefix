import React from 'react';
import { Search, SearchInput } from './SearchBarStyle';

const SearchBar = ({ searchText, onChangeSearch }) => {
  return (
    <Search>
      {' '}
      <SearchInput
        placeholder="Buscar..."
        value={searchText}
        onChange={onChangeSearch}
      />
     
    </Search>
  );
};

export default SearchBar;
