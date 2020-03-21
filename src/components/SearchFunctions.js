import axios from 'axios';
import './config'; // adding config for folder specific build

var thisServer = window.location.href;
var serverPath = global.config.routerPath;
if (thisServer.includes('3000')) serverPath = global.config.devPath;

export const getTitles = async (token) => {
   try {
      const res = await axios.post(serverPath + '/search/get_titles', {
         token: token,
         caller: 'SearchFunctions.getTitles'
      });
      // this needs to be an array of all the filenames
      return res.data;
   } catch (err) {
      console.log('ClientSide Error @ SearchFunctions.getTitles' + err);
      return '-- Err: SearchFunctions.getTitles ' + err;
   }
};

export const updEntry = async (id, title, intro, code, token) => {
   try {
      const res = await axios.post(serverPath + '/search/upd_entry', {
         token,
         id,
         title,
         intro,
         code,
         caller: 'SearchFunctions.updEntry'
      });
      return res.data;
   } catch (err) {
      console.log('Err SearchFunctions.updEntry => ' + err);
      return '-- Err: SearchFunctions.updEntry => ' + err;
   }
};

export const doQuery = async (token, query) => {
   try {
      const res = await axios.post(serverPath + '/search/do_query', {
         token,
         query,
         caller: 'SearchFunctions.doQuery'
      });
      return res.data;
   } catch (err) {
      console.log('Err SearchFunctions.doQuery => ' + err);
      return '-- Err: SearchFunctions.doQuery => ' + err;
   }
};

export const delEntry = async (theToken, id) => {
   try {
      const res = await axios.post(serverPath + '/search/del_entry', {
         id,
         token: theToken,
         caller: 'AddCodeBaseFunctions.delEntry'
      });
      console.log('returned from removing data ' + res);
      return res.data;
   } catch (err) {
      console.log('ClientSide Error @ AddCodeBaseFunctions.delEntry' + err);
      return false;
   }
};
