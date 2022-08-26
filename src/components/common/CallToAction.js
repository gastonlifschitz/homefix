import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from '@mui/material';

const useStyles = makeStyles({
  root: {
    width: '80%',
    margin: '0 auto',
    textAlign: 'center'
  }
});

export default function CallToAction({ children, handleAction }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {children}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={handleAction}
          variant="outlined"
          color="primary"
          style={{ margin: '0 auto' }}
          size="small"
        >
          OK
        </Button>
      </CardActions>
    </Card>
  );
}
