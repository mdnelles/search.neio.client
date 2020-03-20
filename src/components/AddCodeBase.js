
import React, { useEffect, useState } from "react";
import { getTtypes, addEntry } from './AddCodeBaseFunctions';
import localForage from 'localforage';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import CheckBoxIcon from '@material-ui/icons/CheckBox';
//import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const sqlPrep = s =>{
  s = s.replace(/'/gi,'`');
  s = s.replace(/"/gi,'\\"');
  s = s.replace(/\</g,"&lt;");   //for <
  s = s.replace(/\>/g,"&gt;");   //for >

  return s;
}

const BR = () => {
  return(
    <div>
      <br />
    </div>
  )
}

export const AddCodeBase = () => {

  const classes = useStyles();
  const [ thetoken, setThetoken ] = useState('Token not Set');
  const [ ttypeArr, setTtypeArr ] = useState([]);
  const [ ttype, setTtype ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ intro, setIntro ] = useState('');
  const [ code, setCode ] = useState('');
  const [ gridClass, setGridClass ] = useState('displayBlock');
  const [ msgClass, setMsgClass ] = useState('displayNone');
  const [ spinnerClass, setSpinnerClass ] = useState('displayNone');
  const [ msg, setMsg ] = useState('');


  const [ keywords, setKeywords ] = useState([]);

  const lgBg = {
      backgroundColor:'#777777',
      borderRadius:3,
      padding:10
  }
  const selectChange = event => {
    console.log(event.target.value);
    setTtype(event.target.value)
  }

  const doChecked = (event,thisKeyword) => {
    
    let kw = new Array();

    if(event.target.checked === true){
      kw = keywords;
      let temp = new Array();
      temp.push(thisKeyword.toString())
      Array.prototype.push.apply(kw, temp);
      setKeywords(kw);
    } else {
      //setKeywords(. keywords.filter(keyword => !keyword.includes(thisKeyword)));
      keywords.forEach( e => {
        if(e !== thisKeyword)  kw.push(e);
      })
      setKeywords(kw);
    }

}

  const addEntryStart = () => {
    setGridClass('displayNone');
    setMsgClass('displayBlock');
    setSpinnerClass('displayBlock');
    setMsg('Adding entry to database');

    setTtype(sqlPrep(ttype));
    setTitle(sqlPrep(title));
    setIntro(sqlPrep(intro));
    setCode(sqlPrep(code));
    if(keywords.length > 0) var kw = JSON.stringify(keywords)
                                      .replace('[','')
                                      .replace(']','')
                                      .replace(/\"/g,'');
    addEntry(thetoken,ttype,title,intro,code,kw).then( res=> {
      setTimeout(() => {
        setSpinnerClass('displayNone');
        setMsg('New Entry added to Database');
      }, 300);
    })
  }
  // on page load / componentDidMount
  useEffect(() => { 

    if(thetoken === 'Token not Set'){ // putting this in to mitigate infinite loop
      localForage.getItem('token', function(err, startToken) {
        setThetoken(startToken);
        getTtypes(startToken).then( res => {
          setTtypeArr(res)
        });
      })
    } else {
      if(ttypeArr.length < 2){
        getTtypes(thetoken).then( res => {
          setTtypeArr(res)
        });
      }
    }
  }, [thetoken, ttypeArr]);
  
  return (
    <div id="main" className="body">

        <h3>Add to CodeBase</h3> <br />
        <div className={msgClass}>
          <div className={spinnerClass}>
          <CircularProgress />
          </div>
          {msg}
        </div>
        <div className={gridClass}>
          <Grid container spacing={1}>
            
            <Grid item xs={12} >
              <div  style={lgBg}>

              <FormControl className={classes.formControl}>
                <InputLabel id="ttype-label">Primary Type</InputLabel>
                <Select
                  labelId="Type"
                  id="ttype"
                  autoWidth={true}
                  value={ttype}
                  onChange={ event => { selectChange(event) } }
                >
                  <MenuItem value={0}>Select Type</MenuItem>
                  {ttypeArr.map(atype => <MenuItem 
                                          value={atype.ttype}
                                          key={atype.id}>
                                          {atype.ttype}
                                      </MenuItem>)}
                  
                </Select>
              </FormControl>

              </div>
            </Grid>
            
            <Grid item xs={12} >
                <div  style={lgBg}>
                      <TextField
                          id="title"
                          label="Title"
                          multiline
                          defaultValue={title}
                          rows="1"
                          fullWidth={true}
                          onChange={ event => {setTitle(event.target.value)}}
                      />
                </div>
            </Grid>
            
            <Grid item xs={12} >
              <div  style={lgBg}>
                      <TextField
                          id="intro"
                          label="Intro"
                          multiline
                          defaultValue={intro}
                          rows="3"
                          fullWidth={true}
                          onChange={ event => {setIntro(event.target.value) }}
                      />
                </div>
            </Grid>
            
            <Grid item xs={12} >
              <div  style={lgBg}>
                {ttypeArr.map(atype =>
                  <FormControlLabel
                      key={"c-" + atype.id}
                      control={
                        <Checkbox
                          onChange={ event => doChecked(event,atype.ttype)}
                          id={atype.ttype}
                          color="primary"
                        />
                      }
                      label={atype.ttype}
                  /> 
                  )}
              </div>
            </Grid>

            <Grid item xs={12} >
                <div  style={lgBg}>
                      <TextField
                          id="code"
                          label="Code"
                          multiline
                          rows="20"
                          defaultValue={code}
                          fullWidth={true}
                          onChange={ event => {setCode(event.target.value) }}
                      />
                </div>
            </Grid>
            
            <Grid item xs={12} >
                <div style={{padding:5, justify:'center'}} >
                      <ButtonGroup variant="contained" color="secondary" aria-label="contained primary button group">
                          <Button onClick={ ()=> addEntryStart() } >Save to CodeBase</Button>
                      </ButtonGroup>
                </div>
            </Grid>
  
          </Grid>
        </div>
    </div>
  )
}

