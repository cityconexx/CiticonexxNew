import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from "../core/CommonDataManager";
import baseAPI from '../core/baseAPI';
import { database } from '../OfflineData/MessageSyncData';

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
  MyMessage: true,
  SPName: '',
  GroupAppsList: [],
  ReturnReportMetaData: true,
  RowID: 0,
  TaskNameSearchString: '',
  StatusID: 0,
  GroupAppId: 0,
  GroupId: 0,
  AccessLevelId: 0,
  AccountId: 0,
  ReportName: '',
  ReportID: 0,
};
export const requestSetQuery = {
  ActionName: "",
  AdminNotes: "",
  AppliesToMsgID: 0,
  AppliesToOCID: 0,
  ClientActionRowID: 0,
  ClientID: 0,
  ClientUserGroupAppID: 0,
  ContractorActionRowID: 0,
  ContractorUserGroupAppID: 0,
  CreatedByUserID: 0,
  CreatedDate: null,
  JobNumber: 0,
  LastUpdatedDate: null,
  ModuleId: 0,
  MsgDraftText: "",
  MsgDraftTextAdmin: null,
  MsgID: 0,
  MsgNumber: 0,
  MsgStatus: "",
  MsgStatusID: 0,
  MsgSubject: "",
  MsgText: "",
  MsgTypeID: 0,
  ObjectKey: "",
  ParentOCID: 0,
  RaisedByUserID: 0,
  RaisedByUserName: "",
  SignedInUserID: 0,
  UpdatedByUserID: 0,
  UpdatedDate: null,
  UserGroupAppID: 363,
  UserID: 0
}
export const requestTaskMessageModel = {
  ActionRowID: 0,
  AppliesToOCID: 0,
  ClientIDToGet: 0,
  ClientId: 0,
  DataSetName: "",
  ModuleID: 0,
  SignedInUserId: 0,
  UserId: 0
}
export const requestGetQuery = {
  AppliesToOCID: 0,
  ClientID: 0,
  QueryID: 0,
  SignedInUserId: 0,
  UserId: 0
}
export const requestMessageModel = {
  SignedInUserID: 0,
  UserID: 0,
  ClientID: 0,
  MsgIDList: []
}
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
  Parameters: '',
  Fields: '',
  LastUpdatedDate: null,
  UpdatedDate: null,
  SPName: ''
}

export default class DynamicMessageData {

  static myInstance = null;


  _TaskData = {};
  _MessageData = {};

  /**
  * @returns {DynamicMessageData}
  */
  static getInstance() {
    if (DynamicMessageData.myInstance == null) {
      DynamicMessageData.myInstance = new DynamicMessageData();
    }

    return this.myInstance;
  }


  setMessageFunc = async (data) => {
    alert(JSON.stringify(data));
    this._TaskData = data.Result.TaskList.QueryData;
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
    UserReadStatusModel.SPName = 'setKeyUserReadStatus';
    console.log(UserReadStatusModel);
    const onSuccess = async ({ data }) => {

      if (data.Result.ErrorMessage != '' && data.Result.ErrorMessage != null || data.Result.Errors.length > 0) {

        alert(data.Result.ErrorMessage ? data.Result.ErrorMessage : data.Result.Errors[0]);
        return false;

      }
      return await true;

    };

    const onFailure = error => {

      return false;
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
    };

    baseAPI.post('Task/SetActivityActions/', UserReadStatusModel)
      .then(onSuccess)
      .catch(onFailure);

  }
  getDynamicMessageDetailData = async (msgIds) => {

    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();


    let taskIds = msgIds;


    requestMessageModel.SignedInUserID = userData.SignedInUserId;
    requestMessageModel.UserID = userData.UserId;
    requestMessageModel.ClientID = clientDetail.ClientID;
    requestMessageModel.MsgIDList = taskIds;


    const onSuccess = ({ data }) => {
      console.log(data.Result.Errors);
      if (data.Result.ErrorMessage != '' && data.Result.ErrorMessage != null || data.Result.Errors.length > 0) {

        alert(data.Result.ErrorMessage ? data.Result.ErrorMessage : data.Result.Errors[0]);
        return false;

      }
      //alert(JSON.stringify(data));
      //database.setupMessageDetailAsync(data.Result.MessageDetailJSON);
      data.Result.DataList.forEach(element =>
        database.setupMessageDetailAsync(element.RowID, element.RowJSON)
      );

    };

    const onFailure = error => {

      //alert(JSON.stringify(error.response));
      console.log(error && error.response);
      //this.setState({errors: error.response.data, isLoading: false});
    };

    baseAPI.post('Task/GetMessageDetailsJSONForOffline/', requestMessageModel)
      .then(onSuccess)
      .catch(onFailure);

  }
  getDynamicMessageListData = async () => {
    // alert('calling function');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    let moduleData = await commonData.getModuleDetail();

    let groupAppList = moduleData.map(e => e.GroupAppID);
    requestModel.SignedInUserId = userData.SignedInUserId;
    requestModel.UserId = userData.UserId;
    requestModel.ClientId = clientDetail.ClientID;
    requestModel.GroupAppsList = groupAppList;
    requestModel.ReportID = 60;

    //alert(JSON.stringify(requestModel));
    //alert(JSON.stringify(commonData.getClientAppData()));

    const onSuccess = ({ data }) => {

      if (data.Result.ErrorMessage != '' && data.Result.ErrorMessage != null || data.Result.Errors.length > 0) {

        alert(data.Result.ErrorMessage ? data.Result.ErrorMessage : data.Result.Errors[0]);
        return false;

      }
      //alert(JSON.stringify(data.Result.DataList));
      database.setupMessageAsync(0, data.Result.MetaData);
      data.Result.DataList.forEach(element =>
        database.setupMessageAsync(element.RowID, element.RowJSON)
      );

      let msgIds = data.Result.DataList.map(e => e.RowID);
      //alert(JSON.stringify(taskids));
      //let taskIds = data.TaskList.QueryData.map(e=>e.RowID);

      this.getDynamicMessageDetailData(msgIds);
      this._TaskData = data.Result;
    };

    const onFailure = error => {
      //alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error);
      this.setState({ errors: error, isLoading: false });
    };

    await baseAPI.post('Task/GetDynamicTaskListMobile/', requestModel)
      .then(onSuccess)
      .catch(onFailure);



    return this._TaskData;
  }


