import styled from 'styled-components';

export const Search = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  place-content: center;

  @media screen and (max-width: 168px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  border-radius: 50px;

  white-space: nowrap;
  padding: 10px 22px;
  color: black;
  font-size: 14px;
  outline: none;
  border: 2px solid grey;
  cursor: text;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  /* padding: 8px 115px; */
  /* color: black; */
  /* font-size: 14px; */
  /* outline: none; */
  /* border: 1px solid #808080bf; */
  /* cursor: text; */
  /* -webkit-transition: all 0.2s ease-in-out; */
  /* transition: all 0.2s ease-in-out; */
  /* -webkit-text-decoration: none; */
  /* text-decoration: none; */
`;
