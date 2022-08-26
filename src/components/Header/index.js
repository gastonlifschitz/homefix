import React from 'react';
import { isLogged, useToggleNavBar } from '../../services/util';
import Navbar from '../NavBar';
import SideBar from '../SideBar';

const Header = (props) => {
  const { isOpen, toggle } = useToggleNavBar(false);
  const loggedRoles = isLogged();
  return (
    <div>
      <SideBar
        {...props}
        open={isOpen}
        loggedEmployee={loggedRoles.employee}
        loggedNeighbour={loggedRoles.neighbour}
        loggedAdmin={loggedRoles.admin}
        sideBar={props.sideBar}
        handleTabChange={props.handleTabChange}
        tabSelected={props.tabSelected}
      />
      <Navbar
        {...props}
        toggle={toggle}
        loggedEmployee={loggedRoles.employee}
        loggedNeighbour={loggedRoles.neighbour}
        loggedAdmin={loggedRoles.admin}
        showMenuIcon={props.showMenuIcon}
        selectNeighborhood={props.selectNeighborhood}
      />
    </div>
  );
};

export default Header;
