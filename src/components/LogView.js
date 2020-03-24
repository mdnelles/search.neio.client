import React, { useState, useEffect } from 'react';
import { getLogs, getLogsCount } from './LogFunctions';
import localForage from 'localforage';

import { Msg } from './CustomWidget';

import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
//import Button from '@material-ui/core/Button';
//import ButtonGroup from '@material-ui/core/ButtonGroup';

const rowStyle = {
   padding: 10,
   display: 'block'
};
const Space = () => {
   return <span> &nbsp; </span>;
};
const RedErrorIcon = () => {
   return <ErrorIcon style={{ fill: 'red' }} />;
};
const GreenCheckIcon = () => {
   return <CheckCircleIcon style={{ fill: 'green' }} />;
};

const Logow = (props) => {
   return (
      <div style={rowStyle}>
         <Grid container spacing={0} className={'rowdata ' + props.bgc}>
            <Grid item xs={4} sm={2}>
               <span className='gridItem'>
                  {props.code === '200' ? <GreenCheckIcon /> : <RedErrorIcon />}{' '}
                  <Space />
                  {props.filename}
               </span>
            </Grid>
            <Grid item xs={4} sm={2}>
               <span className='gridItem'>{props.fnction}</span>
            </Grid>
            <Grid item xs={4} sm={2}>
               <span className='gridItem'>{props.msg_programmer}</span>
            </Grid>
            <Grid item xs={8} sm={4}>
               <span className='gridItem'>{props.msg_app}</span>,
               <span className='gridItem'>{props.refer}</span>
            </Grid>
            <Grid item xs={4} sm={2}>
               <span className='gridItem'>{props.tdate}</span>
            </Grid>
         </Grid>
      </div>
   );
};

const Alllogs = (props) => {
   var tog = false,
      bgc;

   if (props.logs !== undefined && Array.isArray(props.logs)) {
      props.logs.forEach((e, i) => {
         tog === false ? (bgc = 'darkbg') : (bgc = 'graybg');
         tog = !tog;
         props.logs[i].bgc = bgc;
      });
   }

   return (
      <div>
         {props.logs.map((log) => (
            <Logow
               key={log.id}
               id={log.id}
               bgc={log.bgc}
               filename={log.filename}
               fnction={log.fnction}
               msg_programmer={log.msg_programmer}
               msg_app={log.msg}
               code={log.code}
               ip={log.ip}
               refer={log.refer}
               tdate={log.tdate}
            />
         ))}
      </div>
   );
};

export const LogView = () => {
   //const [token, setToken] = useState('no token');
   const [logs, setLogs] = useState([]);
   const [code, setCode] = useState(500);
   const [perPage, setPerPage] = useState(20);
   const [thetoken, setThetoken] = useState('NA');
   const [msgClass, setMsgClass] = useState('displayBlock');
   const [spinnerClass, setSpinnerClass] = useState('displayBlock');
   const [msg, setMsg] = useState('');
   const [alertColor, setAlertColor] = useState('info');
   const [logsCount, setLogsCount] = useState(0);

   const perPageHandler = (e) => {
      setAlertColor('info');
      setMsgClass('displayBlock');
      setSpinnerClass('displayBlock');
      setMsg('Getting logs from Database');
      setPerPage(e.target.value);
      getLogsCount(thetoken, code).then((data1) => {
         console.log(data1);
         //setLogsCount(data1);
         getLogs(thetoken, code, e.target.value).then((data) => {
            setLogs(data);
            setAlertColor('success');
            setSpinnerClass('displayNone');
            setMsg('Logs Loaded.  Please continue.');
         });
      });
   };
   const typeChange = (e) => {
      setAlertColor('info');
      setMsgClass('displayBlock');
      setSpinnerClass('displayBlock');
      setMsg('Getting logs from Database');
      setCode(e.target.value);
      getLogsCount(thetoken, code).then((data1) => {
         console.log(data1);
         //setLogsCount(data1);
         getLogs(thetoken, code, e.target.value).then((data) => {
            setLogs(data);
            setAlertColor('success');
            setSpinnerClass('displayNone');
            setMsg('Logs Loaded.  Please continue.');
         });
      });
   };

   useEffect(() => {
      if (thetoken === 'NA') {
         setMsgClass('displayBlock');
         setAlertColor('info');
         setSpinnerClass('displayBlock');
         setMsg('Getting logs from Database');
         localForage
            .getItem('token')
            .then(function(startToken) {
               setThetoken(startToken);
               getLogsCount(startToken, code).then((data1) => {
                  //setLogsCount(data1);
                  console.log(data1);
                  getLogs(startToken, code, perPage).then((data) => {
                     setLogs(data);
                     setAlertColor('success');
                     setSpinnerClass('displayNone');
                     setMsg('Logs Loaded.  Please continue.');
                  });
               });
            })
            .catch(function(err) {
               // This code runs if there were any errors
               console.log(err);
               alert('no token found');
               window.location.href = '/';
            });
      }
   }, [perPage, code, thetoken]);

   return (
      <div id='main' className='body'>
         <h3>Logs</h3> <br />
         <Msg
            msgClass={msgClass}
            spinnerClass={spinnerClass}
            msg={msg}
            alertColor={alertColor}
         />
         <div style={{ backgroundColor: '#999', padding: 5 }}>
            <Grid container spacing={2}>
               <Grid item xs={6} sm={2}>
                  <InputLabel id='page-label'>Per Page</InputLabel>
                  <Select
                     labelId='page-label'
                     defaultValue={20}
                     onChange={(event) => {
                        perPageHandler(event);
                     }}
                  >
                     <MenuItem value={10}>10</MenuItem>
                     <MenuItem value={20}>20</MenuItem>
                     <MenuItem value={30}>30</MenuItem>
                  </Select>
               </Grid>
               <Grid item xs={6} sm={2}>
                  <InputLabel id='type-label'>Type</InputLabel>
                  <Select
                     labelId='type-label'
                     defaultValue={500}
                     onChange={typeChange}
                  >
                     <MenuItem value={500}>500</MenuItem>
                     <MenuItem value={404}>403</MenuItem>
                     <MenuItem value={200}>200</MenuItem>
                     <MenuItem value={1}>All</MenuItem>
                  </Select>
               </Grid>
               <Grid item xs={12} sm={4}>
                  {}
               </Grid>
            </Grid>
         </div>
         <Alllogs logs={logs} />
      </div>
   );
};
