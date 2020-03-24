import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { data } from './data'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';



function Children () {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(0)

  const handleClickOpen = () => setOpen(true);
  const handleClose = value => {
    setOpen(false)
    setSelectedValue(value)
  }
  return (
    <div>
       <Grid container direction='column' spacing={2}>
        {data.map(({name, tokens}) => (
          <Grid item>
           <Card>
             <CardHeader title={name} subheader={`${tokens.reduce((sum, curr) => sum + curr)} mins total`} avatar={
               <Avatar >{name[0]}</Avatar>
             } />
             <CardContent>
               <Grid>
                {
                  tokens.map(token => (
                    <Button>{token}</Button>
                  ))
                }
                  <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Token
                  </Button>
               </Grid>

             </CardContent>

          </Card>
          </Grid>
        ))}
      </Grid>
      <AddTokenDialog selectedValue={selectedValue}  open={open} onClose={handleClose}/>

    </div>
  )
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


function AddTokenDialog({onClose, selectedValue, open}) {
  const handleClose = () => onClose(selectedValue)
  const handleTokenItemClick = value => onClose(value)
  const tokens = [5, 10, 15, 20, 25, 30, 60]

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="simple-dialog-title">Add Token</DialogTitle>
      <List>
        {tokens.map(token => (
          <>
          <ListItem button onClick={() => handleTokenItemClick(token)} key={token}>
            <ListItemAvatar>
              <Avatar>
                {token}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${token} minutes`} />
          </ListItem>
          <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
  </Dialog>
  )
} 
export default App;
