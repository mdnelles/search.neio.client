import React, { useState, useEffect } from 'react';
import { getLogs } from './LogFunctions';
import localForage from 'localforage';

import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
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
   let iconi = RedErrorIcon;
   if (props.code === 200) iconi = GreenCheckIcon;
   return (
      <div style={rowStyle}>
         <Grid container spacing={2} className={'rowdata ' + props.bgc}>
            <Grid item xs={4} sm={2}>
               {props.code === '200' ? <GreenCheckIcon /> : <RedErrorIcon />}{' '}
               <Space />
               {props.filename}
            </Grid>
            <Grid item xs={4} sm={2}>
               {props.fnction}
            </Grid>
            <Grid item xs={4} sm={2}>
               {props.msg_programmer}
            </Grid>
            <Grid item xs={4} sm={2}>
               {props.msg_app}
            </Grid>
            <Grid item xs={4} sm={2}>
               {props.refer}
            </Grid>
            <Grid item xs={4} sm={2}>
               {props.tdate}
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

   useEffect(() => {
      localForage
         .getItem('token')
         .then(function(theToken) {
            //setToken(theToken);
            getLogs(theToken).then((data) => {
               setLogs(data);
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
         <h3>Logs</h3> <br />
         <Alllogs logs={logs} />
      </div>
   );
};
