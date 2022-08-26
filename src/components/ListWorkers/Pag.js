import React from 'react';
import { PagElem, Pagination } from '../Pagination/PaginationStyle';

const Pag = ({ totalPages, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <nav style={{ textAlign: 'center', paddingTop: '30px' }}>
      <Pagination>
        {pageNumbers.map((number, i) => (
          <PagElem
            key={i}
            onClick={() => paginate(number)}
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
