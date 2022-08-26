import { Tabs as TabsUI } from '@mui/material';
import styled from 'styled-components';

export const STabs = styled(TabsUI)`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
