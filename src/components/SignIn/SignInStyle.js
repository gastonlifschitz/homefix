import { Link, Select as SelectUI, TextField } from '@mui/material';
import { Link as LinkR } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styled from 'styled-components';
import colors from '../../styles/colors';
export const Container = styled.div`
  min-height: 692px;
  bottom: 0;
  padding: 50px;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
  overflow: hidden;
  /* background: ${colors.secondary}; */
`;

export const FormWrap = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 400px) {
    height: 80%;
  }
`;

export const FormContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 480px) {
    padding: 10px;
  }
`;

export const Form = styled.form`
  background: ${colors.secondary};
  height: auto;
  max-width: 800px;
  width: 100%;
  z-index: 1;
  display: grid;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;

export const FormH1 = styled.h1`
  padding-bottom: 40px;
  padding-top: 20px;
  color: ${colors.primary};
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  /* background: ${colors.background}; */
`;

export const H4 = styled.h4`
  margin-bottom: 8px;
  font-size: 14px;
  color: ${colors.primary};
  width: 90%;
`;

export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: ${colors.primary};
  width: 90%;
`;
export const FormInput = styled(TextField)`
  background: 'transparent';

  margin-bottom: 32px !important;
  border: 0 !important;
  border-radius: 4px;
  width: 90%;
  /* border-bottom: 1px solid black; */
  // background-color: #fff;
  color: #666;
  /* &:hover {
    border: 0;
    border-bottom: "none";
  }
  &:after {
    border-bottom: "none";
  } */
  :required {
    margin: 0 !important;
  }
`;

export const FormButton = styled.button`
  background: ${colors.button};
  padding: 16px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 20px;
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
export const Text = styled.span`
  text-align: center;
  margin-top: 24px;
  color: black;
  font-size: 14px;
`;

export const Select = styled(SelectUI)`
  // padding: 6px 6px;
  // border: 0;
  // border-radius: 4px;
  // margin-bottom: 32px;
  // /* border-bottom: 1px solid black; */

  // background-color: #fff;
  // color: #666;
  // &:hover {
  //   border: 0;
  // }

  // background: transparent;
  // color: gray;
  // font-size: 14px;
  // border: none;

  // option {
  //   color: black;
  //   background: white;
  //   display: flex;
  //   white-space: pre;
  //   min-height: 20px;
  // }
`;

export const STabs = styled(Tabs)`
  color: white;
  font-size: 1.2rem;
`;

export const STabList = styled(TabList)`
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
`;
STabList.tabsRole = 'TabList';

export const STab = styled(Tab)`
  user-select: none;
  cursor: arrow;
  width: 100%;
  padding: 15px 15px;
  cursor: pointer;
  &.is-selected {
    color: ${colors.primary};
    /* background: ${colors.background}; */
    cursor: default;
  }
`;

export const STabPanel = styled(TabPanel)`
  display: none;
  min-height: 40vh;
  padding: 40px;
  margin-top: -5px;

  &.is-selected {
    display: inline-block;
    /* background: ${colors.background}; */
  }
`;
STabPanel.tabsRole = 'TabPanel';

export const Box = styled.div`
  float: left;
  width: 50%;
  display: grid;
  place-items: center;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
  h6 {
    color: red;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 0.75rem;
    justify-self: left;
    padding-left: 10px;
    font-weight: 400;
    line-height: 1.66;
    letter-spacing: 0.03333em;
    background-color: white;
  }
`;

export const SLink = styled(Link)`
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${colors.primary} !important ;
  width: 90%;
`;

export const SLinkR = styled(LinkR)`
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${colors.primary} !important ;

  text-decoration: none;
`;
