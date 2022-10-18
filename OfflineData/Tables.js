import React from 'react'

import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('cxmdb.db');


const setupDatabaseTableAsync = async () => {
  //alert('creating tables');
  return new Promise((resolve, reject) => {
    db.transaction(tx => {

      // tx.executeSql(
      //   'DROP TABLE IF EXISTS logindetail; DROP TABLE IF EXISTS tasks; DROP TABLE IF EXISTS taskgroup; DROP TABLE IF EXISTS pagingdeltadata; DROP TABLE IF EXISTS taskDetail; DROP TABLE IF EXISTS savetask; DROP TABLE IF EXISTS activityJSON; DROP TABLE IF EXISTS messages; DROP TABLE IF EXISTS messageDetail; DROP TABLE IF EXISTS taskDLL; DROP TABLE IF EXISTS log;'
      // );

      tx.executeSql(
        'create table if not exists logindetail (id integer primary key not null, useremail text, type text, json JSON); '
      );
      tx.executeSql(
        'create table if not exists tasks (id integer primary key not null, rowid integer, clientAppId integer, ismetadata integer, isstatus integer, json JSON); '
      );

      tx.executeSql(
        'create table if not exists taskgroup (id integer primary key not null, json JSON); '
      );

      tx.executeSql(
        'create table if not exists pagingdeltadata (id integer primary key not null, reportId integer, json JSON); '
      );
      tx.executeSql(
        'create table if not exists taskDetail (id integer primary key not null, clientAppId integer, RowId integer, json text); '
      );
      tx.executeSql(
        'create table if not exists savetask (id integer primary key not null, timestamp string, json JSON); '
      );
      tx.executeSql(
        'create table if not exists activityJSON (id integer primary key not null, groupAppId integer, json JSON); '
      );

      tx.executeSql(
        'create table if not exists messages (id integer primary key not null, rowid integer, json JSON); '
      );

      tx.executeSql(
        'create table if not exists messageDetail (id integer primary key not null, RowId integer, json JSON); '
      );

      tx.executeSql(
        'create table if not exists taskDLL (id integer primary key not null, groupAppId integer, json JSON); '
      );

      tx.executeSql(
        'create table if not exists log (id integer primary key not null, log text); '
      );

      tx.executeSql(
        'create table if not exists tabletaskCategory (id integer primary key not null, group_id integer, server_id integer, category_text text, cat_json JSON); '
      );

    },
      (_, error) => { console.log("db error creating tables3333"); resolve(error); console.log(error); reject(error); },
      (_, success) => { resolve(success); console.log("tables created"); }
    )
  })
}





export const database = {
  setupDatabaseTableAsync,

}