import React, { useState, useEffect } from "react";
import { login } from "./UserFunctions";

import localForage from "localforage";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
//import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
//import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

// for material ui
const useStyles = makeStyles((theme) => ({
   root: {
      "display": "flex",
      "& > * + *": {
         marginLeft: theme.spacing(2),
      },
      "& .MuiTextField-root": {
         margin: theme.spacing(1),
         width: 200,
         flexGrow: 1,
      },
      "& > *": {
         margin: theme.spacing(1),
      },
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
   },
   control: {
      padding: theme.spacing(2),
   },
}));
////// end material ui

const Msgbar = (props) => {
   return (
      <div className={props.spinVis}>
         <CircularProgress />
         {props.msg}
      </div>
   );
};

export const Landing = () => {
   const [email, setEmail] = useState(""),
      [password, setPassword] = useState("WSmWxQ@([X;SY3?J"),
      [msg, setMsg] = useState("Enter valid credentials to proceed"),
      [spinVis, setSpinVis] = useState("visible"),
      classes = useStyles(); // for materialui

   function butClick(e) {
      console.log("button clicked");
      e.preventDefault();
      setSpinVis("visible");
      setMsg("Checking credentials...");
      const user = {
         email: email,
         password: password,
      };

      if (
         email === null ||
         email === undefined ||
         email === "" ||
         password === null ||
         password === undefined ||
         password === ""
      ) {
         setSpinVis("hid");
         setMsg("Please ender valid login credentials");
      } else {
         localForage.setItem("token", false); // clear old token if exists
         login(user)
            .then((res) => {
               if (parseInt(res) !== null) {
                  localForage.setItem("token", res);

                  setTimeout(() => {
                     window.location.href = "/add";
                  }, 1000);
               } else {
                  console.log("+++ unhandled error here: " + __filename);
                  setSpinVis("hid");
                  setMsg("Login Failed");
               }
            })
            .catch((err) => {
               console.log("+++ error in file: " + __filename + "err=" + err);
            });
      }
   }

   useEffect(() => {
      setSpinVis("hid");
      setMsg("Enter valid credentials to proceed");
   }, []);

   return (
      <div className='vertical-center center-outer'>
         <div className='center-inner'>
            <Msgbar msg={msg} spinVis={spinVis} />

            <form noValidate>
               <Card className={classes.root}>
                  <CardContent>
                     <TextField
                        label='email'
                        defaultValue={email}
                        onChange={(event) => setEmail(event.target.value)}
                     />
                     <br />
                     <TextField
                        label='Password'
                        type='password'
                        defaultValue={password}
                        onChange={(event) => setPassword(event.target.value)}
                     />
                     <br />
                     <Button
                        variant='contained'
                        color='default'
                        onClick={butClick}
                     >
                        Login
                     </Button>
                  </CardContent>
               </Card>
            </form>
         </div>
      </div>
   );
};
