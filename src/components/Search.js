import React, { useEffect, useState } from 'react';
import { doQuery, updEntry, delEntry } from './SearchFunctions';
import localForage from 'localforage';

import { Msg } from './CustomWidget';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Alert } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';

const kwStyle = {
   fontSize: '.8em',
   color: 'yellow',
   marginLeft: 10
};
const searchTitle = {
   color: '#cccccc',
   cursor: 'pointer'
};

const lgBg = {
   backgroundColor: '#ade0ff'
};
const displayToggle = (id, dtype) => {
   let newClass,
      c = document.getElementById(dtype + '-' + id).className;
   if (c.toString().includes('displayNone')) {
      newClass = c.toString().replace('displayNone', 'displayBlock');
   } else {
      newClass = c.toString().replace('displayBlock', 'displayNone');
   }
   document.getElementById(dtype + '-' + id).className = newClass;
};

const TheSearchResult = (props) => {
   let titleFormated =
      props.title.charAt(0).toUpperCase() + props.title.slice(1);
   let thecode = props.code
      .toString()
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
   return (
      <div className={'rowdata ' + props.bgc}>
         <Grid container spacing={1}>
            <Grid item xs={12} sm={10}>
               <div
                  justify='flex-end'
                  className='displayNone'
                  id={'etitle-' + props.id}
                  style={lgBg}
               >
                  <TextField
                     id={'txtTitle-' + props.id}
                     label='Intro'
                     multiline
                     rows='1'
                     defaultValue={props.title}
                     variant='filled'
                     fullWidth={true}
                  />
               </div>
               <div
                  style={searchTitle}
                  className='displayBlock'
                  id={'title-' + props.id}
                  onClick={() => {
                     displayToggle(props.id, 't');
                     displayToggle(props.id, 'cmd');
                  }}
               >
                  {titleFormated}
                  <span style={kwStyle}>{props.keywords}</span>
               </div>
            </Grid>
            <Grid item xs={3} sm={2}>
               <div
                  justify='flex-end'
                  className='displayNone'
                  id={'cmd-' + props.id}
               >
                  <ButtonGroup
                     variant='contained'
                     color='primary'
                     aria-label='contained primary button group'
                  >
                     <Button onClick={() => props.swapEditable(props.id)}>
                        Edit
                     </Button>
                     <Button onClick={() => props.removeEntryStart(props.id)}>
                        Delete
                     </Button>
                  </ButtonGroup>
               </div>
            </Grid>
            <Grid item xs={12}>
               <div className='displayNone' id={'t-' + props.id}>
                  <div id={'intro-' + props.id} className='displayBlock'>
                     <pre>{props.intro}</pre>
                     <br />
                  </div>
                  <div
                     id={'eintro-' + props.id}
                     className='displayNone'
                     style={lgBg}
                  >
                     <TextField
                        id={'txtIntro-' + props.id}
                        label='Intro'
                        multiline
                        rows='3'
                        defaultValue={props.intro}
                        variant='filled'
                        fullWidth={true}
                     />
                  </div>

                  <pre>
                     <code className='displayBlock' id={'code-' + props.id}>
                        {thecode}
                     </code>
                  </pre>

                  <div
                     id={'ecode-' + props.id}
                     className='displayNone'
                     style={lgBg}
                  >
                     <TextField
                        style={{ color: '#fff' }}
                        id={'txtCode-' + props.id}
                        label='code'
                        multiline
                        rows='15'
                        defaultValue={thecode}
                        variant='filled'
                        fullWidth={true}
                     />
                  </div>
                  <div
                     style={{ padding: 5, justify: 'center' }}
                     className='displayNone'
                     id={'save-' + props.id}
                  >
                     <ButtonGroup
                        variant='contained'
                        color='secondary'
                        aria-label='contained primary button group'
                     >
                        <Button onClick={() => props.updEntryStart(props.id)}>
                           Save Changes
                        </Button>
                        <Button onClick={() => props.swapEditable(props.id)}>
                           Cancel
                        </Button>
                     </ButtonGroup>
                  </div>
               </div>
            </Grid>
         </Grid>
      </div>
   );
};

