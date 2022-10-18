import React from 'react'

import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('cxmdb.db');
let messageData, taskData, taskGroup; userData;



const setupMessageAsync = async (json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(tx => {
      tx.executeSql('delete from messages', []);
      tx.executeSql('insert into messages (json, jsondata) values (?,?)', [JSON.stringify(json), JSON.stringify(json)]);
    },
      (t, error) => { console.log("db error insertMessage"); console.log(error); alert(JSON.stringify(error)); resolve() },
      (t, success) => { resolve(success); }
    )
  })
}


const getMessagesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from messages',
          [],
          (_, { rows: { _array } }) => {
            if (_array.length > 0)
              messageData = _array[0].json;

            resolve({ messageData });
          }
        );
      },
      (t, error) => { console.log("db error load messages"); console.log(error) },
      (_t, _success) => { console.log("loaded messages"); }
    );
  });

  return messageData;
}


const setupTaskAsync = async (json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(tx => {
      tx.executeSql('delete from tasks', []);
      tx.executeSql('insert into tasks (json, jsondata) values (?,?)', [JSON.stringify(json), JSON.stringify(json)]);
    },
      (t, error) => { console.log("db error inserttask"); console.log(error); resolve() },
      (t, success) => { resolve(success) }
    )
  })
}



const getTaskAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from tasks',
          [],
          (_, { rows: { _array } }) => {

            if (_array.length > 0)
              taskData = _array[0].json;

            resolve({ taskData });
          }
        );
      },
      (t, error) => { console.log("db error load messages"); console.log(error) },
      (_t, _success) => { console.log("loaded messages"); }
    );
  });

  return taskData;
}

const setupTaskGroupAsync = async (json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(tx => {
      tx.executeSql('delete from taskgroup', []);
      tx.executeSql('insert into taskgroup (json) values (?)', [JSON.stringify(json)]);
    },
      (t, error) => { console.log("db error inserttask"); console.log(error); resolve() },
      (t, success) => { resolve(success) }
    )
  })
}



const getTaskGroupAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from taskgroup',
          [],
          (_, { rows: { _array } }) => {

            if (_array.length > 0)
              taskGroup = _array[0].json;

            resolve({ taskGroup });
          }
        );
      },
      (t, error) => { console.log("db error load messages"); console.log(error) },
      (_t, _success) => { console.log("loaded messages"); }
    );
  });

  return taskGroup;
}



export const database123 = {

  setupMessageAsync,
  getMessagesAsync,
  setupTaskAsync,
  getTaskAsync,
  setupTaskGroupAsync,
  getTaskGroupAsync
}