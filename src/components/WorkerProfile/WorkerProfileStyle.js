import { Card as MCard } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { Link as LinkR } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styled from 'styled-components';
import colors from '../../styles/colors';

export const UserProfileContainer = styled.div`
  width: 100%;
  /* height: 800px; */
  background: ${colors.background};
  /* @media screen and (max-width: 768px) {
    height: 1100px;
  } */

  /* @media screen and (max-width: 480px) {
    height: 1300px;
  } */
`;
export const CoverPage = styled.img`
  /* height: 25%; */
  max-height: 200px;
  width: 100%;
  /* @media screen and (max-width: 768px) {
    height: 15%;
  } */
`;

export const UserProfileWraper = styled.div`
  height: 75%;
  width: 100%;

  display: table;
  clear: both;
  /* @media screen and (max-width: 600px) {
    width: 100%;
  } */
  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    /* display: contents; */
  }

  @media screen and (max-width: 768px) {
    /* grid-template-columns: 1fr;
    padding: 0 20px; */
    display: contents;
  }
`;


export const ProfileInfo = styled(MCard)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  height: inherit;
  cursor: default;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  height: fit-content;

  border-radius: 30px;
  background: rgb(0 0 0 / 4%);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
`;

export const ServicesProvided = styled(MCard)`
  background: ${colors.background};
  display: flex;
  margin-top: 25%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15px;
  padding: 10px;
  height: fit-content;
  cursor: default;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); */
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  background: 'white';
`;

export const CardEmployee = styled(MCard)`
  background: ${colors.background};
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
`;

export const EmployeeActionController = styled.div`
  text-align: center;
  display: grid;
  @media screen and (max-width: 900px) {
    display: block;
  }
`;

export const ProfilePic = styled.img`
  height: 160px;
  width: 160px;
  margin-bottom: 10px;
`;

export const ProfileName = styled.h1`
  font-size: 1.5rem;
  color: Black;
  margin-top: 20px;
  text-align: center;
  margin-bottom: 30px;
`;

export const ProfileDesc = styled.h2`
  font-size: 1rem;
  margin-bottom: 10px;
  color: black;
  text-align: center;
`;

export const UserWorkInfo = styled.div`
  width: 100%;
  height: 100%;
  float: left;
  @media screen and (max-width: 768px) {
    width: 100%;
    min-height: inherit;
    float: none;
  }
`;

export const STabs = styled(Tabs)`
  color: black;
  font-size: 1.2rem;
  height: 100%;
  width: 100%;

  /* @media screen and (max-width: 768px) {
    width: 100%;
    height: initial;
    float: none;
  } */
`;

export const STabList = styled(TabList)`
  list-style-type: none;
  display: flex;
  margin: 0;
  border-bottom: 7px solid #80808030;
  @media screen and (max-width: 400px) {
    flex-direction: column;
  }
`;
STabList.tabsRole = 'TabList';

export const STab = styled(Tab)`
  user-select: none;
  cursor: arrow;
  width: 100%;
  padding: 15px 15px;
  cursor: pointer;
  color: grey;
  /* border-bottom: outset; */
  border-color: pink;

  &.is-selected {
    color: black;
    font-weight: bold;
    cursor: default;
    border-bottom: 5px solid red;
    display: inline;
  }
`;

export const STabPanel = styled(TabPanel)`
  display: none;
  min-height: 40vh;
  margin-top: -5px;
  height: 90%;

  &.is-selected {
    display: grid;
  }
`;
STabPanel.tabsRole = 'TabPanel';

export const CardsContainer = styled.div`
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${colors.secondary};

  @media screen and (max-width: 768px) {
    height: 1100px;
  }

  @media screen and (max-width: 480px) {
    height: 1300px;
  }
`;

export const CardsWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  grid-gap: 16px;
  padding: 20px 50px;
  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 20px;
  }
`;

export const Card = styled(LinkR)`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  max-height: 340px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  cursor: default;
`;
export const CardModal = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  max-height: 340px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  cursor: default;
`;

export const CardIcon = styled.img`
  height: 160px;
  width: 160px;
  margin-bottom: 10px;
`;

export const CardsTitle = styled.h1`
  font-size: 2.5rem;
  color: Black;
  margin-bottom: 6px;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const CardTitle = styled.h2`
  font-size: 1rem;
  margin-bottom: 6px;
  color: black;
  width: 100%;
  height: 20%;
`;
export const CardDescription = styled.p`
  font-size: 1rem;
  text-align: left;
  margin-left: 80px;
  color: black;
  width: -webkit-fill-available;

  margin-bottom: 10px;
`;

export const ServiceCard = styled(LinkR)`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 0px;
  padding: 10px;
  height: inherit;
  cursor: default;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); */
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  background: ${colors.secondary};
`;

export const ServiceIcon = styled(Avatar)`
  max-height: 160px;
  width: auto;
  flex-basis: content;
  margin-bottom: 10px;
  border-radius: 100px;
`;

export const ServicesTitle = styled.h1`
  font-size: 2.5rem;
  color: Black;
  margin-bottom: 64px;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const ServiceCardTitle = styled.h2`
  font-size: 1rem;
  margin-bottom: 10px;
  color: black; ;
`;
export const ServiceDescription = styled.p`
  font-size: 1rem;
  text-align: center;
  color: black;
  margin-bottom: 10px;
`;

export const GeneralWrapper = styled(Grid)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  padding: 20px 50px;
  width: 100%;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 20px;
  }
`;

export const CarrouselWrapper = styled.div`
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  padding: 20px 50px;
  width: 100%;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 20px;
  }
`;

export const SGrid = styled(Grid)`
  justify-content: flex-start;
  display: flex;
  align-content: center;
  align-items: center;
  border-right: 1px inset;
  flex-direction: column;
  
`;

export const SyCard = styled(MCard)`
  margin: 10px;
  background-color: ${colors.backgroundCard};
  border-radius: 30px;
  @media screen and (min-width: 900px) {
    display: flex;
  }
`;