const AllSearchRes = (props) => {
   var tog = false,
      bgc;

   if (
      props.searchResults !== undefined &&
      Array.isArray(props.searchResults)
   ) {
      props.searchResults.forEach((e, i) => {
         tog === false ? (bgc = 'darkbg') : (bgc = 'graybg');
         tog = !tog;
         props.searchResults[i].bgc = bgc;
      });
   }

   return (
      <div>
         {props.searchResults.map((result) => (
            <TheSearchResult
               id={result.id}
               key={result.id}
               title={result.title}
               ttype={result.ttype}
               updEntryStart={props.updEntryStart}
               code={result.code}
               intro={result.intro}
               keywords={result.keywords}
               date1={result.keywords}
               swapEditable={props.swapEditable}
               removeEntryStart={props.removeEntryStart}
               bgc={result.bgc}
            />
         ))}
      </div>
   );
};

export const Search = () => {
   const updEntryStart = (id) => {
      setMsgClass('displayBlock');
      setSpinnerClass('displayBlock');
      setMsg('Editing entry &#8594; database');
      let title = document.getElementById('txtTitle-' + id).value;
      let intro = document.getElementById('txtIntro-' + id).value;
      let code = document.getElementById('txtCode-' + id).value;
      console.log('title:\n ' + title);
      console.log('intro:\n ' + intro);
      console.log('code:\n ' + code);
      updEntry(id, title, intro, code, thetoken).then((res) => {
         setSpinnerClass('displayNone');
         setMsg('Database Entry edited succcessfully');
         setAlertColor('success');

         document.getElementById(
            'title-' + id
         ).innerHTML = document.getElementById('txtTitle-' + id).value;
         document.getElementById('intro-' + id).innerHTML =
            '<pre>' +
            document.getElementById('txtIntro-' + id).value +
            '</pre>';
         document.getElementById(
            'code-' + id
         ).innerHTML = document.getElementById('txtCode-' + id).value;

         swapEditable(id);
      });
   };

   const swapEditable = (id) => {
      displayToggle(id, 'code');
      displayToggle(id, 'ecode');
      displayToggle(id, 'save');
      displayToggle(id, 'intro');
      displayToggle(id, 'eintro');
      displayToggle(id, 'title');
      displayToggle(id, 'etitle');
   };

   const removeEntryStart = (id) => {
      if (window.confirm('Are you sure you want to delete this?')) {
         delEntry(thetoken, id)
            .then((res) => {
               setSearchResults(searchResults.filter((a) => a.id !== id));
               console.log(res);
            })
            .catch((err) => {
               console.log('Err when trying to delete the entry: ' + err);
            });
      } else {
         return false;
      }
   };

   const [thetoken, setThetoken] = React.useState('');
   const [searchQuery, setSearchQuery] = React.useState('');
   const [searchResults, setSearchResults] = React.useState([]);
   const [msgClass, setMsgClass] = useState('displayNone');
   const [spinnerClass, setSpinnerClass] = useState('displayNone');
   const [msg, setMsg] = useState('');
   const [alertColor, setAlertColor] = useState('info');

   useEffect(() => {
      let temp = window.location.href.toString().split('/');
      let rest = decodeURI(temp[temp.length - 2].toString());
      setSearchQuery(rest);
      localForage.getItem('token').then(function(theToken) {
         setThetoken(theToken);
         doQuery(theToken, encodeURI(rest)).then((res) => {
            setSearchResults(res);
         });
      });
   }, []);

   return (
      <div id='main' className='body'>
         <h3>Search</h3>
         <Alert severity='info'>Query &#8658; {searchQuery}</Alert>
         <Msg
            msgClass={msgClass}
            spinnerClass={spinnerClass}
            msg={msg}
            alertColor={alertColor}
         />
         <AllSearchRes
            searchResults={searchResults}
            swapEditable={swapEditable}
            removeEntryStart={removeEntryStart}
            updEntryStart={updEntryStart}
         />
      </div>
   );
};
