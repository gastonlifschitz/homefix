import styled from 'styled-components';

export const Pagination = styled.ul`
  display: inline-block;
`;
export const PagElem = styled.a`
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color 0.3s;
  border: 1px solid #ddd;
  margin: 0 4px;
  border-radius: 5px;
  cursor: pointer;

  &:active {
    background-color: #4caf50;
    color: white;
    border: 1px solid #4caf50;
  }

  &:hover:not(:active) {
    background-color: #ddd;
  }
`;
