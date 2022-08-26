import Rating from '@mui/material/Rating';
import { Link as LinkR } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../styles/colors';

export const ServicesCardsContainer = styled.div`
  display: flex;
  padding: 50px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 900px;
  /* @media screen and (max-width: 768px) {
    height: 1100px;
  }

  @media screen and (max-width: 480px) {
    height: 1300px;
  } */
  @media screen and (max-width: 380px) {
    padding: 0px;
  }
`;

export const ServicesWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  grid-gap: 20px;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`;

export const ServiceCard = styled(LinkR)`
  /* width: 300px;
  height: 340px; */

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 30px;
  background: rgb(0 0 0 / 4%);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
  padding: 30px;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
`;

export const ServiceIcon = styled.img`
  height: 160px;
  width: 160px;
  margin-bottom: 10px;
  opacity: 0.3;
`;

export const ServicesTitle = styled.h1`
  font-size: 2.5rem;
  color: ${colors.grey};
  margin-bottom: 64px;
  text-align: center;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const ServiceCardTitle = styled.h2`
  font-size: 1.2rem;
  margin: 10px;
  color: ${colors.lightGrey};
`;
export const ServiceDescription = styled.p`
  font-size: 1rem;
  text-align: center;
  color: ${colors.lightGrey};
  margin-bottom: 10px;
  word-break: break-all;
`;

export const StartsStyle = styled(Rating)`
  justify-content: center;
  cursor: pointer;
`;
