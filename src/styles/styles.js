import {
  Card as CardUI,
  Container as ConteinerUI,
  Link as LinkUI,
  Paper as PaperUI,
  Tab as TabUI,
  Tabs as TabsUI
} from '@mui/material';
import styled from 'styled-components';
import colors from '../styles/colors';

export const SCard = styled(CardUI)`
  /* background-color: ${colors.background}; */
`;

export const SContainer = styled(ConteinerUI)`
  padding: 50px;
`;

export const SLink = styled(LinkUI)`
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${colors.primary} !important ;
  width: 90%;
`;

export const STab = styled(TabUI)`
  color: ${colors.primary};
  font-family: 'helvetica';
`;

export const STabs = styled(TabsUI)`
  /* background-color: ${colors.background}; */
  background-color: white;
`;


export const SPaper = styled(PaperUI)`
  width: fit-content;
  height: fit-content;
  align-self: center;
  border-radius: 15px;
  padding: 10px;
  margin: 5px;
  cursor: default;
`;
