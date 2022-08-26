import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavBtn } from '../Buttons/buttonsStyle';
import { SLinkR } from '../SignIn/SignInStyle';
import { IconButton, Nav, NavbarContainer, NavLogo } from './NavBarStyle';
import SearchBar from './SearchBar';

const Navbar = ({
  toggle,
  showSearchBar,
  searchText,
  onChangeSearch,
  loggedEmployee,
  loggedNeighbour,
  loggedAdmin,
  width,
  showMenuIcon,
  selectNeighborhood
}) => {
  const location = useLocation();
  function changeLocation(placeToGo) {
    if (location.pathname === '/' && placeToGo === '/')
      window.location.reload();
  }

  const logoText = isWidthUp('md', width)
    ? 'Home Fix'
    : showSearchBar
    ? 'HF'
    : 'Home Fix';
  const showLoggedRoles = () => {
    if (loggedEmployee) {
      return (
        <>
          <NavBtn
            style={
              showSearchBar
                ? {
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'space-around',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }
                : {}
            }
          >
            <SLinkR
              to={`/profile/${loggedEmployee}`}
              style={{ marginBottom: '0px' }}
            >
              Mi perfil
            </SLinkR>
          </NavBtn>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            component={Link}
            to={`/profile/${loggedEmployee}`}
          >
            <AccountCircleIcon />
          </IconButton>
        </>
      );
    }
    if (loggedNeighbour || loggedAdmin) {
      return (
        <>
          {selectNeighborhood}

          <NavBtn>
            <SLinkR to={`/myProfile`} style={{ marginBottom: '0px' }}>
              Mi perfil
            </SLinkR>
          </NavBtn>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            component={Link}
            to="/myProfile"
          >
            <AccountCircleIcon />
          </IconButton>
        </>
      );
    }
    if (!loggedEmployee && !loggedNeighbour && !loggedAdmin) {
      return (
        <>
          <NavBtn id="navBtn">
            <SLinkR to="/login">Iniciar sesión / Registrarse</SLinkR>
          </NavBtn>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            component={Link}
            to="/login"
          >
            <AccountCircleIcon />
          </IconButton>
          
        </>
      );
    }
  };
  return (
    <>
      <Nav id="navBar">
        <NavbarContainer>
          
          {showMenuIcon ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="Menu"
              onClick={() => toggle('left')}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <NavLogo to="/" onClick={() => changeLocation('/')}>
            {logoText}
          </NavLogo>
          {showSearchBar ? (
            <SearchBar
              searchText={searchText}
              onChangeSearch={onChangeSearch}
            />
          ) : null}
          {showLoggedRoles()}
        </NavbarContainer>
      </Nav>
    </>
  );
};

export default withWidth()(Navbar);
