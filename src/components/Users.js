import React, { useState, useEffect }  from 'react'
import { getUsers, removeUser, addUser } from './UserFunctions'
import localForage from 'localforage'
import uuid from 'uuid';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const rowStyle = {
  padding:10,
  display:'block'
}

const Userow = props => {
    return (
      <div style={rowStyle}>
        <Grid container spacing={3} className={"rowdata " + props.bgc}>
          <Grid item xs={6} sm={3}>
            {props.uuid}
          </Grid>
          <Grid item xs={6} sm={3}>
            {props.email}
          </Grid>
          <Grid item xs={6} sm={3}>
            {props.first_name}, 
            {props.last_name}
          </Grid>
          <Grid item xs={6} sm={3}>
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
              <Button onClick={ () => props.editUserStart(props.uuid)} >Edit</Button>
              <Button onClick={ () => props.removeUserStart(props.uuid)}>Delete</Button>
            </ButtonGroup>
          </Grid>
      </Grid> 
    </div>         
    )
}

const Allusers = props => {

    var tog = false, bgc;

    if(props.users !== undefined && Array.isArray(props.users)){
      props.users.forEach( (e,i) => {
        tog === false ? bgc = 'darkbg' : bgc = 'graybg'
        tog =! tog; 
        props.users[i].bgc = bgc;
      })
    }

    return (
      <div>
      { 
        props.users.map(user => <Userow 
                                      editUserStart={props.editUserStart}
                                      removeUserStart={props.removeUserStart}
                                      key={user.uuid} 
                                      uuid={user.uuid} 
                                      id={user.id}
                                      bgc={user.bgc}
                                      email={user.email} 
                                      first_name={user.first_name} 
                                      last_name={user.last_name}
                                      vis={user.email === 'test@test.com' ? 'displayNone' : 'displayBlock' }
                                      /> )
      }
      </div>
    )
  
}


export const Users = () => {

  const [ open, setOpen] = useState(false);
  const [ token, setToken] = useState('no token')
  const [ users, setUsers] = useState([]);
  const [ email, setEmail ] = useState(''); 
  const [ password, setPassword ] = useState(''); 
  const [ firstName, setFirstName ] = useState(''); 
  const [ lastName, setLastName ] = useState('');
  
  const editUserStart = theUuid => {
    console.log(theUuid);
  }

  const removeUserStart = theUuid => {

    if(theUuid !== undefined){
        removeUser(theUuid, token).then(res => {
          setUsers(users.filter( user => user.uuid !== theUuid ));
        }).catch(err => {
          console.log('Err: could not remove user ' + err)
        })
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addUserStart = data => {
    var id = uuid();
    var newUser = {
      uuid:id,
      first_name:firstName,
      last_name:lastName,
      email:email,
      password:password
    }
    setOpen(false);
    addUser(newUser,token).then( res => {
      console.log(res)
      //setAllVals([...allVals,newData]);
      setUsers([...users,newUser]);
      setEmail(''); // clear values
      setPassword('');
      setFirstName('');
      setLastName('');
    })
  }

  useEffect (() => {
    //localForage.getItem('token', function(err, theToken) {
    localForage.getItem('token').then(function(theToken) {
      setToken(theToken);
      getUsers(theToken).then( data => {
        setUsers(data)
        console.log(data)
      })
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
        alert('no token found');
        window.location.href = '/';
    });
  },[])

    return (
      <div id="main" className="body">

        <h3>Users</h3> <br />

        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add New User
        </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add New User
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            defaultValue={email}
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            onChange={ event=>setEmail(event.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="password"
            type="password"
            defaultValue={password}
            fullWidth
            onChange={ event => setPassword(event.target.value) } 
          />
          <TextField
            margin="dense"
            id="firstName"
            label="First Name"
            type="text"
            defaultValue={firstName}
            fullWidth
            onChange={ event => setFirstName(event.target.value)}
          />
          <TextField
            margin="dense"
            id="lastName"
            label="Last Name"
            defaultValue={lastName}
            type="text"
            fullWidth
            onChange={event => setLastName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={addUserStart} color="primary" variant="contained">
            Save New User
          </Button>
        </DialogActions>
      </Dialog>
      <br /><br />
        <Allusers users={users}
                  editUserStart={editUserStart}
                  removeUserStart={removeUserStart}
        />

      </div>
    )

}
