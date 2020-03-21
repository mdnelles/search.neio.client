import React, { useEffect, useState } from 'react';
import { getTtypes, addEntry } from './AddCodeBaseFunctions';
import localForage from 'localforage';

import { Msg } from './CustomWidget';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import './config';
var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes('3000')) serverPath = global.config.devPath;

const useStyles = makeStyles((theme) => ({
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120
   },
   selectEmpty: {
      marginTop: theme.spacing(2)
   }
}));

const sqlPrep = (s) => {
   s = s.replace(/'/gi, '`');
   s = s.replace(/"/gi, '\\"');
   s = s.replace(/</g, '&lt;'); //for <
   s = s.replace(/>/g, '&gt;'); //for >

   return s;
};

export const AddCodeBase = () => {
   const classes = useStyles();
   const [thetoken, setThetoken] = useState('Token not Set');
   const [ttypeArr, setTtypeArr] = useState([]);
   const [ttype, setTtype] = useState('');
   const [title, setTitle] = useState('');
   const [intro, setIntro] = useState('');
   const [code, setCode] = useState('');
   const [gridClass, setGridClass] = useState('displayBlock');
   const [msgClass, setMsgClass] = useState('displayNone');
   const [spinnerClass, setSpinnerClass] = useState('displayNone');
   const [msg, setMsg] = useState('');
   const [alertColor, setAlertColor] = useState('info');
   const [file, setFile] = useState();
   const [fileName, setFileName] = useState('');
   const [fileSize, setFileSize] = useState('');
   const [uploadRunning, setUploadRunning] = useState(0);
   const [uploadTotal, setUploadTotal] = useState(0);
   const [percentComplete, setPercentComplete] = useState(0);
   const [viewProgress, setViewProgress] = useState('displayNone');
   const [keywords, setKeywords] = useState([]);

   const lgBg = {
      backgroundColor: '#777777',
      borderRadius: 3,
      padding: 10
   };
   const selectChange = (event) => {
      console.log(event.target.value);
      setTtype(event.target.value);
   };

   const doChecked = (event, thisKeyword) => {
      let kw = [];

      if (event.target.checked === true) {
         kw = keywords;
         let temp = [];
         temp.push(thisKeyword.toString());
         Array.prototype.push.apply(kw, temp);
         setKeywords(kw);
      } else {
         //setKeywords(. keywords.filter(keyword => !keyword.includes(thisKeyword)));
         keywords.forEach((e) => {
            if (e !== thisKeyword) kw.push(e);
         });
         setKeywords(kw);
      }
   };

   const startUploadFile = () => {
      setMsg(`Uploading Media ...`);
      setViewProgress('displayBlock');

      console.log('serverPath = ' + serverPath);

      var formData = new FormData();
      var xhr = new XMLHttpRequest();

      formData.append('files', file); // this is a state object set onChange
      formData.append('token', thetoken);
      formData.append('caller', 'Mediajs.startUploadFile');
      xhr.open('post', serverPath + '/search/uploadfile', true);

      xhr.addEventListener('error', errorHandler, false);
      xhr.upload.addEventListener('progress', uploadProgressHandler, false);
      xhr.addEventListener('load', loadHandler, false);
      xhr.addEventListener('abort', abortHandler, false);

      xhr.send(formData);
   };

   const errorHandler = (event) => {
      setAlertColor('danger');
      setMsg('Error uploading file please contact the administrator');
   };

   const abortHandler = (event) => {
      setAlertColor('danger');
      setMsg('File Upload Aborted');
   };

   const uploadProgressHandler = (event) => {
      setAlertColor('info');
      setUploadRunning(event.loaded);
      setUploadTotal(event.total);
      var percent = (event.loaded / event.total) * 100;
      var progress = Math.round(percent);
      setPercentComplete(progress);
   };

   //  this controls when the file upload is complete and next instructions
   const loadHandler = (event) => {
      var resMsg = event.target.responseText;
      if (resMsg !== undefined && resMsg.toString().includes('rror')) {
         setAlertColor('danger');
         setViewProgress('displayNone');
      } else {
         setAlertColor('success');
         setSpinnerClass('displayNone');
         setMsg('New Entry added to Database');
         setTimeout(() => {
            setViewProgress('displayNone');
            setMsgClass('displayNone');
         }, 3000);
      }

      setMsg(resMsg);
   };

   const addEntryStart = (e) => {
      e.preventDefault();
      setGridClass('displayNone');
      setMsgClass('displayBlock');
      setSpinnerClass('displayBlock');
      setMsg('Adding entry to database...');

      setTtype(sqlPrep(ttype));
      setTitle(sqlPrep(title));
      setIntro(sqlPrep(intro));
      setCode(sqlPrep(code));
      if (keywords.length > 0)
         var kw = JSON.stringify(keywords)
            .replace('[', '')
            .replace(']', '')
            .replace(/"/g, '');
      addEntry(
         thetoken,
         ttype,
         title,
         intro,
         code,
         kw,
         fileName,
         fileSize
      ).then((res) => {
         startUploadFile();
      });
   };
   const onChangeHandler = (event) => {
      if (event.target.files[0] !== undefined) {
         var mime = event.target.files[0].type;
         if (event.target.files[0].size > 11000000) {
            setAlertColor('danger');
            setMsg('This file size is too big (10MB max)');
            setMsgClass('displayBlock');
         } else if (mime === undefined || !mime.includes('image')) {
            setAlertColor('danger');
            setMsg('Wrong filetype: must be Image');
            setMsgClass('displayBlock');
         } else {
            setAlertColor('success');
            setFile(event.target.files[0]);
            setFileName(event.target.files[0].name); // doing singe file at a time for AWS
            setFileSize(event.target.files[0].size);
            setMsgClass('displayBlock');
            setMsg('File size is accpeted - ' + event.target.files[0].name);
            console.log(event.target.files[0]);
         }
      }
   };
   // on page load / componentDidMount
   useEffect(() => {
      if (thetoken === 'Token not Set') {
         // putting this in to mitigate infinite loop
         localForage.getItem('token', function(err, startToken) {
            setThetoken(startToken);
            getTtypes(startToken).then((res) => {
               setTtypeArr(res);
            });
         });
      } else {
         if (ttypeArr.length < 2) {
            getTtypes(thetoken).then((res) => {
               setTtypeArr(res);
            });
         }
      }
   }, [thetoken, ttypeArr]);

   return (
      <div id='main' className='body'>
         <h3>Add to CodeBase</h3> <br />
         <Msg
            msgClass={msgClass}
            spinnerClass={spinnerClass}
            msg={msg}
            alertColor={alertColor}
         />
         <div className={gridClass}>
            <Grid container spacing={1}>
               <Grid item xs={12}>
                  <div style={lgBg}>
                     <FormControl className={classes.formControl}>
                        <InputLabel id='ttype-label'>Primary Type</InputLabel>
                        <Select
                           labelId='Type'
                           id='ttype'
                           autoWidth={true}
                           value={ttype}
                           onChange={(event) => {
                              selectChange(event);
                           }}
                        >
                           <MenuItem value={0}>Select Type</MenuItem>
                           {ttypeArr.map((atype) => (
                              <MenuItem value={atype.ttype} key={atype.id}>
                                 {atype.ttype}
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </div>
               </Grid>

               <Grid item xs={12}>
                  <div style={lgBg}>
                     <TextField
                        id='title'
                        label='Title'
                        multiline
                        defaultValue={title}
                        rows='1'
                        fullWidth={true}
                        onChange={(event) => {
                           setTitle(event.target.value);
                        }}
                     />
                  </div>
               </Grid>

               <Grid item xs={12}>
                  <div style={lgBg}>
                     <TextField
                        id='intro'
                        label='Intro'
                        multiline
                        defaultValue={intro}
                        rows='3'
                        fullWidth={true}
                        onChange={(event) => {
                           setIntro(event.target.value);
                        }}
                     />
                  </div>
               </Grid>

               <Grid item xs={12}>
                  <div style={lgBg}>
                     {ttypeArr.map((atype) => (
                        <FormControlLabel
                           key={'c-' + atype.id}
                           control={
                              <Checkbox
                                 onChange={(event) =>
                                    doChecked(event, atype.ttype)
                                 }
                                 id={atype.ttype}
                                 color='primary'
                              />
                           }
                           label={atype.ttype}
                        />
                     ))}
                  </div>
               </Grid>

               <Grid item xs={12}>
                  <div style={lgBg}>
                     <TextField
                        id='code'
                        label='Code'
                        multiline
                        rows='20'
                        defaultValue={code}
                        fullWidth={true}
                        onChange={(event) => {
                           setCode(event.target.value);
                        }}
                     />
                  </div>
               </Grid>

               <Grid item xs={12}>
                  <form encType='multipart/form-data' method='post'>
                     <Button variant='contained' component='label'>
                        Upload File
                        <input
                           type='file'
                           style={{ display: 'none' }}
                           onChange={onChangeHandler}
                        />
                     </Button>
                  </form>
                  <div className={viewProgress}>
                     <div className='text-center'>
                        {uploadRunning} of {uploadTotal} - ({percentComplete}%)
                     </div>
                     <LinearProgress
                        variant='determinate'
                        value={percentComplete}
                     />
                  </div>
               </Grid>

               <Grid item xs={12}>
                  <div style={{ padding: 5, justify: 'center' }}>
                     <ButtonGroup
                        variant='contained'
                        color='secondary'
                        aria-label='contained primary button group'
                     >
                        <Button onClick={(event) => addEntryStart(event)}>
                           Save to CodeBase
                        </Button>
                     </ButtonGroup>
                  </div>
               </Grid>
            </Grid>
         </div>
      </div>
   );
};
