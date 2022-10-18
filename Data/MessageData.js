import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDataManager from "../core/CommonDataManager";
import baseAPI from '../core/baseAPI';
import { database } from '../OfflineData/MessageSyncData';

export const messageRequestModel = {
  ClientID: 0,
  QueryID: 0,
  RowID: 0,
  ActionRowID: 0,
  PermissionID: 40,
  AppliesToOCID: 1020,

};

export default class MessageData {

  static myInstance = null;


  _MessageData = {};


  /**
  * @returns {MessageData}
  */
  static getInstance() {
    if (MessageData.myInstance == null) {
      MessageData.myInstance = new MessageData();
    }

    return this.myInstance;
  }

  setMessageFunc = async (data) => {
    alert(JSON.stringify(data));
    this._MessageData = data;
  }

  getMessageData = async () => {
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();
    let moduleData = await commonData.getModuleDetail();
    let groupAppList = moduleData.map(e => e.GroupAppID);

    messageRequestModel.ClientID = clientDetail.ClientID;
    //alert(JSON.stringify(messageRequestModel));

    const onSuccess = ({ data }) => {
      //alert(JSON.stringify(data));
      if (data.Result.ErrorMessage != '' && data.Result.ErrorMessage != null) {
        alert(data.Result.ErrorMessage);
        return false;

      }

      //database.setupMessageAsync(data.Result.MessageData);
      //database.getMessagesAsync(setMessageFunc);

      //this._MessageData = data.Result.MessageData;

    };

    const onFailure = error => {
      //alert('failed');
      //alert(JSON.stringify(error.response));
      console.log(error && error.response);
      this.setState({ errors: error.response.data, isLoading: false });
    };

    await baseAPI.post('Task/GetMessage/', messageRequestModel)
      .then(onSuccess)
      .catch(onFailure);

    return this._MessageData;
  };

};