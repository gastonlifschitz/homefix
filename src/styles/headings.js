import { Typography as TypographyUI } from '@mui/material';
import styled from 'styled-components';
import colors from './colors';

export const H1Heading = styled.h1`
  font-size: 2.5rem;
  color: ${colors.lightGrey};
  margin-bottom: 64px;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
  text-align: center;
`;

export const H2Heading = styled.h2`
  font-size: 2rem;
  color: Grey;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const H3Heading = styled.h3`
  font-size: 1.2rem;
  margin: 10px;
  color: ${colors.lightGrey};
  text-align: center;
`;

export const PHeading = styled.p`
  font-size: 1rem;
  text-align: center;
  color: ${colors.lightGrey};
  margin-bottom: 10px;
  word-break: break-all;
`;

export const STypography = styled(TypographyUI)`
  color: ${colors.primary};
  font-family: 'helvetica';
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
`;

export const SubtitleTypography = styled(TypographyUI)`
  color: Grey;
  font-family: 'helvetica';
  font-size: 1.2rem;
  margin-top: 1.2rem;
  cursor: default;
`;
