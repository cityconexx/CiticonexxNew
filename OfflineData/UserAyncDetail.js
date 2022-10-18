import React from 'react'

import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('cxmdb.db');

let userData, logdata;
const setupUserDataAsync = async (type, json) => {
  //alert(type); alert(json);
  return await new Promise((resolve, _reject) => {
    db.transaction(tx => {

      tx.executeSql('delete from logindetail where type = ?', [type]);
      tx.executeSql('insert into logindetail (useremail, type, json) values (?,?,?)', ['', type, JSON.stringify(json)]);
    },
      (t, error) => { console.log(type + 'Not Inserted'); resolve(error); },
      (t, success) => { resolve(success); console.log(type + 'Inserted'); }
    )
  });
}

const addlog = async (log) => {
  //alert(type); alert(json);
  return await new Promise((resolve, _reject) => {
    db.transaction(tx => {

      //tx.executeSql( 'delete from logindetail where type = ?',[type]);
      tx.executeSql('insert into log (log) values (?)', [log]);
    },
      (t, error) => { console.log(log + 'Not Inserted'); resolve(error); },
      (t, success) => { resolve(success); console.log(log + 'Inserted'); }
    )
  });
}
const deletelog = async () => {
  //alert(type); alert(json);
  return await new Promise((resolve, _reject) => {
    db.transaction(tx => {

      tx.executeSql('delete from log', []);
      //tx.executeSql( 'insert into log (log) values (?)', [log]);
    },
      (t, error) => { console.log('log not deleted'); resolve(error); },
      (t, success) => { resolve(success); console.log('log deleted'); }
    )
  });
}
const getlog = async () => {
  return await new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from log',
          [],
          (_, { rows: { _array } }) => {
            logdata = null;
            //alert(JSON.stringify(_array.length));
            if (_array.length > 0)
              logdata = _array;
            //if(type == 'clientApps'){alert(JSON.stringify(userData));}
            resolve({ logdata });
          }
        );
      },
      (t, error) => { console.log("db error load log"); console.log(error) },
      (_t, _success) => { console.log("loaded log"); }
    );
  });

  return userData;
}
const getUserDatAsync = async (type) => {
  return await new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from logindetail where type = ?',
          [type],
          (_, { rows: { _array } }) => {
            userData = null;

            if (_array != null && _array.length > 0) {
              userData = _array[0].json;
            }
            //if(type == 'clientApps'){alert(JSON.stringify(userData));}
            resolve({ userData });
          }
        );
      },
      (t, error) => { console.log("db error load messages"); console.log(error) },
      (_t, _success) => { console.log("loaded messages"); }
    );
  });

  return userData;
}

const clearAllData = () => {


  return new Promise((resolve, _reject) => {

    db.transaction(tx => {

      tx.executeSql('DELETE FROM logindetail;');
      tx.executeSql('DELETE FROM tasks');
      tx.executeSql('DELETE FROM taskgroup');
      tx.executeSql('DELETE FROM pagingdeltadata');
      tx.executeSql('DELETE FROM taskDetail');
      tx.executeSql('DELETE FROM savetask');
      tx.executeSql('DELETE FROM messages');
      tx.executeSql('DELETE FROM activityJSON');
      tx.executeSql('DELETE FROM messageDetail');
      tx.executeSql('delete from logindetail');
      tx.executeSql('delete from logindetail');
      tx.executeSql('delete from log');

    });
  });
}


export const udatabase = {
  setupUserDataAsync,
  getUserDatAsync,
  clearAllData,
  addlog,
  deletelog,
  getlog

}