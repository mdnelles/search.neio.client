import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import TextField from "@material-ui/core/TextField";

import "./config";
var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes("3000")) serverPath = global.config.devPath;

const useStyles = makeStyles((theme) => ({
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
   selectEmpty: {
      marginTop: theme.spacing(2),
   },
}));

export const CreateSnippet = () => {
   const [title, setTitle] = useState(""),
      [prefix, setPrefix] = useState(""),
      [body, setBody] = useState(""),
      [description, setDescription] = useState("");

   const setBodyStart = (val) => {
      let newVal = val.toString().replace(/"/g, '\\"');

      newVal = '"' + newVal.replace(/\n/g, '",\n"') + '"';
      setBody(newVal);
   };

   const buildSnippet = () => {
      console.log("ok we can now build the snippet");
   };

   const lgBg = {
      backgroundColor: "#ffffff",
      borderRadius: 3,
      padding: 10,
   };

   // on page load / componentDidMount
   useEffect(() => {
      // putting this in to mitigate infinite loop
      console.log("useEffect of CreateSnippet ");
   }, [title, prefix, body, description]);

   return (
      <div id='main' className='body'>
         <h3>Create A VS Code Snippet</h3> <br />
         <div>
            <Grid container spacing={1}>
               <Grid item xs={12}>
                  <div style={lgBg}>
                     <TextField
                        id='title'
                        label='Title'
                        multiline
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
                        id='prefix'
                        label='Prefix'
                        multiline
                        rows='1'
                        fullWidth={true}
                        onChange={(event) => {
                           setPrefix(event.target.value);
                        }}
                     />
                  </div>
               </Grid>
               <Grid item xs={12}>
                  <div style={lgBg}>
                     <TextField
                        id='descriptiom'
                        label='Description'
                        multiline
                        rows='1'
                        fullWidth={true}
                        onChange={(event) => {
                           setDescription(event.target.value);
                        }}
                     />
                  </div>
               </Grid>
               <Grid item xs={12}>
                  <div style={lgBg}>
                     <TextField
                        id='body'
                        label='Body'
                        multiline
                        rows='20'
                        fullWidth={true}
                        onChange={(event) => {
                           setBodyStart(event.target.value);
                        }}
                     />
                  </div>
               </Grid>
            </Grid>
         </div>
         <div>
            <pre>
               {`"${title}": {
          "prefix": "${prefix}",
          "body": [
${body}
          ],
          "description": "${description}"
        }`}
            </pre>
         </div>
      </div>
   );
};