  async getDynamicTaskMessageListData(onmsgsuccess) {
    // alert('calling function');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    let moduleData = await commonData.getModuleDetail();

    let groupAppList = moduleData.map(e => e.GroupAppID);
    requestTaskMessageModel.SignedInUserId = userData.SignedInUserId;
    requestTaskMessageModel.UserId = userData.UserId;
    requestTaskMessageModel.ClientId = clientDetail.ClientID;
    requestTaskMessageModel.ClientIDToGet = clientDetail.ClientID;;

    //alert(JSON.stringify(requestTaskMessageModel));
    //alert(JSON.stringify(commonData.getClientAppData()));

    const onSuccess = ({ data }) => {
      //alert(JSON.stringify(data));
      if (data.Errors?.length > 0) {

        alert(data.Errors[0]);
        return false;

      }

      onmsgsuccess(data.Result.QueryData);
    };

    const onFailure = error => {
      //alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error);
      this.setState({ errors: error, isLoading: false });
    };

    await baseAPI.post('Common/GetClientQueriesList/', requestTaskMessageModel)
      .then(onSuccess)
      .catch(onFailure);



    return this._TaskData;
  }

  async getDynamicGetQueryData(ongetquerysuccess) {
    // alert('calling function');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    requestGetQuery.SignedInUserId = userData.SignedInUserId;
    requestGetQuery.UserId = userData.UserId;
    requestGetQuery.ClientID = clientDetail.ClientID;


    //alert(JSON.stringify(requestGetQuery));
    //alert(JSON.stringify(commonData.getClientAppData()));

    const onSuccess = ({ data }) => {

      if (data.Errors?.length > 0) {

        alert(data.Errors[0]);
        return false;

      }

      ongetquerysuccess(data.Result.ClientQuery);
    };

    const onFailure = error => {
      //alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error);
      this.setState({ errors: error, isLoading: false });
    };

    await baseAPI.post('Common/GetQuery/', requestGetQuery)
      .then(onSuccess)
      .catch(onFailure);



    return this._TaskData;
  }

  async getDynamicSetQueryData(onsetquerysuccess) {
    // alert('calling function');
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    requestSetQuery.SignedInUserID = userData.SignedInUserId;
    requestSetQuery.UserID = userData.UserId;
    requestSetQuery.SignedInUserId = userData.SignedInUserId;
    requestSetQuery.UserId = userData.UserId;
    requestSetQuery.ClientID = clientDetail.ClientID;
    requestSetQuery.RaisedByUserID = userData.UserId;

    console.log(requestSetQuery);
    //alert(JSON.stringify(commonData.getClientAppData()));

    const onSuccess = ({ data }) => {
      //alert(JSON.stringify(data));
      if (data.Errors?.length > 0) {

        alert(data.Errors[0]);
        return false;
      }

      onsetquerysuccess(true);
    };

    const onFailure = error => {
      alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error);
      //this.setState({errors: error, isLoading: false});
    };

    await baseAPI.post('Common/SetQuery/', requestSetQuery)
      .then(onSuccess)
      .catch(onFailure);



    return this._TaskData;
  }
}