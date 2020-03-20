import axios from 'axios'
import localForage from 'localforage'
import './config' // adding config for folder specific build

export const addUser = (newUser,theToken) => {
    return axios
      .post(global.config.routerPath + '/user/register', {
        uuid: newUser.uuid,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password,
        admin: newUser.admin,
        token: theToken,
        caller: 'UserFunctions.register'
      })
      .then(res => {
        console.log('Registered')
        return res
      })
      .catch(err => {
        console.log("ClientSide Error @ UserFunctions > getUsers " + err)
        return '++Error Loc 10'
      })

}

export const removeUser = (theUuid, token) => {
  return axios
    .post(global.config.routerPath + '/user/remove_user', {
      theUuid,
      token,
      caller: 'UserFunctions.register'
    })
    .then(res => {
      console.log('User Removed')
      return 1
    })
    .catch(err => {
      console.log("ClientSide Error @ UserFunctions > removeUser " + err)
      return '++Error Loc 02'
    })
}

export const getUsers = async theToken => {
    try {
    const res = await axios
      .post(global.config.routerPath + '/user/getusers', {
        token: theToken,
        caller: 'UserFunctions.register'
      })
    //console.log(res.data)
    return res.data
  }
  catch (err) {
    console.log("ClientSide Error @ UserFunctions > getUsers " + err)
    return '++Error Loc 07'
  }


}
//export const userIsLoggedIn = token => {
export const userIsLoggedIn = async token => {
  try {
    const res = await axios
      .post(global.config.routerPath + '/user/islogged', {
        token: token,
        caller: 'UserFunctions.userIsLoggedIn'
      })
    return res.data
  }
  catch (err) {
    console.log("Err (catch) UserFunctions > userIsLoggedIn ... " + err)
    document.location.href = '/'
    return false
  }
}

export const login = async user => {
  try {
    const res = await axios
      .post(global.config.routerPath + '/user/login', {
        email: user.email,
        password: user.password,
        caller: 'UserFunctions.register'
      })
    return res.data.token
  }
  catch (err) {
    console.log('Error (catch) UserFunctions > login' + err)
    return 0
  }
}

export const logout = () => {
  localForage.removeItem('token').then( ()=> {
    console.log('token cleared')
    window.location.href = '/'
  })
  
}


