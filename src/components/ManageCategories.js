import React, { useState, useEffect } from 'react';
import { getTtypes, addCategory, removeCategory } from './AddCodeBaseFunctions';
import localForage from 'localforage';

import { Msg } from './CustomWidget';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

const rowStyle = {
   padding: 10,
   display: 'block'
};

const Catrow = (props) => {
   return (
      <div style={rowStyle}>
         <Grid container spacing={3} className={'rowdata ' + props.bgc}>
            <Grid item xs={6} sm={3}>
               {props.id}
            </Grid>
            <Grid item xs={12} sm={6}>
               {props.category}
            </Grid>
            <Grid item xs={6} sm={3}>
               <Button
                  onClick={() => props.removeCategoryStart(props.id)}
                  variant='contained'
                  color='primary'
               >
                  Delete
               </Button>
            </Grid>
         </Grid>
      </div>
   );
};

const Allcats = (props) => {
   var tog = false,
      bgc;

   if (props.cats !== undefined && Array.isArray(props.cats)) {
      props.cats.forEach((e, i) => {
         tog === false ? (bgc = 'darkbg') : (bgc = 'graybg');
         tog = !tog;
         props.cats[i].bgc = bgc;
      });
   }

   return (
      <div>
         {props.cats.map((cat) => (
            <Catrow
               removeCategoryStart={props.removeCategoryStart}
               key={cat.id}
               id={cat.id}
               bgc={cat.bgc}
               category={cat.ttype}
            />
         ))}
      </div>
   );
};

export const ManageCategories = () => {
   const [open, setOpen] = useState(false);
   const [token, setToken] = useState('no token');
   const [cats, setCategories] = useState([]);
   const [category, setCategory] = useState('');

   const [msgClass, setMsgClass] = useState('displayNone');
   const [spinnerClass, setSpinnerClass] = useState('displayNone');
   const [msg, setMsg] = useState('');

   const removeCategoryStart = (id) => {
      if (window.confirm('Are you sure you want to delete this?')) {
         if (id !== undefined) {
            removeCategory(token, id)
               .then(() => {
                  setCategories(cats.filter((category) => category.id !== id));
               })
               .catch((err) => {
                  console.log('Err: could not remove category ' + err);
               });
         }
      } else {
         return false;
      }
   };

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const addCategoryStart = () => {
      setMsgClass('displayBlock');
      setSpinnerClass('displayBlock');
      setMsg('Adding category to database');

      setOpen(false);
      addCategory(token, category).then((res) => {
         console.log(res);
         setCategory(''); // clear values
         setSpinnerClass('displayNone');
         setMsg('New Entry added to Database');
         // doing reload here because we do not have the id and it crashes
         let loc = window.location.href;
         window.location.href = loc;
      });
   };

   useEffect(() => {
      localForage
         .getItem('token')
         .then(function(theToken) {
            setToken(theToken);
            getTtypes(theToken).then((data) => {
               setCategories(data);
               console.log(data);
            });
         })
         .catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
            alert('no token found');
            window.location.href = '/';
         });
   }, []);

   return (
      <div id='main' className='body'>
         <h3>Categorys</h3> <br />
         <Msg msgClass={msgClass} spinnerClass={spinnerClass} msg={msg} />
         <Button variant='contained' color='primary' onClick={handleClickOpen}>
            Add New Category
         </Button>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='form-dialog-title'
         >
            <DialogContent>
               <DialogContentText>Add New Category</DialogContentText>
               <TextField
                  autoFocus
                  margin='dense'
                  defaultValue={category}
                  id='category'
                  label='Category'
                  type='text'
                  fullWidth
                  onChange={(event) => setCategory(event.target.value)}
               />
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleClose}
                  color='primary'
                  variant='contained'
               >
                  Cancel
               </Button>
               <Button
                  onClick={addCategoryStart}
                  color='primary'
                  variant='contained'
               >
                  Save New Category
               </Button>
            </DialogActions>
         </Dialog>
         <br />
         <br />
         <Allcats cats={cats} removeCategoryStart={removeCategoryStart} />
      </div>
   );
};
