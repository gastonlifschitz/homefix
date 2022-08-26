import { IconButton as IconButtonM } from '@mui/material';
import { Link as LinkR } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../styles/colors';
export const Nav = styled.nav`
  /* background: ${colors.background}; */
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;

  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
  }
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* height: 80px; */
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1100px;
  @media screen and (max-width: 280px) {
    padding: 0px;
  }
`;

export const NavLogo = styled(LinkR)`
  color: ${colors.primary};
  justify-self: flex-start;
  flex: 1;
  cursor: pointer;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  text-decoration: none;

  @media screen and (max-width: 768px) {
    place-content: center;
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.li`
  height: 80px;
`;

export const NavLink = styled(LinkR)`
  color: ${colors.primary};
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    border-bottom: 3px solid blue;
  }
`;

export const MobileIcon = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: black;
  }
`;

//MATERIAL UI CSS
export const IconButton = styled(IconButtonM)`
  @media only screen and (min-width: 768px) {
    display: none;
  }
`;
