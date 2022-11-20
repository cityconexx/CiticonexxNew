import CommonDataManager from "../core/CommonDataManager";
import baseAPI from "../core/baseAPI";
import { database } from "../OfflineData/TaskSyncData";
import { udatabase } from "../OfflineData/UserAyncDetail";
let retrycount = 0;
// export const Loader = {
//   isLoading: false,
// };
export const requetActivityModel = {
  SignedInUserID: 0,
  UserID: 0,
  ClientID: 0,
  GroupAppID: 0,
  AccessLevelID: 0,
};
export const requetActivityActionModel = {
  SignedInUserID: 0,
  UserID: 0,
  ClientID: 0,
  RowID: 0,
  UserGroupAppID: 0,
  ReportName: "",
  SPName: "",
  ReportID: 0,
  ActionID: 0,
  GroupAppID: 0,
  TaskID: 0,
  AccessLevelID: 0,
  TimeZone: "",
  UTCOffSet: 0,
};

export const UserReadStatusModel = {
  SignedInUserID: 0,
  UserID: 0,
  ClientID: 0,
  UserGroupAppID: 0,
  ActionID: 0,
  ReportID: 0,
  RowID: 0,
  RowIDKeyTypeID: 0,
  ActionRowID: 0,
  ActionRowIDKeyTypeID: 0,
  KeyID: 0,
  KeyTypeID: 0,
  ActivityID: 0,
  Parameters: "",
  Fields: "",
  LastUpdatedDate: null,
  UpdatedDate: null,
  SPName: "",
};
export const requestActionModel = {
  SignedInUserID: 0,
  UserID: 0,
  ClientID: 0,
  ActionRowID: 0,
  ForMultiRows: 0,
  PermissionID: 0,
  ReportID: 0,
  RowID: 0,
  ServiceNodeTypeID: 0,
};
export const requestTaskDetailModel = {
  SignedInUserId: 0,
  UserId: 0,
  ClientId: 0,
  AccessLevelId: 0,
  AccountId: 0,
  UserGroupAppID: 0,
  GroupId: 0,
  TaskID: 0,
  RowID: 0,
  ActionRowID: 0,
  PermissionID: 0,
  ModuleId: 0,
  StatusCode: 0,
  ModuleFeature: "",
  GetTaskDetailDropdowns: true,
};
export const requestTaskSaveModel = {
  SignedInUserId: 0,
  UserId: 0,
  ClientId: 0,
  ActivityTypeID: 0,
  ActivityTypeTaskID: 0,
  TaskID: 0,
  GroupAppID: 0,
  TaskNumber: 0,
  TaskStatusID: 0,
  TaskName: "",
  AssignedToUserID: 0,
  Priority: 0,
  StartDate: "",
  Description: "",
  LocationID: 0,
  ItemTypeId: 0,
  OriginalFileName: "",
  Image: "",
  TimeZone: "",
  UTCOffSet: 0,
  ManagerUserID: 0,
  UpdatedDate: null,
  LastUpdatedDate: null,
  AppliesToOCID: 0,
  ServiceNodeType: 0,
  Lat: 0,
  Long: 0,
};
export const requestTaskDLLModel = {
  SignedInUserId: 0,
  UserId: 0,
  ClientId: 0,
  ModuleId: 0,
  TaskID: 0,
  GroupId: 0,
  GroupAppId: 0,
  AccessLevelId: 0,
  StatusCode: 0,
  ModuleFeature: "",
  ItemTypeId: 0,
  GetTaskDetailDropdowns: true,
};
export const requestModel = {
  AssignedToUserID: 0,
  SignedInUserId: 0,
  UserId: 0,
  ClientId: 0,
  ClientAppID: 0,
  TaskNumber: 0,
  OnlyActive: true,
  QueueID: 0,
  PageNum: 1,
  PageSize: 1000,
  MyMessage: false,
  SPName: "",
  GroupAppsList: [],
  ReturnReportMetaData: true,
  RowID: 0,
  TaskNameSearchString: "",
  StatusID: 0,
  GroupAppId: 0,
  GroupId: 0,
  AccessLevelId: 0,
  AccountId: 0,
  ReportName: "",
  ReportID: 0,
  DeltaDateTime: null,
};

