import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const ms = {
   margin: 3
};

export const Msg = (props) => {
   return (
      <div className={props.msgClass} style={ms}>
         <div className={props.spinnerClass}>
            <CircularProgress />
         </div>
         <Alert severity='info'>{props.msg}</Alert>
      </div>
   );
};
