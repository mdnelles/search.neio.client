import React from 'react';
import { useHistory } from 'react-router-dom';
import { getTitles } from './SearchFunctions';
import localForage from 'localforage';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { logout } from './UserFunctions';

export const Navbar = () => {
   const [anchorEl, setAnchorEl] = React.useState(null);
   const [afDone, setAfDone] = React.useState(false);
   const [searchTitles, setSearchTitle] = React.useState([]);
   const [query, setQuery] = React.useState('');
   const history = useHistory();
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = (e) => {
      window.top.location = '/' + e.target.id;
      setAnchorEl(null);
   };

   const handleDB = () => {
      setAnchorEl(null);
      window.open('https://lakes.world/mdb/dba/', '_blank').focus();
   };

   React.useEffect(() => {
      //localForage.getItem('token', function(err, theToken) {
      if (afDone === false) {
         localForage.getItem('token').then(function(theToken) {
            if (searchTitles.length < 2) {
               getTitles(theToken).then((data) => {
                  setSearchTitle(data);
                  setAfDone(true);
               });
            }
         });
      }
   }, [afDone, searchTitles.length]);

   /////////////////////////////////////// material ui theming

   const useStyles = makeStyles((theme) => ({
      root: {
         display: 'flex',
         flexWrap: 'wrap'
      },
      margin: {
         margin: theme.spacing(1)
      }
   }));

   const classes = useStyles();

   /////////////////////////////////////// end material ui theming

   const addSelected = (event) => {
      setTimeout(() => {
         var temp = document.getElementById('autocomplete').value;
         console.log(temp);
         setQuery(encodeURI(temp));
      }, 300); // need slight delay so DOM can update
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         console.log('moving to search with query:  /search/' + query);
         history.push({
            pathname: '/search/' + query + '/'
         });
      }
   };

   return (
      <div className='navAppBar'>
         <Grid container spacing={3}>
            <Grid item xs={1} sm={1}>
               <div>
                  <Button
                     aria-controls='simple-menu'
                     aria-haspopup='true'
                     onClick={handleClick}
                  >
                     <MenuIcon style={{ fill: 'white' }} fontSize='large' />
                  </Button>
                  <Menu
                     id='simple-menu'
                     anchorEl={anchorEl}
                     keepMounted
                     open={Boolean(anchorEl)}
                     onClose={handleClose}
                  >
                     <MenuItem onClick={handleClose} id='add'>
                        Add Code
                     </MenuItem>
                     <MenuItem onClick={handleClose} id='search'>
                        Search Code
                     </MenuItem>
                     <MenuItem onClick={handleClose} id='users'>
                        Users
                     </MenuItem>
                     <MenuItem onClick={handleClose} id='logs'>
                        View Logs
                     </MenuItem>
                     <MenuItem onClick={handleClose} id='categories'>
                        Manage Categories
                     </MenuItem>
                     <MenuItem onClick={handleDB} id='pma'>
                        PhpMyAdmin
                     </MenuItem>
                     <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
               </div>
            </Grid>

            <Grid item xs={12} sm={9}>
               <form className={classes.root} noValidate>
                  <Autocomplete
                     id='autocomplete'
                     size='small'
                     autoFocus={true}
                     options={searchTitles}
                     onChange={(event) => addSelected(event)}
                     getOptionLabel={(option) => option.title}
                     style={{
                        width: 600,
                        color: 'white',
                        marginTop: -20
                     }}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label='Search Codebase'
                           id='queryField'
                           margin='normal'
                           onChange={(event) =>
                              setQuery(encodeURI(event.target.value))
                           }
                           onKeyDown={handleKeyDown}
                        />
                     )}
                  />
               </form>
            </Grid>

            <Grid item xs={4} sm={2}>
               <AddCircleOutlineIcon
                  className='pointer'
                  style={{ fill: 'white', marginTop: 10 }}
                  onClick={() => (window.location.href = '/add')}
                  fontSize='large'
               />
               <AccountCircleIcon
                  className='pointer'
                  style={{ fill: 'white', marginTop: 10 }}
                  onClick={logout}
                  fontSize='large'
               />
            </Grid>
         </Grid>
      </div>
   );
};
