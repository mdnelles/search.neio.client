import React, { useState, useEffect } from 'react';
import { getLogs, getLogsCount } from './LogFunctions';
import localForage from 'localforage';

import { Msg } from './CustomWidget';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
//import Button from '@material-ui/core/Button';
//import ButtonGroup from '@material-ui/core/ButtonGroup';

const rowStyle = {
   padding: 0,
   display: 'block'
};
const Space = () => {
   return <span> &nbsp; </span>;
};
const RedErrorIcon = () => {
   return <ErrorIcon size='sm' style={{ fill: 'red', fontSize: 15 }} />;
};
const GreenCheckIcon = () => {
   return <CheckCircleIcon size='sm' style={{ fill: 'green', fontSize: 15 }} />;
};

const Logow = (props) => {
   return (
      <div style={rowStyle}>
         <Grid container spacing={2} className={'rowdata ' + props.bgc}>
            <Grid item xs={2} sm={2}>
               {props.code === '200' ? <GreenCheckIcon /> : <RedErrorIcon />}{' '}
               <Space />
               {props.filename}
            </Grid>
            <Grid item xs={2} sm={2}>
               {props.fnction}
            </Grid>
            <Grid item xs={2} sm={2}>
               {props.msg_programmer}
            </Grid>
            <Grid item xs={2} sm={4}>
               {props.msg_app},{props.refer}
            </Grid>
            <Grid item xs={2} sm={2}>
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

const useStyles = makeStyles((theme) => ({
   root: {
      '& > *': {
         marginTop: theme.spacing(2)
      }
   }
}));

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
   const [page, setPage] = useState(1);
   const [pageCount, setPageCount] = useState(1);
   const [logsCount, setLogsCount] = useState(0);

   const perPageHandler = (e) => {
      setAlertColor('info');
      setMsgClass('displayBlock');
      setSpinnerClass('displayBlock');
      setMsg('Getting logs from Database');
      setPerPage(e.target.value);
      getLogsCount(thetoken, code).then((theLogsCount) => {
         // calculate the number of pages  total logs / entries per page
         setLogsCount(theLogsCount);
         calcPageNum(theLogsCount, e.target.value);
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
      getLogsCount(thetoken, e.target.value).then((theLogsCount) => {
         setLogsCount(theLogsCount);
         getLogs(thetoken, e.target.value, perPage).then((data) => {
            setLogs(data);
            calcPageNum(theLogsCount, perPage);
            setAlertColor('success');
            setSpinnerClass('displayNone');
            setMsg('Logs Loaded.  Please continue.');
         });
      });
   };

   const calcPageNum = (theLogsCount, thePerPage) => {
      console.log(
         'cpn theLogsCount...' + theLogsCount + ' thePerPage...' + thePerPage
      );
      let n = parseInt(theLogsCount / thePerPage) + 1;
      // check to see if there is not a remainder don't need extra page
      if (parseInt(theLogsCount / thePerPage) === theLogsCount / thePerPage)
         n = parseInt(theLogsCount / thePerPage);
      setPageCount(n);
   };

   const pageChange = (event, page) => {
      //console.log(event.target.classes);
      console.log(event.target);
      let i = event.target.getItemAriaLabel;
      console.log(i);
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
               getLogsCount(startToken, code).then((theLogsCount) => {
                  setLogsCount(theLogsCount);
                  calcPageNum(theLogsCount, perPage);

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
   }, [perPage, code, thetoken, pageCount, logsCount]);

   const classes = useStyles();

   return (
      <div id='main' className='body'>
         <h3>Logs</h3> <br />
         <Msg
            msgClass={msgClass}
            spinnerClass={spinnerClass}
            msg={msg}
            alertColor={alertColor}
         />
         <div style={{ backgroundColor: '#999', padding: 2 }}>
            <Grid container spacing={0}>
               <Grid item xs={6} sm={2}>
                  <InputLabel id='page-label'>Per Page</InputLabel>
                  <Select
                     labelId='page-label'
                     defaultValue={20}
                     onChange={(event) => {
                        perPageHandler(event);
                     }}
                  >
                     <MenuItem value={5}>5</MenuItem>
                     <MenuItem value={10}>10</MenuItem>
                     <MenuItem value={20}>20</MenuItem>
                     <MenuItem value={30}>30</MenuItem>
                     <MenuItem value={50}>50</MenuItem>
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
                  <span style={{ color: 'blue' }}>
                     {'' + logsCount + ' -  Results found'}
                  </span>
               </Grid>
            </Grid>
         </div>
         <Alllogs logs={logs} />
         <div className={classes.root}>
            <Pagination
               style={{
                  backgroundColor: '#aaaaaa',
                  padding: 5,
                  borderRadius: 5
               }}
               count={pageCount}
               page={page}
               color='secondary'
               onClick={(event, page) => pageChange(event, page)}
            />
         </div>
      </div>
   );
};
