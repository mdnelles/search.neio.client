import axios from 'axios'
import './config' // adding config for folder specific build

////// playlists 
export const getTtypes = async theToken => {
    try {
        const res = await axios
            .post(global.config.routerPath + '/search/get_ttypes', {
                token: theToken,
                caller: 'AddCodeBaseFunctions.getTtypes'
            })
        return res.data
    }
    catch (err) {
        console.log("ClientSide Error @ AddCodeBaseFunctions.getTtypes " + err)
        return false
    }
}


export const addEntry = async (theToken,ttype,title,intro,code,keywords) => {
    try {
        const res = await axios
            .post(global.config.routerPath + '/search/add_entry', {
                ttype,
                title,
                intro,
                code,
                keywords,
                token: theToken,
                caller: 'AddCodeBaseFunctions.addEntry'
            })
        console.log('returned from removing data ' + res)
        return res.data
    }
    catch (err) {
        console.log("ClientSide Error @ AddCodeBaseFunctions.addEntry" + err)
        return false
    }
}


