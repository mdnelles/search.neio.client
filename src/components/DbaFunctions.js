import $ from 'jquery'
import axios from 'axios'
import './config' // adding config for folder specific build

export const makeRandom = async theToken => {
    try {
        const res = await axios
            .post('/donors/randomizename2', {
                "token": theToken,
                "caller": 'DbaFunctions.makeRandom'
            })
        //console.log('res: ' + res)
        return res
    }
    catch (err) {
        console.log("ClientSide Error @ DonorFunctions > update counters" + err)
        return '++Error Loc 10e'
    }
}

export const rmDupes = (DBname, theToken) => {
    return new Promise((resolve, reject) => {
        var args1 = {
            "DBname": DBname,
            "token": theToken,      
            "caller": 'DbaFunctions.rmDupes'
        }
        $.ajax({
        
            url: global.config.routerPath + '/dba/removedupes2',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : args1,
            error: function(err) {
                reject(err)
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

// restore from another designated DB
export const restoreFromNew = (DBname,theToken) => {
    return new Promise((resolve, reject) => {
        var args1 = {
            "DBname": DBname,
            "token": theToken,      
            "caller": 'DbaFunctions.restoreFromNew'
        }
        $.ajax({
        
            url: global.config.routerPath + '/dba/restorfromnew2',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : args1,
            error: function(err) {
                reject(err)
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

// restore from SQL file
export const restoreMainDB = (DBname,theToken) => {
    return new Promise((resolve, reject) => {
        var args1 = {
            "DBname": DBname,
            "token": theToken,      
            "caller": 'DbaFunctions.restoreMainDb'
        }
        $.ajax({
            url: global.config.routerPath + '/dba/restormain',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            data:args1,
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            error: function(err) {
                reject(err)
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

export const fromMainDbToNew = (DBname,theToken) => {
    return axios
      .post(global.config.routerPath + '/dba/copyfromdb2', {
            DBname,
            "token": theToken,      
            "caller": 'DbaFunctions.fromMainDbToNew'
     })
     .then(res => {
        //console.log('Success DbaFunctions.fromMainDbToNew -> ' + JSON.stringify(res))
        //console.log('Success DbaFunctions.fromMainDbToNew');
        return res;
      })
      .catch(err => {
        console.log("Error: DbaFunctions.fromMainDbToNew " + err)
        return 'Err: ' + err;
      })     
}

export const removeDB = (DBname,theToken) => {
    return new Promise((resolve, reject) => {
        var args1 = {
            "DBname": DBname,
            "token": theToken,      
            "caller": 'DbaFunctions.removeDB'
        }
        $.ajax({
        
            url: global.config.routerPath + '/dba/removedb2',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : args1,
            error: function(err) {
                reject(err)
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

export const createDB = (newDbName,theToken) => {
    return axios
      .post(global.config.routerPath + '/dba/createdb2', {
            newDbName,
            "token": theToken,      
            "caller": 'DbaFunctions.createDB'
      })
     .then(res => {
        //console.log('Success DbaFunctions.getDBs -> ' + JSON.stringify(res.data))
        return res.data;
      })
      .catch(err => {
        console.log("Error: DbaFunctions.getDBs " + err)
        return 'Err: ' + err
      })
}
  
export const getDBs = theToken => {
    return axios
      .post(global.config.routerPath + '/dba/showdbs2', {
            na: "na",
            token:theToken,      
            caller: 'DbaFunctions.getDBs'
        })
        .then(res => {
            //console.log('Success DbaFunctions.getDBs -> ' + JSON.stringify(res.data))
            return res.data;
          })
          .catch(err => {
            console.log("Error: DbaFunctions.getDBs " + err)
            return 'Err: ' + err
          })
}
  
