import React from 'react';
import { PagElem, Pagination } from '../Pagination/PaginationStyle';
const Pag = ({ perPage, totalCat, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCat / perPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav style={{ textAlign: 'center', paddingTop: '30px' }}>
      <Pagination>
        {pageNumbers.map((number) => (
          <PagElem
            onClick={() => paginate(number)}
            key={number}
            className="page-link"
          >
            {number}
          </PagElem>
        ))}
      </Pagination>
    </nav>
  );
};

export default Pag;