export const requestTaskModel = {
  SignedInUserID: 0,
  UserID: 0,
  ClientID: 0,
  TaskIDList: [],
  MsgIDList: [],
};

export default class DynamicTaskData {
  static myInstance = null;

  _TaskData = {};
  _TaskDLLData = {};
  _ActivityData = {};
  _SaveTaskResponse = {};
  _ActionData = null;
  _TaskDetail = null;

  /**
   * @returns {DynamicTaskData}
   */
  static getInstance() {
    if (DynamicTaskData.myInstance == null) {
      DynamicTaskData.myInstance = new DynamicTaskData();
    }

    return this.myInstance;
  }

  setMessageFunc = async (data) => {
    //alert(JSON.stringify(data));
    this._TaskData = data.Result.TaskList.QueryData;
  };

  getActionData = async (reportID, itemData) => {
    //alert('funciton calling');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    //alert(reportID);
    requestActionModel.SignedInUserID = userData.SignedInUserId;
    requestActionModel.UserID = userData.UserId;
    requestActionModel.ClientID = clientDetail.ClientID;
    requestActionModel.ActionRowID = itemData.ActionRowID;
    requestActionModel.ForMultiRows = 0;
    requestActionModel.PermissionID = 20;
    requestActionModel.ReportID = reportID;
    requestActionModel.RowID = itemData.RowID;
    requestActionModel.ServiceNodeTypeID = itemData.ServiceNodeTypeID;

    //console.log(requestTaskModel);
    //alert(JSON.stringify(requestActionModel));

    const onSuccess = ({ data }) => {
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }
      this._ActionData = JSON.parse(d).Actions;
      //alert(JSON.stringif(this._ActionData));
    };

    const onFailure = (error) => {
      //alert('failed');
      //alert(JSON.stringify(error));
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
    };

    baseAPI
      .post("Task/GetActivityActions/", requestActionModel)
      .then(onSuccess)
      .catch(onFailure);

