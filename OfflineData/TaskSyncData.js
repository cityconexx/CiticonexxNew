import React from "react";

import * as SQLite from "expo-sqlite";
// import { Loader } from "../Data/DynamicTaskData";

const db = SQLite.openDatabase("cxmdb.db");

let taskData = null;
let taskDetailData = null;
let taskDetailDataCount = null;
let taskGroup = null;
let activityData = null;
let taskDLL = null;
let saveTask = null;
//where we insert task data into table
const setupTaskAsync = async (
  clientAppId,
  rowid,
  json,
  ismetadata,
  isstatus
) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from tasks where clientAppId = ? and rowid = ?", [
          clientAppId,
          rowid,
        ]);
        tx.executeSql(
          "insert into tasks (clientAppId,rowid, ismetadata, isstatus, json) values (?,?,?,?,?)",
          [clientAppId, rowid, ismetadata, isstatus, JSON.stringify(json)]
        );
      },
      (t, error) => {
        console.log("db error inserttask");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
        // console.log("task saved" + rowid);
        // setupTaskDetailAsync(clientAppId, rowid, json);
      }
    );
  });
};
//where we insert data into task table
const setupTaskStatusAsync = async (clientAppId, rowid, json, isstatus) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "delete from tasks where clientAppId = ? and isstatus = ?",
          [clientAppId, isstatus]
        );
        tx.executeSql(
          "insert into tasks (clientAppId,rowid, isstatus, json) values (?,?,?,?)",
          [clientAppId, rowid, isstatus, JSON.stringify(json)]
        );
      },
      (t, error) => {
        console.log("db error insert status task");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
        // console.log("task status saved" + rowid);
      }
    );
  });
};

const getTaskStatusAsync = async (rowId) => {
  console.log("rowId", rowId);
  // Loader.isLoading = true;
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tasks where rowid = ?",
          [rowId],
          (_, { rows: { _array } }) => {
            taskData = null;
            alert(JSON.stringify(_array));
            resolve({ taskData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskData;
};

const DeleteTaskAsync = async (rowid) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from tasks where rowid = ?", [rowid]);
        // tx.executeSql( 'insert into tasks (clientAppId,rowid, json) values (?,?,?)', [clientAppId, rowid, JSON.stringify(json)]);
      },
      (t, error) => {
        console.log("db error delete task");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
        console.log("task deleted" + rowid);
      }
    );
  });
};

const setupTaskDetailAsync = async (clientAppId, rowId, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from taskDetail where RowId = ?", [rowId]);
        tx.executeSql(
          "insert into taskDetail (clientAppId, RowId, json) values (?,?,?)",
          [clientAppId, rowId, json]
        );
      },
      (t, error) => {
        console.log("db error inserttaskdetail");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
        console.log("inserted rowid " + rowId);
        // updateTaskListDataAsync(rowId, json);
      }
    );
  });
};

//update here details data into list
const updateTaskListDataAsync = async (rowId, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("update tasks set taskDetail = ? where RowId = ? ", [
          JSON.stringify(json),
          rowId,
        ]);
      },
      (t, error) => {
        console.log("db error update task list data");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
        console.log("updated task list data ");
      }
    );
  });
};

const DeleteTaskDetailAsync = async (clientAppId) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from taskDetail where clientAppId = ?", [
          clientAppId,
        ]);
        //tx.executeSql( 'insert into taskDetail (clientAppId, json) values (?,?)', [clientAppId, json] );
      },
      (t, error) => {
        console.log("db error deletetaskdetail");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};
//
const getTaskDetailAsync = async (rowId) => {
  // console.log("rowId", rowId);
  // Loader.isLoading = true;
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select json from taskDetail where RowId = ?",
          [rowId],
          (tx, results) => {
            //console.log(results.rows._array[0].json);
            taskDetailData = null;
            if (results.rows._array.length > 0) {
              taskDetailData = results.rows._array[0].json;
              console.log("Results", taskDetailData);
            }

            resolve({ taskDetailData });
          }
        );
      },
      (t, error) => {
        console.log("db error load taskDetail");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded taskDetail completed");
      }
    );
  });

  return taskData;
};

