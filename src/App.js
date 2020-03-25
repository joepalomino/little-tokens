import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { deepPurple, blue, pink } from "@material-ui/core/colors";
import { db } from "./firebase";

const useStyles = makeStyles(theme => ({
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500]
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500]
  },
  blue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500]
  }
}));

function Children() {
  const [children, setChildren] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const [tokenIdx, setTokenIdx] = useState(0);

  useEffect(() => {
    const unsubscribe = db.collection("children").onSnapshot(
      querySnapshot => {
        let data = [];
        querySnapshot.forEach(doc => {
          data = [...data, { id: doc.id, ...doc.data() }];
        });
        setChildren(data);
      },
      err => {
        console.log(err);
      }
    );
    return () => unsubscribe();
  }, []);

  const classes = useStyles();
  const colors = ["blue", "pink", "purple"];

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);

  const [openUseAlert, setOpenUseAlert] = useState(false);

  const handleClickOpen = id => {
    setOpen(true);
    setUserSelected(id);
  };
  const handleClose = value => {

    setOpen(false);

    const tokens = children.filter(child => child.id === userSelected)[0].tokens;
    console.log(tokens);
    
    db.collection("children")
      .doc(userSelected)
      .update({
        tokens: [...tokens, value]
      });
  };

  const handleCloseUseAlert = () => setOpenUseAlert(false);
  const handleOpenUseAlert = (tokenIdx, id) => {
    setOpenUseAlert(true)
    setTokenIdx(tokenIdx)
    setUserSelected(id)
  };

  const handleUseTokenConfirm = () => {
    setOpenUseAlert(false)
    let tokens = children.filter(child => child.id === userSelected)[0].tokens;
    tokens.splice(tokenIdx, 1)
    db.collection("children")
      .doc(userSelected)
      .update({
        tokens: [...tokens]
      });
  }

  return (
    <div>
      <Grid container direction="column" spacing={4}>
        {children.map(({ name, tokens, id }, idx) => (
          <Grid item key={id}>
            <Card>
              <CardHeader
                title={name}
                subheader={`${tokens.reduce(
                  (sum, curr) => sum + curr, 0
                )} mins total`}
                avatar={
                  <Avatar className={classes[colors[idx]]}>{name[0]}</Avatar>
                }
              />
              <CardContent>
                <Grid>
                  {tokens.map((token, idx) => (
                    <Button key={idx} onClick={() => handleOpenUseAlert(idx, id)}>
                      {token}
                    </Button>
                  ))}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpen(id)}
                  >
                    Add Token
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AddTokenDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
      <UseTokenDialog open={openUseAlert} onClose={handleCloseUseAlert} confirmClose={handleUseTokenConfirm}/>
    </div>
  );
}
function App() {
  return (
    <Container maxWidth="sm">
      <div>
        <h1>Little Tokens</h1>
        <Children />
      </div>
    </Container>
  );
}

function AddTokenDialog({ onClose, selectedValue, open }) {
  const handleClose = () => onClose(selectedValue);
  const handleTokenClick = value => onClose(value);
  const tokens = [5, 10, 15, 20, 25, 30, 60];

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Add Token</DialogTitle>
      <List>
        {tokens.map(token => (
            <ListItem
              button
              onClick={() => handleTokenClick(token)}
              key={token}
            >
              <ListItemAvatar>
                <Avatar>{token}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${token} minutes`} />
            </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

function UseTokenDialog({ onClose, open, confirmClose }) {
  const handleClose = () => onClose();
  const handleConfirm = () => confirmClose();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to use this token?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
          Yes I want to have fun!
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Nope, I'll save it for later!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default App;
