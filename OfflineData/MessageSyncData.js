import React from 'react'

import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('cxmdb.db');



const setupMessageDetailAsync = async (rowid, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(tx => {
      tx.executeSql('delete from messageDetail Where RowId = ?', [rowid]);
      tx.executeSql('insert into messageDetail (RowId, json) values (?, ?)', [rowid, json]);
    },
      (t, error) => { console.log("db error insertmessagedetail"); console.log(t); console.log(error); resolve() },
      (t, success) => { resolve(success); console.log('message row inserted' + rowid); }
    )
  })
}
let messageDetailData;
const getMessageDetailAsync = async (rowid) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from messageDetail Where RowId = ?',
          [rowid],
          (_, { rows: { _array } }) => {

            //alert(JSON.stringify(_array));
            messageDetailData = null;
            if (_array.length > 0)
              messageDetailData = _array[0].json;

            resolve({ messageDetailData });
          }
        );
      },
      (t, error) => { console.log("db error load messageDetail"); console.log(error) },
      (_t, _success) => { console.log("loaded messageDetail" + rowid); }
    );
  });

  return taskData;
}

const setupMessageAsync = async (rowid, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(tx => {
      tx.executeSql('delete from messages where rowid = ?', [rowid]);
      tx.executeSql('insert into messages (rowid, json) values (?,?)', [rowid, JSON.stringify(json)]);
    },
      (t, error) => { console.log("db error insertMessage" + rowid); console.log(error); resolve() },
      (t, success) => { resolve(success); console.log('message inserted' + rowid); }
    )
  })
}

let messageData, taskData, messageMetaData;
const getMessagesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from messages',
          [],
          (_, { rows: { _array } }) => {
            messageData = null;
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

const getRowMessagesAsync = async (rowid) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from messages where rowid = ?',
          [rowid],
          (_, { rows: { _array } }) => {
            messageData = null;
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

const getMessageDataJSONAsync = async () => {

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from messages where rowid > 0',
          [],
          (_, { rows: { _array } }) => {
            messageData = null;
            let d = [];

            for (let i = 0; i < _array.length; i++) {
              //alert(JSON.stringify(_array[i].json));
              let item = JSON.parse(_array[i].json);
              //item.isExpand = false;
              d.push(item);
            }

            if (d.length > 0)
              messageData = d;

            resolve({ messageData });
          }
        );
      },
      (t, error) => { console.log("db error load messages"); console.log(error) },
      (_t, _success) => { console.log("loaded messages"); }
    );
  });

  return taskData;

}
const getMessageMetaDataJSONAsync = async () => {
  //alert(clientAppId);
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from messages where rowid = 0',
          [],
          (_, { rows: { _array } }) => {
            messageMetaData = null;


            if (_array.length > 0)
              messageMetaData = JSON.parse(_array[0].json);

            resolve({ messageMetaData });
          }
        );
      },
      (t, error) => { console.log("db error load messages"); console.log(error) },
      (_t, _success) => { console.log("loaded messages"); }
    );
  });

  return taskData;
}


export const database = {

  setupMessageAsync,
  getMessagesAsync,
  getMessageMetaDataJSONAsync,
  getMessageDataJSONAsync,
  setupMessageDetailAsync,
  getMessageDetailAsync,
  getRowMessagesAsync
}