    return this._ActionData;
  };

  async getDynamicTaskData(taskIds, ontaskdetailsuccess) {
    udatabase.addlog(
      "save task detail function called with task ids" + JSON.stringify(taskIds)
    );
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    requestTaskModel.SignedInUserID = userData.SignedInUserId;
    requestTaskModel.UserID = userData.UserId;
    requestTaskModel.ClientID = clientDetail.ClientID;
    requestTaskModel.TaskIDList = taskIds;

    //loader on----
    //this.setState({isLoading:true});
    const onSuccess = ({ data }) => {
      udatabase.addlog("task detail offline data api called with success");
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }

      console.log("detail inserting now");
      //database.DeleteTaskDetailAsync(requestModel.ClientAppID);

      data.Result.DataList.forEach((element) =>
        database.setupTaskDetailAsync(
          requestModel.ClientAppID,
          element.RowID,
          element.RowJSON
        )
      );

      this.retrycount = 0;
      ontaskdetailsuccess(true);
    };

    const onFailure = (error) => {
      udatabase.addlog(
        "get task detail data from server called api failed" +
          JSON.stringify(requestTaskModel)
      );
      //   console.log(error && error.response);
      //   alert(this.retrycount);
      //    console.log('retrycount', this.retrycount);
      //   if(retrycount < 3){
      //     this.getDynamicTaskData(taskIds, ontaskdetailsuccess);
      //     this.retrycount = this.retrycount + 1;
      //   }

      //  if(this.retrycount > 2)
      ontaskdetailsuccess(true);

      this.retrycount = this.retrycount + 1;
      udatabase.addlog("task detail retry count" + retrycount);
    };

    udatabase.addlog(
      "task detail offline data api calling with task ids" +
        JSON.stringify(requestTaskModel)
    );
    baseAPI
      .post("Task/GetTaskDetailsJSONForOffline/", requestTaskModel)
      .then(onSuccess)
      .catch(onFailure);

    //return this._TaskDetail;
  }

  //need to insert details data here
  async getDynamicTaskDetailData(taskIds, ismsg, ontaskdetailsuccess) {
    udatabase.addlog(
      "save task detail function called with task ids" + JSON.stringify(taskIds)
    );
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    let moduleData = await commonData.getModuleDetail();

    let groupAppList = moduleData.map((e) => e.GroupAppID);

    requestTaskModel.SignedInUserID = userData.SignedInUserId;
    requestTaskModel.UserID = userData.UserId;
    requestTaskModel.ClientID = clientDetail.ClientID;
    if (ismsg) requestTaskModel.MsgIDList = taskIds;
    else requestTaskModel.TaskIDList = taskIds;

    //loader on----
    //this.setState({isLoading:true});
    let APIName =
      ismsg == true
        ? "GetMessageDetailsJSONForOffline"
        : "GetTaskDetailsJSONForOffline";
    // console.log("second time call");
    const onSuccess = ({ data }) => {
      // console.log("second time call after success");
      udatabase.addlog("task detail offline data api called with success");

      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }

      console.log("detail inserting now");
      //database.DeleteTaskDetailAsync(requestModel.ClientAppID);
      var taskDetail = data.Result.DataList[0].RowJSON;
      // alert(JSON.stringify(data.Result.DataList));
      data.Result.DataList.forEach((element) =>
        database.setupTaskDetailAsync(
          requestModel.ClientAppID,
          element.RowID,
          element.RowJSON
        )
      );

      this.retrycount = 0;
      ontaskdetailsuccess(taskDetail);
    };

    const onFailure = (error) => {
      udatabase.addlog(
        "get task detail data from server called api failed" +
          JSON.stringify(requestTaskModel)
      );
      //   console.log(error && error.response);
      //   alert(this.retrycount);
      //    console.log('retrycount', this.retrycount);
      //   if(retrycount < 3){
      //     this.getDynamicTaskData(taskIds, ontaskdetailsuccess);
      //     this.retrycount = this.retrycount + 1;
      //   }

      //  if(this.retrycount > 2)
      ontaskdetailsuccess(true);

      this.retrycount = this.retrycount + 1;
      udatabase.addlog("task detail retry count" + retrycount);
    };

    udatabase.addlog(
      "task detail offline data api calling with task ids" +
        JSON.stringify(requestTaskModel)
    );
    baseAPI
      .post("Task/" + APIName + "/", requestTaskModel)
      .then(onSuccess)
      .catch(onFailure);

    //return this._TaskDetail;
  }
  async SetActivityAction(onactionsuccess) {
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    requetActivityActionModel.SignedInUserID = userData.SignedInUserId;
    requetActivityActionModel.UserID = userData.UserId;
    requetActivityActionModel.ClientID = clientDetail.ClientID;
    requetActivityActionModel.UTCOffSet = clientDetail.UTCOffSet;
    requetActivityActionModel.TimeZone = clientDetail.TimeZone;

    console.log(JSON.stringify(requetActivityActionModel));
    //alert(JSON.stringify(requestTaskSaveModel));

    const onSuccess = ({ data }) => {
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }

      onactionsuccess(true);
    };

    const onFailure = (error) => {
      //alert(JSON.stringify(error.response));
      //console.log(error && error.response);
    };

    baseAPI
      .post("Task/SetActivityActions/", requetActivityActionModel)
      .then(onSuccess)
      .catch(onFailure);
  }
  async SaveTaskData(ontasksave, onError) {
    //alert('funciton calling');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    //alert(JSON.stringify(clientDetail));

    requestTaskSaveModel.SignedInUserId = userData.SignedInUserId;
    requestTaskSaveModel.ManagerUserID = userData.UserId;
    requestTaskSaveModel.UserId = userData.UserId;
    requestTaskSaveModel.ClientId = clientDetail.ClientID;
    requestTaskSaveModel.UTCOffSet = clientDetail.UTCOffset;
    requestTaskSaveModel.TimeZone = clientDetail.Timezone;

    console.log("request model", JSON.stringify(requestTaskSaveModel));
    let timestamp = Math.round(new Date().getTime() / 1000);
    //await database.setSaveTaskDataAsync(timestamp.toString(), JSON.stringify(requestTaskSaveModel));
    //alert(JSON.stringify(requestTaskSaveModel));
    const onSuccess = ({ data }) => {
      //alert(JSON.stringify(data));
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        ontasksave(data);
      }
      this._SaveTaskResponse = data;
      ontasksave(data);
      //database.DeleteSaveTaskDataAsync(timestamp);
    };

    const onFailure = (error) => {
      udatabase.addlog(
        "save task data from server called api failed" +
          JSON.stringify(requestTaskSaveModel)
      );
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
      onError(error);
    };

    baseAPI
      .post("Task/SetTask/", requestTaskSaveModel)
      .then(onSuccess)
      .catch(onFailure);
    //return this._SaveTaskResponse ;
  }
  async getActivityData(onSuccessActivity) {
    //alert('funciton calling');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let moduleData = await commonData.getModuleDetail();
    let clientDetail = await commonData.getClientDetail();

    requetActivityModel.SignedInUserID = userData.SignedInUserId;
    requetActivityModel.UserID = userData.UserId;
    requetActivityModel.ClientID = clientDetail.ClientID;

    const onSuccess = ({ data }) => {
      //alert(JSON.stringify(data.Result));
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }
      database
        .saveTaskCategoryToLocal(
          requetActivityModel.GroupAppID,
          data.Result.ActivityTypesJSON
        )
        .then(() => {
          this._ActivityData = data.Result.ActivityTypesJSON;
          onSuccessActivity(data.Result.ActivityTypesJSON);
        })
        .catch((err) => {
          this._ActivityData = data.Result.ActivityTypesJSON;
          onSuccessActivity(data.Result.ActivityTypesJSON);
        });

      // let activityData = database.getTaskActivityAsync(requetActivityModel.GroupAppID);
      // if(!activityData){

      // }
      // else
      // {
      //   this._ActivityData = JSON.parse(activityData.activityData);
      // }
    };

    const onFailure = (error) => {
      //alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
    };

    baseAPI
      .post("Task/GetActivityTypesJSON/", requetActivityModel)
      .then(onSuccess)
      .catch(onFailure);

    //return this._ActivityData;
  }

  async getTaskDLLData(ondllsuccess) {
    // console.log("funciton calling");
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let moduleData = await commonData.getModuleDetail();
    let clientDetail = await commonData.getClientDetail();

    requestTaskDLLModel.SignedInUserId = userData.SignedInUserId;
    requestTaskDLLModel.UserId = userData.UserId;
    requestTaskDLLModel.ClientId = clientDetail.ClientID;
    //alert(JSON.stringify(requestTaskDLLModel));

    const onSuccess = async ({ data }) => {
      this._TaskDLLData = await data.Result;
      console.log("result", JSON.stringify(data.Result));
      database.setupTaskDLLAsync(requestTaskDLLModel.GroupAppId, data.Result);

      ondllsuccess(this._TaskDLLData);
      //console.log(data.Result.TaskDetailJSON);
      //database.setupTaskDetailAsync(requestModel.ClientAppID,data.Result.TaskDetailJSON);
    };

    const onFailure = (error) => {
      // alert("failed");
      udatabase.addlog("get task dropdown data from server called api failed");
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
    };

    baseAPI
      .post("Task/GetTaskDDL/", requestTaskDLLModel)
      .then(onSuccess)
      .catch(onFailure);

    //return this._TaskDLLData;
  }
  //task Load function
  async getDynamicTaskListData(groupAppID, ontasksuccess) {
    //alert(groupAppID);
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    let clientAppData = await commonData.getClientAppData();
    let moduleData = await commonData.getModuleDetail();

    let _groupAppList = moduleData.map((e) => e.GroupAppID);
    let metadata = await database.getTaskMetaDataJSONAsync(
      requestModel.ClientAppID
    );

    if (metadata.taskData && metadata.taskData.DoDeltaRefresh == "True") {
      const timeStamp = metadata.taskData.DatasetTimeStamp;
      requestModel.DeltaDateTime = new Date(timeStamp);
    } else {
      requestModel.DeltaDateTime = null;
    }

    let groupAppList = clientAppData.filter(
      (e) => e.ClientAppID == requestModel.ClientAppID
    )[0].GroupAppsList;
    groupAppList = groupAppList.split(",");
    // groupAppList = [363];
    //requestModel.GroupId = 675;
    //requestModel.ReportID = 60;
    requestModel.SignedInUserId = userData.SignedInUserId;
    requestModel.UserId = userData.UserId;
    requestModel.ClientId = clientDetail.ClientID;

    if (groupAppID && groupAppID > 0) {
      requestModel.GroupAppsList.push(parent(groupAppID));
      requestModel.GroupAppId = groupAppID;
    } else {
      //alert(groupAppList.length);
      requestModel.GroupAppsList = groupAppList;
      if (groupAppList.length > 1) {
        //
      } else {
        requestModel.GroupAppId = +groupAppList[0];
      }
    }
    requestModel.GroupAppsList =
      requestModel.MyMessage == true
        ? _groupAppList
        : requestModel.GroupAppsList;
    //alert(JSON.stringify(requestModel));
    console.log(requestModel);
    this._TaskData = null;
    const onSuccess = async ({ data }) => {
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }
      //alert('task list calling');
      console.log("MetaData");
      //alert(requestModel.ClientAppID);
      //requestModel.ClientAppID, data.Result.TaskList.QueryData

      if (data.Result.DataList.length > 0) {
        await database.setupTaskAsync(
          requestModel.ClientAppID,
          0,
          data.Result.MetaData,
          1,
          0
        );
        await database.setupTaskAsync(
          requestModel.ClientAppID,
          1,
          data.Result.StatusChart,
          0,
          1
        );
        //alert(JSON.stringify(data.Result.MetaData));
        data.Result.DataList.forEach((element) => {
          database.setupTaskAsync(
            requestModel.ClientAppID,
            element.RowID,
            element.RowJSON,
            0,
            0
          );
          var rowJSON = JSON.parse(element.RowJSON);
          if (
            data.Result.MetaData.ProcessDelete == "True" &&
            rowJSON.DeleteRowID == 1
          ) {
            database.DeleteTaskAsync(element.RowID);
          }
        });

        let taskids = data.Result.DataList.map((e) => e.RowID);
        this._TaskData = data.Result;
        udatabase.addlog("get task data from server api call succeed");
        let _taskdata = await database.getTaskDataJSONAsync(
          requestModel.ClientAppID
        );

        _taskdata = _taskdata.taskData;

        const item_array = [data.Result.MetaData, _taskdata];
        let ismsg = requestModel.SPName == "getMessagesForUser" ? true : false;
        this.getDynamicTaskDetailData(taskids, ismsg, (r) => {});
        ontasksuccess(item_array);

        // let a =  this.getDynamicTaskData(taskids, async() =>{

        //    let _taskdata =  await database.getTaskDataJSONAsync(requestModel.ClientAppID);
        //     //alert(JSON.stringify(_taskdata));
        //    _taskdata = _taskdata.taskData;
        //   const item_array = [data.Result.MetaData,_taskdata];
        //   ontasksuccess(item_array);

        // } );
      } else {
        ontasksuccess(this._TaskData);
      }
      //return _TaskData;
    };

    const onFailure = (error) => {
      //alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error && error.response);
      udatabase.addlog(
        "save task data from server called api failed request" +
          JSON.stringify(requestModel)
      );
      this.setState({ isLoading: false });
      ontasksuccess(null);
    };

    await baseAPI
      .post("Task/GetDynamicTaskListMobile/", requestModel)
      .then(onSuccess)
      .catch(onFailure);

    //return this._TaskData;
  }

  SetKeyUserReadStatus = async (rowId) => {
    //alert('funciton calling');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    UserReadStatusModel.SignedInUserID = userData.SignedInUserId;
    UserReadStatusModel.UserID = userData.UserId;
    UserReadStatusModel.ClientID = clientDetail.ClientID;
    UserReadStatusModel.UpdatedDate = new Date();
    UserReadStatusModel.SPName = "setKeyUserReadStatus";
    console.log(UserReadStatusModel);
    const onSuccess = async ({ data }) => {
      if (
        (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) ||
        data.Result.Errors.length > 0
      ) {
        alert(
          data.Result.ErrorMessage
            ? data.Result.ErrorMessage
            : data.Result.Errors[0]
        );
        return false;
      }
      return true;
    };

    const onFailure = (error) => {
      return false;
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
    };

    baseAPI
      .post("Task/SetActivityActions/", UserReadStatusModel)
      .then(onSuccess)
      .catch(onFailure);
  };
}
