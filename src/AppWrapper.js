import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import localForage from "localforage";

import { userIsLoggedIn } from "./components/UserFunctions";
import "./App.css";

import { AddCodeBase } from "./components/AddCodeBase";
import { Dba } from "./components/Dba";
import { Loading } from "./components/Loading";
import { Navbar } from "./components/Navbar";
import { ManageCategories } from "./components/ManageCategories";
import { Search } from "./components/Search";
import { Users } from "./components/Users";
import { LogView } from "./components/LogView";
import { CreateSnippet } from "./components/CreateSnippet";

export const AppWrapper = () => {
   const [activeSession, setActiveSession] = useState("loading");

   useEffect(() => {
      localForage
         .getItem("token", function (err, theToken) {
            if (err) {
               console.error("token err -> " + err);
            } else {
               userIsLoggedIn(theToken)
                  .then((data) => {
                     // imported fun
                     if (data === true || data === "true") {
                        setActiveSession("ok");
                     } else {
                        window.location.href = "/";
                     }
                  })
                  .catch((err) => {
                     console.log("user is not logged in " + err);
                     window.location.href = "/";
                  });
            }
         })
         .catch((err) => {
            console.log("user is not logged in " + err);
            window.location.href = "/";
         });
   }, []);

   var ret = "";
   if (activeSession === "no") {
      ret = <Redirect to='/' />;
   } else if (activeSession === "loading") {
      ret = <Route path='/' component={Loading} />;
   } else {
      ret = (
         <div>
            <Navbar />
            <div className='appHolder'>
               <Route exact path='/dba' component={Dba} />
               <Route exact path='/search/:qry' component={Search} />
               <Route exact path='/categories' component={ManageCategories} />
               <Route exact path='/snippet' component={CreateSnippet} />
               <Route exact path='/add' component={AddCodeBase} />
               <Route exact path='/users' component={Users} />
               <Route exact path='/logs' component={LogView} />
            </div>
         </div>
      );
   }

   return ret;
};
