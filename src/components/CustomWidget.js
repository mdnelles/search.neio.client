import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const ms = {
   marginTop: 3,
   marginBottom: 3
};

export const Msg = (props) => {
   return (
      <div className={props.msgClass} style={ms}>
         <div className={props.spinnerClass}>
            <CircularProgress />
         </div>
         <Alert severity={props.alertColor}>{props.msg}</Alert>
      </div>
   );
};
