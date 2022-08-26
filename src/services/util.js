import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Box, Container, Icon } from '@mui/material';
import { useLoadScript } from '@react-google-maps/api';
import moment from 'moment';
import 'moment/locale/es';
import React, { useState } from 'react';
import mercadoPagoLogo from '../assets/mercadoPagoLogo.png';
import { getCurrentUser } from './authService';
import { baseURL } from '../env.json';

moment.locale('es');

const rubroTranslator = Object.freeze({
  CARPINTER: 'Carpintero',
  PLUMER: 'Plomero',
  GARDINER: 'Jardinero',
  BRICKLAYER: 'Albañil',
  ELECTRICIAN: 'Electricista',
  CLEANING: 'Limpieza',
  GAS: 'Gasista',
  BABYSITTER: 'Babysitter',
  LOCKSMITH: 'Cerrajero',
  MESSAGES: 'Mensajeria',
  OTHER: 'Otros',
  PAINTOR: 'Pintor',
  TEACHER: 'Profesores',
  TAXI: 'Remis'
});

const getEmployeeId = () => {
  const currentUser = getCurrentUser();

  return currentUser ? currentUser.employee : undefined;
};

const isLogged = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return {};
  return {
    admin: currentUser.admin,
    employee: currentUser.employee,
    neighbour: currentUser.neighbour
  };
};

const useToggleNavBar = (currState) => {
  const [isOpen, setIsOpen] = useState(currState);
  const [anchor, setAnchor] = useState(null);
  return {
    isOpen,
    anchor,
    toggle: (anchor) => {
      setAnchor(anchor);
      setIsOpen(!isOpen);
    }
  };
};

const formatDate = (date) => {
  if (!date || !new Date(date)) return '';

  return moment(date).format('LL');
};

export default function LoadGoogleMapAPI(libraries) {
  const rta1 = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  return rta1;
}

function getRandomGen() {
  const alphabet =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const short = require('short-uuid')(alphabet);

  return short.new().slice(0, 8);
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ flex: 1 }}
    >
      {value === index && (
        <Container>
          <Box id="tabPanelBox" style={{ paddingTop: '0px' }}>
            {children}
          </Box>
        </Container>
      )}
    </div>
  );
}

export const MercadoPagoLogo = () => (
  <Icon>
    <img src={mercadoPagoLogo} height={25} width={25} alt="mercado" />
  </Icon>
);

const paymentMethodsIcons = {
  Efectivo: <AttachMoneyIcon />,
  Tarjeta: <CreditCardIcon />,
  'Mercado Pago': <MercadoPagoLogo />,
  Otros: <MoreHorizOutlinedIcon />
};

function getProfilePic(userId){
  return baseURL + '/api/users/profilePic/' + userId
}

export {
  rubroTranslator,
  getEmployeeId,
  isLogged,
  useToggleNavBar,
  TabPanel,
  paymentMethodsIcons,
  formatDate,
  getRandomGen,
  getProfilePic
};
