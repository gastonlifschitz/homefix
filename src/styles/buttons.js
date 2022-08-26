import { Button as ButtonUI } from '@mui/material';
import styled from 'styled-components';
import colors from './colors';

export const SButton = styled(ButtonUI)`
  color: ${colors.primary};
`;

export const SOutlineButton = styled(ButtonUI)`
  color: ${colors.primary};
  padding: 5px;
  border: 1px solid ${colors.primary};
  margin-right: 10px;
`;

export const SmallButton = styled(ButtonUI)`
  color: ${colors.primary};
  font-size: 0.75rem;
`;

export const SUploadButton = styled(ButtonUI)`
  font-size: 0.9rem;
  & .label {
    font-size: 12px;
  }
`;

export const SFormBtn = styled(ButtonUI)`
  background: ${colors.button};
  border: none;
  color: white;
  cursor: pointer;

  &:disabled {
    color: rgba(16, 16, 16, 0.3);
    background-color: rgba(239, 239, 239, 0.3);
    border: groove;
    border-color: rgba(118, 118, 118, 0.3);
    cursor: default;
  }
  &:hover {
    transition: all 0.2s ease-in-out;
    background: pink;
    color: black;
  }
`;
