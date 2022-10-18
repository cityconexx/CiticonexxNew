import Constants from "expo-constants";
import { SQLite } from "expo-sqlite";
const db = SQLite.openDatabase("db.cxDB");



class DataBase {
    constructor() {}
  
    static currentUser = {
      uname: 'xxx',
      firstname: 'first',
      lastname: 'last'
    };
  
    static getCurrentUser() {
      return this.currentUser;
    }
  }