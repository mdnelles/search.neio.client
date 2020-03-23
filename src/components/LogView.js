import React, { useState, useEffect } from 'react';
import { getLogs } from './LogFunctions';
import localForage from 'localforage';

import { Msg } from './CustomWidget';

import Grid from '@material-ui/core/Grid';
//import Button from '@material-ui/core/Button';
//import ButtonGroup from '@material-ui/core/ButtonGroup';

const rowStyle = {
   padding: 10,
   display: 'block'
};

const Logow = (props) => {
   return (
      <div style={rowStyle}>
         <Grid container spacing={3} className={'rowdata ' + props.bgc}>
            <Grid item xs={6} sm={3}>
               {props.uuid}
            </Grid>
            <Grid item xs={6} sm={3}>
               {props.email}
            </Grid>
            <Grid item xs={6} sm={3}>
               {props.first_name},{props.last_name}
            </Grid>
            <Grid item xs={6} sm={3}></Grid>
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
            <Logow key={log.id} uuid={log.uuid} id={log.id} bgc={log.bgc} />
         ))}
      </div>
   );
};

export const Logs = () => {
   const [open, setOpen] = useState(false);
   const [token, setToken] = useState('no token');
   const [logs, setLogs] = useState([]);

   useEffect(() => {
      //localForage.getItem('token', function(err, theToken) {
      localForage
         .getItem('token')
         .then(function(theToken) {
            setToken(theToken);
            getLogs(theToken).then((data) => {
               setLogs(data);
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
         <h3>Logs</h3> <br />
         <Msg
            msgClass={msgClass}
            spinnerClass={spinnerClass}
            msg={msg}
            alertColor={alertColor}
         />
         <Alllogs logs={logs} />
      </div>
   );
};
