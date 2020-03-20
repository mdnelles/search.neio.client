import React, { useState, useEffect } from "react";
import { sizeSideBar,get_date } from './_sharedFunctions'
import { createDB, getDBs, fromMainDbToNew, makeRandom, removeDB, rmDupes, restoreFromNew } from './DbaFunctions'
import { Alert, Input, InputGroup, InputGroupAddon, Button, Spinner } from 'reactstrap';
import localForage from 'localforage'

const Dbline = (props) => {
    return (
        <div>
            <Button color="success" id={"a-"+ props.id} className="c2db" onClick={props.copyTo}>Copy to Live DB</Button>
            <Button color="primary" id={"b-"+ props.id} className="cfdb" onClick={props.copyFrom}>Copy From Live DB</Button>
            <Button color="danger" id={"c-"+ props.id} className={"del " + props.visible} onClick={props.deleteOne.bind(this)}>Delete</Button>
            {props.dbName}
        </div>
    )
}

const DBlist  = props => {
    return (
        props.dbNames.map( (dbName,index) => <Dbline 
                                id={dbName}
                                key={"key-" + dbName}  
                                dbName={dbName}
                                copyTo={props.copyTo}
                                copyFrom={props.copyFrom}
                                deleteOne={props.deleteOne}
                                visible={dbName.includes('backup') ? 'hid' : 'visible'}
                            />)
    )
}

export const Dba = () => {

    const [dbNames,setDbNames] = useState([]),
          [newDb, setNewDb] = useState(''),
          [alertMsg, setAlertMsg] = useState(''),
          [alertType, setAlertType] = useState('primary'),
          [alertvisible, setAlertVisible] = useState('hid'),
          [spinVis, setSpinVis] = useState('hid'),
          [thetoken, setThetoken] = useState('Token not Set');

    const loading = `Loading...`;

    function copyFrom(e){
        e.preventDefault(); e.stopPropagation();
        let [,DBname] = e.target.id.toString().split('-')
        setSpinVis('visible');
        setAlertMsg(' Working on cloning main DB to -> ' + DBname );
        fromMainDbToNew(DBname,thetoken).then( res=> {
            //console.log(res)
            setSpinVis('hid')
            setAlertVisible('visible')
            setAlertType('primary')
            setAlertMsg('Database Successfully cloned to ' + DBname)
            callGetDBs(thetoken);
        })
    }
    function copyTo(e){
        e.preventDefault(); e.stopPropagation();
        setAlertType('primary')
        setAlertMsg(' loading')
        setSpinVis('visible');
        let [,DBname] = e.target.id.toString().split('-')
        restoreFromNew(DBname,thetoken).then( (res)=> {
            setAlertMsg(JSON.stringify(res))
            callGetDBs(thetoken);
            setSpinVis('hid');
        })
    }
    function deleteOne(e){
        e.preventDefault(); e.stopPropagation();
        setAlertVisible('visible')
        setAlertType('primary')
        setAlertMsg(loading)
        let [,DBname] = e.target.id.toString().split('-')
        removeDB(DBname,thetoken).then( (res)=> {
            setAlertMsg(JSON.stringify(res))
            callGetDBs(thetoken);
        })
    }
    function createOneDb(e){
        e.preventDefault()
        setSpinVis('visible');
        setAlertVisible('visible')
        setAlertType('primary')
        setAlertMsg(loading)
        createDB(newDb,thetoken)
            .then( (res) => {
                setAlertType('success')
                setAlertMsg(JSON.stringify(res))
                callGetDBs(thetoken);
                setSpinVis('hid');
            })
            .catch( err => { 
                console.log('err: ' + err)
                setAlertMsg(err)
                setAlertType('danger')
                setSpinVis('hid');
            })
    }

    function removeDupes(){
        setAlertVisible('visible')
        setAlertType('primary')
        setAlertMsg('  loading')
        setSpinVis('visible');
        rmDupes('envision',thetoken).then( res => {
            setAlertType('success')
            setAlertMsg(JSON.stringify(res))
            setSpinVis('hid');
        })
    }

    function preMakeRandom(){
        setAlertVisible('visible')
        setAlertType('primary')
        setAlertMsg('updating ... ')
        makeRandom(thetoken).then( res => {
            setAlertType('success')
            setAlertMsg(JSON.stringify(res.data))
        })
    }

    function callGetDBs(){
        setAlertType('primary')
        //setAlertMsg(loading)
        getDBs(thetoken).then(res => {
            setDbNames(res) // change state
            //setAlertMsg(JSON.stringify(res))
        })
    }
    useEffect(() => {
        localForage.getItem('token', function(err, startToken) {
            setThetoken(startToken)
            sizeSideBar();
            getDBs(startToken).then(res => {
                setDbNames(res);
                setNewDb("_"+get_date());
            })
        });
    }, [thetoken])

    const dd = {
        display:'block',
        width:'100%',
        padding:10
    }

    return (
        <div id="main">

            <div style={dd}>    
                <Alert color={alertType} id="alert" className={alertvisible}>
                <Spinner color="primary" className={spinVis}/>
                    {alertMsg}
                </Alert>  
            </div>

            <div style={dd}>
                <Button color="success" onClick={removeDupes}>Remove Duplicates</Button>
                <Button color="success" onClick={preMakeRandom}>Replace Donor Names</Button>
            </div>

            <div style={dd}>

                <InputGroup >
                    <InputGroupAddon addonType="prepend">
                        <Button onClick={createOneDb}>Create copy of DB</Button>
                    </InputGroupAddon>
                    <Input type="text" 
                                    id="newDbName" 
                                    placeholder="DB Name" 
                                    value={newDb}
                                    onChange={e => setNewDb(e.target.value)}      
                                />
                </InputGroup>

            </div>
            <div style={dd} id="existingDbs">
                Existing DB's
                <DBlist dbNames={dbNames}
                        copyTo={copyTo}
                        copyFrom={copyFrom}
                        deleteOne={deleteOne}
                    />

                <div id="spin1">
                </div>
            </div>            
        </div>
    )



} 