import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React from 'react';
const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
});

export default function SideBar({
  anchor = 'left',
  open,
  sideBar,
  handleTabChange,
  tabSelected
}) {
  const classes = useStyles();
  const [state, setState] = React.useState({ left: false });

  React.useEffect(() => {
    setState({ ...state, left: open });
  }, [anchor, open]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ left: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom'
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {sideBar}
    </div>
  );

  return (
    <div>
      <SwipeableDrawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
      >
        {list(anchor)}
      </SwipeableDrawer>
    </div>
  );
}
