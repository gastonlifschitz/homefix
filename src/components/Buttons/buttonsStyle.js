import { Link as LinkR } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../styles/colors';
export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  align-items: flex-end;

  flex-direction: column;
  @media screen and (max-width: 768px) {
    display: none !important;
  }
`;

export const NavBtnShow = styled.nav`
  display: flex;
  align-items: center;
`;

export const NavBtnLink = styled(LinkR)`
  border-radius: 50px;
  background: ${colors.button};
  white-space: nowrap;
  padding: 10px 22px;
  color: white;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  text-align: center;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: pink;
    color: black;
  }
`;

export const NavBtnModal = styled.div`
  border-radius: 50px;
  background: ${colors.button};
  white-space: nowrap;
  padding: 10px 22px;
  color: white;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  text-align: center;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: pink;
    color: black;
  }
`;

export const SmallBtn = styled.button`
  background: ${colors.button};
  padding: 10px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: pink;
    color: black;
  }
  &:disabled {
    color: rgba(16, 16, 16, 0.3);
    background-color: rgba(239, 239, 239, 0.3);
    border: groove;
    border-color: rgba(118, 118, 118, 0.3);
    cursor: default;
  }
`;
