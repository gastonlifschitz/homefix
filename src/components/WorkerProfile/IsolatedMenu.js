import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportIcon from '@mui/icons-material/Report';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React from 'react';

const IsolatedMenu = ({ _id, reportReview }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="large"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        elevation={0}
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={reportReview}>
          <ListItemIcon>
            <ReportIcon fontSize="small" color="action" />
          </ListItemIcon>
          <Typography variant="inherit">Reportar Reseña</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default IsolatedMenu;