const getTaskDetailCountAsync = async (clientAppId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from taskDetail where clientAppId = ?",
          [clientAppId],
          (tx, results) => {
            taskDetailDataCount = null;
            // console.log("task detail result " + results);
            taskDetailDataCount = results.rows.length;

            resolve({ taskDetailDataCount });
          }
        );
      },
      (t, error) => {
        console.log("db error load taskDetail");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded taskDetail completed");
      }
    );
  });

  return taskData;
};

const getTaskDataJSONAsync = async (clientAppId) => {
  //alert(clientAppId);
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tasks where clientAppId = ? and rowid > 1 ",
          [clientAppId],
          (_, { rows: { _array } }) => {
            taskData = null;
            let d = [];

            for (let i = 0; i < _array.length; i++) {
              let item = JSON.parse(_array[i].json);
              //item.isExpand = false;
              d.push(item);
            }
            if (d.length > 0) {
              taskData = d;
            }
            resolve({ taskData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages get task");
      }
    );
  });

  return taskData;
};

const getTaskDataJSONForOnlineAsync = (clientAppId, onsucess) => {
  //alert(clientAppId);
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tasks where clientAppId = ? and rowid > 1",
          [clientAppId],
          (_, { rows: { _array } }) => {
            taskData = null;
            let d = [];
            for (let i = 0; i < _array.length; i++) {
              let item = JSON.parse(_array[i].json);
              //item.isExpand = false;
              d.push(item);
            }

            if (d.length > 0) taskData = d;

            resolve({ taskData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskData;
};

const getTaskMetaDataJSONAsync = async (clientAppId) => {
  //alert(clientAppId);
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tasks where clientAppId = ? and ismetadata = 1",
          [clientAppId],
          (_, { rows: { _array } }) => {
            taskData = null;
            //alert(JSON.parse(_array[0].json).DatasetTimeStamp);

            if (_array.length > 0) taskData = JSON.parse(_array[0].json);

            resolve({ taskData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskData;
};
const getTaskStatusChartJSONAsync = async (clientAppId) => {
  //alert(clientAppId);
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tasks where clientAppId = ? and isstatus = 1",
          [clientAppId],
          (_, { rows: { _array } }) => {
            taskData = null;

            if (_array.length > 0) taskData = JSON.parse(_array[0].json);

            resolve({ taskData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskData;
};
const getTaskAsync = async (clientAppId) => {
  //alert(clientAppId);
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tasks where clientAppId = ?",
          [clientAppId],
          (_, { rows: { _array } }) => {
            taskData = null;
            if (_array.length > 0) taskData = _array[0].json;

            resolve({ taskData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskData;
};
const setupTaskActivityAsync = async (groupAppId, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from activityJSON where groupAppId = ?", [
          groupAppId,
        ]);
        tx.executeSql(
          "insert into activityJSON (groupAppId, json) values (?,?)",
          [groupAppId, JSON.stringify(json)]
        );
      },
      (t, error) => {
        console.log("db error activityJSON");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};
const getTaskActivityAsync = async (groupAppId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from activityJSON where groupAppId = ?",
          [groupAppId],
          (_, { rows: { _array } }) => {
            activityData = null;
            if (_array.length > 0) activityData = _array[0].json;

            resolve({ activityData });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return activityData;
};

const setupTaskDLLAsync = async (groupAppId, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from taskDLL where groupAppId = ?", [groupAppId]);
        tx.executeSql("insert into taskDLL (groupAppId, json) values (?,?)", [
          groupAppId,
          JSON.stringify(json),
        ]);
      },
      (t, error) => {
        console.log("db error taskDLL");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};
const getTaskDLLAsync = async (groupAppId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from taskDLL where groupAppId = ?",
          [groupAppId],
          (_, { rows: { _array } }) => {
            taskDLL = null;
            if (_array.length > 0) taskDLL = _array[0].json;

            resolve({ taskDLL });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return activityData;
};

const setupTaskGroupAsync = async (json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from taskgroup", []);
        tx.executeSql("insert into taskgroup (json) values (?)", [
          JSON.stringify(json),
        ]);
      },
      (t, error) => {
        console.log("db error inserttask");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

const getTaskGroupAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from taskgroup",
          [],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) taskGroup = _array[0].json;

            resolve({ taskGroup });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskGroup;
};

const setPagingDeltaDataAsync = async (json, reportId) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from pagingdeltadata WHERE reportId = ? ", [
          reportId,
        ]);
        tx.executeSql(
          "insert into pagingdeltadata (reportId,json) values (?,?)",
          [reportId, JSON.stringify(json)]
        );
      },
      (t, error) => {
        console.log("db error inserttask");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

const getPagingDeltaDataAsync = async (reportId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from pagingdeltadata WHERE reportId = ? ",
          [reportId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) taskGroup = _array[0].json;

            resolve({ taskGroup });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return taskGroup;
};

const setSaveTaskDataAsync = async (timestamp, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into savetask (timestamp, json) values (?,?)", [
          timestamp,
          JSON.stringify(json),
        ]);
      },
      (t, error) => {
        console.log("db error save local task");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

const DeleteSaveTaskDataAsync = async (timestamp) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from savetask WHERE timestamp = ? ", [timestamp]);
      },
      (t, error) => {
        console.log("db error delete task local");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

const DeleteAllSaveTaskDataAsync = async () => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from savetask ", []);
      },
      (t, error) => {
        console.log("db error delete task");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

const getSaveTaskDataAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from savetask ",
          [],
          (_, { rows: { _array } }) => {
            saveTask = null;
            if (_array.length > 0) saveTask = _array[0].json;

            resolve({ saveTask });
          }
        );
      },
      (t, error) => {
        console.log("db error load messages");
        console.log(error);
      },
      (_t, _success) => {
        console.log("loaded messages");
      }
    );
  });

  return saveTask;
};

const saveTaskCategoryToLocal = async (groupAppId, json) => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "delete from tabletaskCategory where group_id = ?",
          [groupAppId],
          () => {
            console.log("log deleted");
          },
          () => {
            console.log("table task category delete record error");
          }
        );
        json.map((item) => {
          console.log("item inserted " + groupAppId + " = " + item.ID);
          tx.executeSql(
            "insert into tabletaskCategory (group_id, server_id, category_text, items) values (?,?,?,?)",
            [groupAppId, item.ID, item.text, JSON.stringify(item)],
            (tx, rs) => {
              console.log("data inserted " + rs.insertId);
            },
            (t, error) => {
              console.log("data insertion errror " + error);
            }
          );
        });
        //tx.executeSql( 'delete from activityJSON where groupAppId = ?',[groupAppId]);
        // tx.executeSql( 'insert into activityJSON (groupAppId, json) values (?,?)', [groupAppId, JSON.stringify(json)] );
      },
      (t, error) => {
        // console.log("insert error tabletaskCategory ");
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

const getTaskCategoryFromLocal = async (groupAppId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "select * from tabletaskCategory where group_id = ?",
          [groupAppId],
          (_, { rows: { _array } }) => {
            activityData = null;
            if (_array.length > 0) activityData = _array;

            resolve({ activityData });
          },
          (t, error) => {
            reject("error reading data");
            console.log("TaskCategoryFromLocalerr " + JSON.stringify(error));
          }
        );
      },
      (t, error) => {
        console.log("get db error TaskCategoryFromLocal " + groupAppId);
        reject("error " + error);
      },
      (_t, _success) => {
        console.log("loaded messages " + groupAppId);
      }
    );
  });

  return activityData;
};

const dropTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("DROP table tabletaskCategory", () => {
          resolve("");
        });
      },
      (t, error) => {
        console.log("dropTable error ");
        reject("");
      },
      (_t, _success) => {
        console.log("dropTable ");
      }
    );
  });
};

export const database = {
  setupTaskAsync,
  getTaskAsync,
  getTaskDataJSONAsync,
  getTaskMetaDataJSONAsync,
  getTaskStatusChartJSONAsync,
  setupTaskGroupAsync,
  getTaskGroupAsync,
  setupTaskDetailAsync,
  getTaskDetailAsync,
  setPagingDeltaDataAsync,
  getPagingDeltaDataAsync,
  setupTaskActivityAsync,
  getTaskActivityAsync,
  setupTaskDLLAsync,
  getTaskDLLAsync,
  setSaveTaskDataAsync,
  DeleteSaveTaskDataAsync,
  getSaveTaskDataAsync,
  DeleteAllSaveTaskDataAsync,
  getTaskDetailCountAsync,
  DeleteTaskDetailAsync,
  DeleteTaskAsync,
  getTaskDataJSONForOnlineAsync,
  getTaskStatusAsync,
  setupTaskStatusAsync,
  saveTaskCategoryToLocal,
  getTaskCategoryFromLocal,
  dropTable,
};
