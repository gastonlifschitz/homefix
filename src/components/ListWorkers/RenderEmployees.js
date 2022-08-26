import React from 'react';
import SearchWorkers from '../SearchWorkers';
import { ServicesWrapper } from './ListWorkersStyle';

export default function RenderEmployees({
  employees,
  sortByRating,
  categories
}) {
  return (
    <ServicesWrapper id="servicesWrapper">
      {categories ? (
        categories
      ) : (
        <SearchWorkers employees={employees} sortByRating={sortByRating} />
      )}
    </ServicesWrapper>
  );
}
