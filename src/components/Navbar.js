import React, { Fragment, useState} from "react";
import { useHistory } from 'react-router-dom';
import { getTitles } from './SearchFunctions';
import localForage from 'localforage'

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
//import InputBase from '@material-ui/core/InputBase';
//import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import { logout } from "./UserFunctions"

export const Navbar = () => {

  const [ anchorEl, setAnchorEl ] = React.useState(null);
  const [ token, setToken] = React.useState('no token');
  const [ afDone, setAfDone] = React.useState(false);
  const [ searchTitles, setSearchTitle ] = React.useState([]);
  const [ searchREST, setSearchREST ] = React.useState('')
  const [ query, setQuery ] = React.useState('');
  const history = useHistory();
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const popAuto = () => {
    console.log('popAuto');
  }

  const handleClose = e => {
    window.top.location = '/' + e.target.id;
    setAnchorEl(null);
  };

  React.useEffect (() => {
    //localForage.getItem('token', function(err, theToken) {
      if(afDone === false){

        localForage.getItem('token').then(function(theToken) {
          setToken(theToken);
          if(searchTitles.length < 2){
              getTitles(theToken).then( data => {
                setSearchTitle(data);
                setAfDone(true);
              })
          }
        })
      }
  },[])

  /////////////////////////////////////// material ui theming
  const autoCompVar = "Example1, Example2"

  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  const CssTextField = withStyles({
    root: {
      '& label': {
        color:'#639fff'
      },
      '& borderBottomColor': '#639fff',
      '& label.Mui-focused': {
        color: 'white'
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
    },
  })(TextField);
  /////////////////////////////////////// end material ui theming



  const addSelected = event =>{

    setTimeout(() => {
      var temp = document.getElementById('autocomplete').value;
      console.log(temp);
      setQuery(encodeURI(temp));
    }, 300); // need slight delay so DOM can update
  }

  const handleKeyDown = e  => {
    if (e.key === 'Enter') {
      console.log('moving to search with query:  /search/' + query);
      history.push({
        pathname: '/search/' +query + '/'
      })
    }
  }

 
  return (
    <div className="navAppBar">

      <Grid container spacing={3}>

        <Grid item xs={1} sm={1}>
          <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <MenuIcon style={{fill: "white"}} fontSize="large"  />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} id="add">Add Code</MenuItem>
              <MenuItem onClick={handleClose} id="search">Search Code</MenuItem>
              <MenuItem onClick={handleClose} id="users">Users</MenuItem>
              <MenuItem onClick={handleClose} id="pma">PhpMyAdmin</MenuItem>
              <MenuItem onClick={logout} >Logout</MenuItem>
            </Menu>
          </div>
        </Grid>

        <Grid item xs={12} sm={10}>
                
          <form className={classes.root} noValidate>
          <Autocomplete
              id="autocomplete"
              size="small"
              autoFocus={true}
              options={searchTitles}
              onChange={ event => addSelected(event)}
              getOptionLabel={option => option.title}
              style={{ 
                width:600,
                color: "white",
                marginTop:-20
              }}
              renderInput={params => <TextField {...params} 
                                        label="Search Codebase"  
                                        id="queryField"
                                        margin="normal"
                                        onChange={ event => setQuery(encodeURI(event.target.value))}
                                        onKeyDown={handleKeyDown}
                                      />}
          />

          </form>                

        </Grid>

        <Grid item xs={1} sm={1}>
        
          <AddCircleOutlineIcon className="pointer" 
                            style={{fill: "white", marginTop:10}} 
                            onClick={ ()=> window.location.href='/add'} 
                            fontSize="large"
                            />
          <AccountCircleIcon className="pointer" 
                            style={{fill: "white", marginTop:10}} 
                            onClick={logout} 
                            fontSize="large"
                            />
        </Grid>

      </Grid>



    </div>
  );
}



