import Button from '@mui/material/Button';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapForm: {
      display: 'flex',
      justifyContent: 'center',
      width: '95%',
      margin: `${theme.spacing(0)} auto`
    },
    wrapText: {
      width: '100%'
    },
    button: {
      //margin: theme.spacing(1),
    }
  })
);

function TextInput(props) {
  const classes = useStyles();
  return (
    <>
      <form className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Escriba su mensaje"
          className={classes.wrapText}
          //margin="normal"
          value={props.message}
          onChange={(e) => props.handleSearchChange(e)}
        />
        <Button
          autoFocus
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={(e) => props.submitMessage(e)}
        >
          <SendIcon />
        </Button>
      </form>
    </>
  );
}

export default TextInput;
