import axios from 'axios';
import './config'; // adding config for folder specific build

var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes('3000')) serverPath = global.config.devPath;

////// playlists
export const getLogs = async (theToken) => {
   try {
      const res = await axios.post(serverPath + '/logs/get_logs', {
         token: theToken,
         caller: 'logFunctions.getLogs'
      });
      return res.data;
   } catch (err) {
      console.log('ClientSide Error @ logFunctions.getLogs' + err);
      return false;
   }
};
