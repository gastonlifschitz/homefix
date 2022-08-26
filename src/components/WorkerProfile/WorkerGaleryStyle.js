import styled from 'styled-components';

export const GaleryColumn = styled.div`
  -ms-flex: 25%; /* IE10 */
  flex: 25%;
  max-width: 25%;
  padding: 0 4px;
  @media screen and (max-width: 600px) {
    -ms-flex: 100%;
    flex: 100%;
    max-width: 100%;
  }
`;

export const GaleryRow = styled.div`
  display: -ms-flexbox; /* IE10 */
  display: flex;
  -ms-flex-wrap: wrap; /* IE10 */
  flex-wrap: wrap;
  padding: 20px 50px;
`;

export const ColumnImg = styled.img`
  margin-top: 8px;
  vertical-align: middle;
  width: 100%;
`;
