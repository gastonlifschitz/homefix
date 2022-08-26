import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';

export const CheckboxText = styled.span`
  text-align: center;
  padding: 10px;
  color: black;
  font-size: 14px;
  cursor: pointer;
`;

export const WorkerDescription = styled.textarea`
  padding: 6px 6px;
  margin-bottom: 32px;
  border: 0;
  border-radius: 4px;
  width: 95%;

  color: #666;
  &:hover {
    border: 0;
  }
`;

export const IconHolder = styled(IconButton)`
  padding: 0px !important;
  width: 10%;
`;

export const ImgInput = styled.input`
  font-size: 14px;
  color: black;
`;

export const Check = styled.input`
  cursor: pointer;
  &:hover {
    background: #ccc;
  }
`;
