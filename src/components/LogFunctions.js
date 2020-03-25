import axios from 'axios';
import './config'; // adding config for folder specific build

var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes('3000')) serverPath = global.config.devPath;

////// playlists
export const getLogs = async (theToken, code, perPage) => {
   try {
      const res = await axios.post(serverPath + '/logs/get_logs', {
         token: theToken,
         code,
         perPage,
         caller: 'logFunctions.getLogs'
      });
      return res.data;
   } catch (err) {
      console.log('ClientSide Error @ logFunctions.getLogs' + err);
      return false;
   }
};

export const getLogsCount = async (theToken, code) => {
   try {
      const res = await axios.post(serverPath + '/logs/get_logcount', {
         token: theToken,
         code,
         caller: 'logFunctions.getLogsCount'
      });
      console.log('log count (middle): ' + res.data);
      return res.data;
   } catch (err) {
      console.log('ClientSide Error @ logFunctions.getLogsCount' + err);
      return false;
   }
};
