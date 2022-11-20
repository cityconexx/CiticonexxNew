import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Block, NavBar, Text, Input, theme } from "galio-framework";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from "../components/";

import { AntDesign, MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";

import DynamicTaskData, {
  requestModel,
  // Loader,
  requetActivityModel,
  requetActivityActionModel,
  UserReadStatusModel,
} from "../Data/DynamicTaskData";
import NetInfo from "@react-native-community/netinfo";
import { database } from "../OfflineData/TaskSyncData";
import { Appearance } from "react-native";

import RenderHtml from "react-native-render-html";
import { format } from "date-fns";
import CommonDataManager from "../core/CommonDataManager";
import Spinner from "react-native-loading-spinner-overlay";
import { udatabase } from "../OfflineData/UserAyncDetail";
import Toast from "react-native-toast-message";
import Modal from "react-native-modal";

var tasktimer = null;
export default class Tasks extends React.Component {
  constructor(props) {
    super(props);
    //commit changes in 6 June
    //alert(JSON.stringify(props));
    //alert(this.props.route.params.GroupAppID);
    this.state = {
      actions: null,
      taskDetail: null,
      messageDetail: null,
      taskData: null,
      taskfullData: null,
      groupAppID: 0,
      isexpand: "false",
      isSearchShow: false,
      pageSize: 200,
      filterStatus: "",
      loading: false,
      actionloading: false,
      SupportReadStatus: false,
      isActionVisible: false,
      EnableNewRecord: false,
      TaskDetailKeyValue: null,
      MsgDetailKeyValue: null,
      actionName: "",
      searchtext: "",
      ActionRowID: 0,
      SelectedRowId: 0,
      ActionRowIDKeyTypeID: 0,
      RowIDKeyTypeID: 0,
      UserGroupAppID: 0,
      PermissionID: 0,
      currentRowServiceNodeType: 0,
      Mode: "",
      panelNoRowSelect: false,
      isMessageDetailShow: false,
      TypeId: 0,
    };
  }

  async componentDidMount() {
    //this.loadData();

    console.log("run after permission");

    this.setState({ searchtext: "" });
    // udatabase.addlog("componentDidMount called");
    this.focusListener = this.props.navigation.addListener("focus", (e) => {
      if (this.props.route.params.GroupAppID)
        this.setState({ groupAppID: this.props.route.params.GroupAppID });
      else this.setState({ groupAppID: 0 });

      if (this.props.route.params.Status)
        this.setState({ filterStatus: this.props.route.params.Status });
      else this.setState({ filterStatus: "" });

      if (this.props.route.params.msg) {
        Toast.show({
          type: "success",
          text1: this.props.route.params.msg,
        });
        this.props.route.params.msg = "";
      }

      if (
        this.props.route.params.Type &&
        this.props.route.params.Type == "updated"
      ) {
        console.log("run after permission 5");
        this.loadData("updated");
        console.log("run after permission 2");
      } else {
        console.log("run after permission 3");
        this.loadData("");
        console.log("run after permission 4");
      }
    });
  }
  clearfilter() {
    this.setState({ filterStatus: "" });
    this.loadData("");
  }
  loadData = async (type) => {
    //alert('yes1');
    udatabase.addlog("load data function called");
    let isConnected = true;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
    //alert(isConnected);
    let data = null;
    let pageData = this.props.route.params.pageData;
    //isConnected = false;
    //isConnected = false;
    //if(isConnected){
    let objData = DynamicTaskData.getInstance();
    //this.setState({loading:true});

    data = await database.getTaskDataJSONAsync(
      this.props.route.params.pageData.ClientAppID
    );
    console.log("all data", data.taskData);
    let metadata = await database.getTaskMetaDataJSONAsync(
      this.props.route.params.pageData.ClientAppID
    );

    let iscalledfromServer = false;
    if (
      type != "updated" &&
      data != null &&
      data.taskData &&
      data.taskData.length > 0
    ) {
      if (metadata.taskData) {
        this.setState({
          SupportReadStatus: metadata.taskData.SupportReadStatus,
        });

        this.setState({ Mode: metadata.taskData.Mode });
        this.setState({ EnableNewRecord: metadata.taskData.EnableNewRecord });
        console.log(
          "metadata.taskData.EnableNewRecord",
          metadata.taskData.EnableNewRecord
        );
        if (metadata.taskData && metadata.taskData.DoDeltaRefresh == "True") {
          const timeStamp = metadata.taskData.DatasetTimeStamp;
          requestModel.DeltaDateTime = new Date(timeStamp);
        } else {
          requestModel.DeltaDateTime = null;
        }
      }
      data = data.taskData;

      let taskDetail = await database.getTaskDetailCountAsync(
        this.props.route.params.pageData.ClientAppID
      );
      udatabase.addlog(
        "task detail count called" + taskDetail.taskDetailDataCount
      );
      requetActivityModel.GroupAppID =
        this.props.route.params.pageData.GroupAppsList;
      requetActivityModel.AccessLevelID = 30;
      let d = [];
      for (let i = 0; i < data.length; i++) {
        let item = JSON.parse(data[i]);
        d.push(item);
      }
      udatabase.addlog(
        "task detail data count" + taskDetail.taskDetailDataCount
      );

      if (this.state.filterStatus != "" || this.state.filterStatus == null)
        d = d.filter((e) => e.Status == this.state.filterStatus);

      if (this.props.route.params && this.props.route.params.GroupAppID) {
        d = d.filter((e) => e.GroupAppID == this.props.route.params.GroupAppID);
      }
      //this.setState({loading:false});
      this.setState({ taskData: d });
      this.setState({ taskfullData: d });
    } else if (
      type == "updated" ||
      data.taskData == null ||
      (data.taskData.length == 0 && isConnected)
      // (data.taskData == null && isConnected)
    ) {
      let metadata = await database.getTaskMetaDataJSONAsync(
        this.props.route.params.pageData.ClientAppID
      );

      if (metadata.taskdata && metadata.taskdata.DoDeltaRefresh == "True") {
        const timeStamp = metadata.taskdata.DatasetTimeStamp;
        //alert(timeStamp);
        requestModel.DeltaDateTime = new Date(timeStamp);
      } else {
        requestModel.DeltaDateTime = null;
      }

      data = await this.loadDataFromServer(pageData, (result) => {
        data = result[1];
        iscalledfromServer = true;

        let taskDetail = database.getTaskDetailCountAsync(
          this.props.route.params.pageData.ClientAppID
        );
        //alert(JSON.stringify(taskDetail));
        udatabase.addlog(
          "task detail count called" + taskDetail.taskDetailDataCount
        );
        requetActivityModel.GroupAppID =
          this.props.route.params.pageData.GroupAppsList;
        requetActivityModel.AccessLevelID = 30;

        let d = [];
        // let details=[];
        for (let i = 0; i < data.length; i++) {
          let item = JSON.parse(data[i]);
          d.push(item);
        }

        //

        udatabase.addlog(
          "task detail data count" + taskDetail.taskDetailDataCount
        );

        if (this.state.filterStatus != "" || this.state.filterStatus == null)
          d = d.filter((e) => e.Status == this.state.filterStatus);

        if (this.props.route.params && this.props.route.params.GroupAppID) {
          d = d.filter(
            (e) => e.GroupAppID == this.props.route.params.GroupAppID
          );
        }

        if (tasktimer != null) clearInterval(tasktimer);
        //alert(result[0].AutoDeltaRefreshFrequencySeconds);
        if (result[0].AutoDeltaRefreshFrequencySeconds != "") {
          // console.log("tasktimer is registering");
          tasktimer = setInterval(() => {
            this.refreshData();
            console.log(
              "tasktimer called, Data refersh at - " +
                new Date().toLocaleString()
            );
            udatabase.addlog(
              "tasktimer called, Data refersh at - " +
                new Date().toLocaleString()
            );
          }, parseInt(result[0].AutoDeltaRefreshFrequencySeconds) * 1000);
        }

        this.setState({ loading: false });
        this.setState({ taskData: d });
        this.setState({ taskfullData: d });
      });
    }
  };
  async refreshData() {
    //this.setState({loading:true});
    let pageData = this.props.route.params.pageData;
    requestModel.DeltaDateTime = null;
    //this.setState({loading:true});
    var data = await this.loadDataFromServer(pageData, (result) => {
      //this.setState({loading:false});
      let metadata = result[0];
      let resultdata = result[1];
      let taskDetail = database.getTaskDetailCountAsync(
        this.props.route.params.pageData.ClientAppID
      );
      //alert(JSON.stringify(taskDetail));
      udatabase.addlog(
        "task detail count called" + taskDetail.taskDetailDataCount
      );

      requetActivityModel.GroupAppID =
        this.props.route.params.pageData.GroupAppsList;
      requetActivityModel.AccessLevelID = 30;

      let d = [];
      for (let i = 0; i < resultdata.length; i++) {
        let item = JSON.parse(resultdata[i]);
        d.push(item);
      }
      udatabase.addlog(
        "task detail data count" + taskDetail.taskDetailDataCount
      );

      if (this.state.filterStatus != "" || this.state.filterStatus == null)
        d = d.filter((e) => e.Status == this.state.filterStatus);

      if (this.props.route.params && this.props.route.params.GroupAppID) {
        d = d.filter((e) => e.GroupAppID == this.props.route.params.GroupAppID);
      }

      if (tasktimer != null) clearInterval(tasktimer);

      if (
        tasktimer == null &&
        metadata.AutoDeltaRefreshFrequencySeconds != ""
      ) {
        tasktimer = setInterval(() => {
          this.refreshData();
          udatabase.addlog(
            "tasktimer called, Data refersh at - " + new Date().toLocaleString()
          );
        }, parseInt(metadata.AutoDeltaRefreshFrequencySeconds) * 1000);
      }

      this.setState({ loading: false });
      this.setState({ taskData: d });
      this.setState({ taskfullData: d });
    });
  }

  loadDataFromServer = async (pageData, onservercallback) => {
    this.setState({ loading: true });
    let objData = DynamicTaskData.getInstance();
    requestModel.SPName =
      this.props.route.params.ismsg == true
        ? "getMessagesForUser"
        : this.props.route.params.pageData.ReportSPName; ///requestModel.SPName = 'getMessagesForUser'; this.props.route.params.screenType == 'message' ? 'getMessagesForUser' :
    requestModel.ClientAppID = this.props.route.params.pageData.ClientAppID;
    requestModel.MyMessage =
      this.props.route.params.ismsg == true ? true : false;
    //requestModel.GroupAppId = this.props.route.params.pageData.GroupAppsList;
    requestModel.AccessLevelId = 30;
    requestModel.ReportName = this.props.route.params.pageData.ReportName;
    requestModel.ReportID = this.props.route.params.pageData.ReportID;
    requestModel.GroupId = this.props.route.params.pageData.GroupID;
    requestModel.pageNum = this.state.pageNum;

    this.setState({ loading: true });
    let data = objData.getDynamicTaskListData(
      this.props.route.params.pageData.GroupAppID,
      (result) => {
        this.setState({ loading: false });
        if (result != null) {
          let metaData = result[0];
          let resultData = result[1];

          if (metaData) {
            //alert(JSON.stringify(metaData));
            this.setState({ SupportReadStatus: metaData.SupportReadStatus });
            this.setState({ Mode: metaData.Mode });
            this.setState({ EnableNewRecord: metaData.EnableNewRecord });
            //console.log('metadata.taskData.EnableNewRecord', result.MetaData.EnableNewRecord);
          }

          // let taskdata = [];
          // for(let i=0; i<resultData.length; i++)
          // {
          //   let item  = resultData[i];
          //   //item.isExpand = false;
          //   taskdata.push(item);
          //   //console.log(taskdata);
          // }

          this.setState({ loading: false });
          const item_array = [metaData, resultData];
          onservercallback(item_array);
        } else this.setState({ loading: false });
        //return taskdata;
      }
    );
  };

  async getActions(item, pageData) {
    let objData = DynamicTaskData.getInstance();
    //let data = await objData.getActionData(pageData.ReportID, item);
    console.log(pageData);
    //this.setState({actions:data});
  }

  async loadFurtherPages(pageNum, rowCount, isDeltaLoad) {
    if (rowCount >= (pageNum - 1) * 200) {
      requestModel.PageNum = pageNum;
      let pageData = database.getPagingDeltaDataAsync(
        this.props.route.params.pageData.ReportID
      );
      data = await objData.getDynamicTaskListData(this.state.groupAppID);
      pageNum = pageNum + 1;

      let taskList = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i].RowJSON;
        item.isExpand = false;
        taskList.push(item);
      }

      this.setState({ taskData: taskList });
      this.setState({ taskfullData: taskList });
      //this.loadFurtherPages(pageNum, data.length, isDeltaLoad);
    }
  }

  handleSearch = async (text) => {
    //alert(text);
    this.setState({ searchtext: text });

    if (text) {
      let masterDataSource = this.state.taskfullData;
      var results = [];
      var index;
      var entry;

      text = text.toUpperCase();
      for (index = 0; index < masterDataSource.length; ++index) {
        entry = masterDataSource[index];
        //alert(entry.Number);
        if (
          entry &&
          entry.Number &&
          entry.Number.toString().indexOf(text) !== -1
        ) {
          results.push(entry);
        }
      }
      //alert(results.length);
      if (results.length == 0) {
        for (index = 0; index < masterDataSource.length; ++index) {
          entry = masterDataSource[index];
          if (
            entry &&
            entry.Title &&
            entry.Title.toUpperCase().indexOf(text) !== -1
          ) {
            results.push(entry);
          }
        }
      }

      this.setState({ taskData: results });
    } else {
      this.setState({ taskData: this.state.taskfullData });
      //this.setState({taskSearchData: data});
    }
  };

  toggleSwitch = (switchNumber) =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderSearch = () => {
    const { navigation } = this.props;
    const { text } = this.state;
    return (
      <Input
        autoFocus={true}
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onChangeText={this.handleSearch}
        value={this.state.searchtext}
        iconContent={
          <>
            <TouchableOpacity onPress={() => this.showSearch()}>
              <Icon
                size={25}
                color={theme.COLORS.MUTED}
                name="cross"
                family="entypo"
              />
            </TouchableOpacity>
          </>
        }
      />
    );
  };
  //<TouchableOpacity onPress={() => this.showSearch()}><Text size={11} style={{ fontWeight: 'bold', paddingLeft: 5, paddingTop: 0, color: scheme === 'dark' ? 'white' : 'black' }}>Cancel</Text></TouchableOpacity>

  renderHeader = () => {
    return (
      <Block center style={styles.headerColor}>
        {this.renderSearch()}
        {/* {options ? this.renderOptions() : null}
              {tabs ? this.renderTabs() : null} */}
      </Block>
    );
  };
  redirectToScanner = () => {
    this.props.navigation.navigate("Scanner");
  };
  showSearch = () => {
    //this.loadData('');

    if (this.state.isSearchShow) {
      this.setState({ isSearchShow: false });
      this.handleSearch("");
    } else this.setState({ isSearchShow: true });
  };

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    navigation.goBack();
  };
  renderNavigation = () => {
    const { back, title, white, transparent, navigation, scene, product } =
      this.props;
    const noShadow = ["Search", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    ];
    //alert(JSON.stringify(this.props.route.params.pageData));
    return (
      <Block style={headerStyles}>
        <NavBar
          style={styles.headerColor}
          title={
            <Block flex row shadow>
              <Image
                title="group"
                source={{
                  uri: "https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png",
                }}
                style={{
                  marginBottom: 0,
                  width: 30,
                  height: 30,
                }}
              />
              <Text
                size={18}
                style={{
                  fontWeight: "bold",
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                {this.props.route.params.pageData.ReportMenuLabel.length > 12
                  ? this.props.route.params.pageData.ReportMenuLabel.substring(
                      0,
                      12
                    ) + ".."
                  : this.props.route.params.pageData.ReportMenuLabel}{" "}
                {this.props.route.params?.product?.title}
              </Text>
            </Block>
          }
          rightStyle={{ alignItems: "center" }}
          leftStyle={{ paddingTop: 3, flex: 0.3 }}
          style={styles.navbar}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? "WHITE" : "ICON"] },
          ]}
          right={
            <Block flex row style={[styles.searchbutton]}>
              <TouchableOpacity onPress={() => this.redirectToScanner()}>
                <MaterialIcons
                  name="qr-code-scanner"
                  size={21}
                  color="black"
                  style={{ paddingRight: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.showSearch()}>
                <Icon
                  size={21}
                  style={{ paddingRight: 5 }}
                  family="entypo"
                  name="magnifying-glass"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
              {/* {this.state.EnableNewRecord  == true ?  */}
              {!this.props.route.params.ismsg ? (
                <TouchableOpacity onPress={() => this.addtask()}>
                  <Icon
                    size={21}
                    style={{ paddingRight: 5 }}
                    family="entypo"
                    name="plus"
                    color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                  />
                </TouchableOpacity>
              ) : null}
              {/* :  null} */}
              {!this.props.route.params.ismsg ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("GroupFilter", {
                      pageData: this.props.route.params.pageData,
                    })
                  }
                >
                  <Entypo
                    style={{ paddingRight: Platform.OS === "ios" ? 10 : 0 }}
                    name="funnel"
                    size={21}
                    color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={{ paddingLeft: 5, paddingRight: 15 }}
                onPress={() => this.refreshData()}
              >
                <Ionicons
                  size={21}
                  family="entypo"
                  name="sync"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
            </Block>
          }
          rightStyle={{ alignItems: "center" }}
          leftStyle={{ fontSize: 18 }}
          style={styles.navbar}
        />
        {this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    );
  };
  addtask = async () => {
    //alert(this.props.route.params.pageData.ClientAppID);
    const { navigation } = this.props;
    let commonData = CommonDataManager.getInstance();
    let apps = await commonData.getClientAppData();
    apps = apps.filter(
      (e) => e.ClientAppID == this.props.route.params.pageData.ClientAppID
    );
    var groupapps = apps[0].GroupAppsList.split(",");
    if (groupapps.length > 1) {
      navigation.navigate("Groups", {
        pageData: this.props.route.params.pageData,
        screen: "addtask",
        GroupAppID: groupapps[0],
      });
    } else {
      navigation.navigate("AddTask", {
        pageData: this.props.route.params.pageData,
        GroupAppID: groupapps[0],
      });
    }
    //alert(groupapps.length);
  };

  hideaction = async () => {
    this.setState({ isActionVisible: false });
  };
  showaction = async () => {
    this.setState({ isActionVisible: true });
  };
  movescreen(item) {
    const { navigation } = this.props;
    if (this.props.route.params.ismsg == true) {
      if (item.ActionRowIDKeyTypeID == 10) {
        navigation.navigate("TaskDetail", {
          pageData: this.props.route.params.pageData,
          taskData: this.state.taskDetail,
          item: item,
          isfrommsg: true,
        });
      } else {
        //need to open message
        navigation.navigate("TaskMessageDetail", {
          pageData: this.props.route.params.pageData,
          taskItem: this.state.taskDetail,
          item: item,
          screenmode: "edit",
        });
      }
    } else {
      this.props.route.params.taskId = this.state.taskDetail.RowID;
      this.props.route.params.StatusID = this.state.taskDetail.StatusID;
      navigation.navigate("TaskDetail", {
        pageData: this.props.route.params.pageData,
        taskData: this.state.taskDetail,
        item: item,
        isfrommsg: true,
      });
    }
  }

  setAction = async (actions, items) => {
    this.setState({ actionName: actions.ActionName });
    requetActivityActionModel.SPName = actions.SPName;
    requetActivityActionModel.ActionID = actions.ActionID;
    requetActivityActionModel.RowID = items.RowID;
    requetActivityActionModel.UserGroupAppID = items.UserGroupAppID;
    requetActivityActionModel.GroupAppID = items.GroupAppID;
    requetActivityActionModel.TaskID = items.RowID;
    requetActivityActionModel.AccessLevelID = 20;
    requetActivityActionModel.ReportID =
      this.props.route.params.pageData.ReportID;
    let objData = DynamicTaskData.getInstance();
    this.setState({ actionloading: true });
    //this.hideaction();
    objData.SetActivityAction((result) => {
      this.setState({ actionloading: false });
      this.hideaction();
      this.showaction();
      Toast.show({
        type: "success",
        text1: "Action has been done",
      });
      this.loadData("updated");
    });
  };

  setTaskModel = async (item, index, isexpend) => {
    try {
      let commonData = CommonDataManager.getInstance();
      console.log("Item data", JSON.stringify(item));
      this.setState({ ActionRowID: item.ActionRowID });
      this.setState({ SelectedRowId: RowID });
      this.setState({ ActionRowIDKeyTypeID: item.ActionRowIDKeyTypeID });
      this.setState({ RowIDKeyTypeID: item.RowIDKeyTypeID });
      this.setState({ PermissionID: item.PermissionID });
      this.setState({ currentRowServiceNodeType: item.ServiceNodeTypeID });
      this.setState({ TypeId: item.TypeID });
      if (
        item.ServiceNodeTypeID != this.state.currentRowServiceNodeType ||
        this.state.Mode != "Panel1"
      ) {
        this.setState({ panelNoRowSelect: true });
        this.setState({ isMessageDetailShow: true });
      } else {
        this.setState({ panelNoRowSelect: false });
        this.setState({ isMessageDetailShow: false });
      }

      let RowID =
        item.ActionRowIDKeyTypeID == 10 && this.props.route.params.ismsg == true
          ? item.ActionRowID
          : item.RowID;

      let taskDetail = await database.getTaskDetailAsync(RowID);

      //
      let clientAppData = await commonData.getClientAppData();
      clientAppData = clientAppData.filter(
        (e) => e.ClientAppID == this.props.route.params.pageData.ClientAppID
      );

      let filterApp;
      if (
        clientAppData.length > 0 &&
        clientAppData[0].ConfigFields != "" &&
        JSON.parse(clientAppData[0].ConfigFields)
      ) {
        filterApp = JSON.parse(clientAppData[0].ConfigFields);
      }
      //alert(JSON.stringify(filterApp));
      filterApp = filterApp
        ? filterApp.Fields.filter(
            (e) => e.FieldName == "Fields4MobileAppExpandedRow"
          )
        : null;

      if (taskDetail && taskDetail.taskDetailData != null) {
        let finalData = JSON.parse(taskDetail.taskDetailData);

        // console.log("final data", finalData);
        /*if (!this.props.route.params.ismsg) {
          var createddate = new Date(finalData.CreatedDate);
          var formattedDate = format(createddate, "MMMM do, yyyy H:mm a");
          finalData.formattedCreatedDate = formattedDate;

          if (finalData.StartDate) {
            var startdate = new Date(finalData.StartDate);
            formattedDate = format(startdate, "MMMM do, yyyy H:mm a");
            finalData.formattedStartDate = formattedDate;
            this.setState({ taskDetail: finalData });
          }
        }*/

        //why we need this data parse here?
        let taskKeyValue = [];
        //alert(JSON.stringify(finalData));
        item.Description = this.props.route.params.ismsg
          ? finalData.MsgText
          : finalData.Description;
        //item.MsgSubject = this.props.route.params.ismsg ? finalData.MsgSubject : "";
        console.log("final data", finalData);
        this.setState({ taskDetail: finalData });

        //item.Description = finalData.Description;
        //what is the use of taskId ?
        // item.TaskStatusID = finalData.TaskStatusID;
        item.TaskStatus = finalData.TaskStatus;
        if (filterApp) {
          let fields = filterApp.map((e) => e.DefaultValue);
          //alert(fields);
          let selectedFields = (fields + ",").split(",");
          //alert(selectedFields.length);
          for (var key in item) {
            if (
              !key.endsWith("ID") &&
              !key.endsWith("id") &&
              !key.endsWith("...")
            ) {
              if (selectedFields.includes(key)) {
                let taskValue = {};
                taskValue.Key = key;
                taskValue.Value = item[key];
                taskKeyValue.push(taskValue);
              }
            }
          }

          let taskValue = {};
          taskValue.Key = "Description";
          taskValue.Value = this.props.route.params.ismsg
            ? finalData.MsgText
            : finalData.Description;
          taskKeyValue.push(taskValue);
        } else {
          for (var key in item) {
            if (
              !key.endsWith("ID") &&
              !key.endsWith("id") &&
              !key.endsWith("...") &&
              !key.endsWith("Title")
            ) {
              let taskValue = {};
              taskValue.Key = key;
              taskValue.Value = item[key];
              taskKeyValue.push(taskValue);
            }
          }
        }

        // if(this.props.route.params.ismsg == true)
        // this.setState({MsgDetailKeyValue : taskKeyValue});
        // else
        this.setState({ TaskDetailKeyValue: taskKeyValue });
        //alert(JSON.stringify(finalData.Actions));
        //it required for show action
        if (finalData.Actions)
          this.setState({ actions: JSON.parse(finalData.Actions).Actions });
        else this.setState({ actions: "" });

        this.setState({
          taskData: this.state.taskData.map((item) => {
            item.isExpand = false;
            return item;
          }),
        });

        let targetPost = this.state.taskData[index];
        targetPost.isExpand = isexpend;
        this.state.taskData[index] = targetPost;
        var updatedTask = this.state.taskData;
        //Loader.isLoading = false;
        //this.setState({loading:false});
        this.setState({
          taskData: updatedTask,
        });
        //alert(JSON.stringify(this.state.TaskDetailKeyValue));
        //this.setState({loading:false});

        //what is the use of this piece of code here?
        if (
          (!item.ReadStatusID || item.ReadStatusID == 0) &&
          this.state.SupportReadStatus
        ) {
          this.setKeyUserReadStatus(item, index, finalData);
          //here we need to set ReadStatusID in offline data for item ROWID and set the status 1 for unread future
          this.state.messageData[index].ReadStatusID == 1;
          this.setState({ messageData: this.state.messageData });
          item.ReadStatusID = 1;
          database.setupMessageAsync(item.RowID, item);
        }
      } else {
        //no data found need to pull data from server
        let objData = DynamicTaskData.getInstance();
        var taskIds = [];
        taskIds.push(item.RowID);
        this.setState({ loading: true });
        objData.getDynamicTaskDetailData(
          taskIds,
          this.props.route.params.ismsg,
          (result) => {
            //alert(JSON.stringify(result));
            let finalData = JSON.parse(result);
            if (this.props.route.params.ismsg == true)
              this.setTaskData(
                finalData,
                item,
                filterApp,
                index,
                isexpend,
                true
              );

            if (!this.props.route.params.ismsg) {
              var createddate = new Date(finalData.CreatedDate);
              var formattedDate = format(createddate, "MMMM do, yyyy H:mm a");
              finalData.formattedCreatedDate = formattedDate;

              if (finalData.StartDate) {
                var startdate = new Date(finalData.StartDate);
                formattedDate = format(startdate, "MMMM do, yyyy H:mm a");
                finalData.formattedStartDate = formattedDate;
              }
            }
            if (finalData.ActionRowIDKeyTypeID != 10) {
              //message case if message is there then we need to fetch message job detail
              //alert(finalData.AppliesToOCID);
              //alert(JSON.stringify(finalData));
              taskIds = [];
              taskIds.push(finalData.AppliesToOCID);
              objData.getDynamicTaskDetailData(taskIds, false, (msgresult) => {
                finalData = JSON.parse(msgresult);
                this.setState({ taskDetail: finalData });
                this.setTaskData(
                  finalData,
                  item,
                  filterApp,
                  index,
                  isexpend,
                  false
                );
              });
            } else {
              this.setTaskData(
                finalData,
                item,
                filterApp,
                index,
                isexpend,
                false
              );
            }
          }
        );
      }
    } catch (e) {
      //Loader.isLoading = false;
      this.setState({ loading: false });
    }
    //this.setState({loading:false});
    // console.log("Loader", Loader.isLoading);
    //Loader.isLoading = false;
  };
  loaderoff() {
    //alert('ysss');
    // Loader.isLoading = false;
  }

  setTaskData(finalData, item, filterApp, index, isexpend, ismsg) {
    this.setState({ taskDetail: finalData });
    let taskKeyValue = [];
    //alert(JSON.stringify(finalData));
    item.Description = this.props.route.params.ismsg
      ? finalData.MsgText
      : finalData.Description;
    //item.MsgSubject = this.props.route.params.ismsg ? finalData.MsgSubject : "";

    if (filterApp) {
      let fields = filterApp.map((e) => e.DefaultValue);
      //alert(fields);
      let selectedFields = (fields + ",").split(",");
      //alert(selectedFields.length);
      for (var key in item) {
        if (
          !key.endsWith("ID") &&
          !key.endsWith("id") &&
          !key.endsWith("...") &&
          !key.endsWith("Title")
        ) {
          if (selectedFields.includes(key)) {
            let taskValue = {};
            taskValue.Key = key;
            taskValue.Value = item[key];
            taskKeyValue.push(taskValue);
          }
        }
      }

      let taskValue = {};
      taskValue.Key = "Description";
      taskValue.Value = finalData.Description;
      taskKeyValue.push(taskValue);
    } else {
      for (var key in item) {
        if (
          !key.endsWith("ID") &&
          !key.endsWith("id") &&
          !key.endsWith("...") &&
          !key.endsWith("Title")
        ) {
          let taskValue = {};
          taskValue.Key = key;
          taskValue.Value = item[key];
          taskKeyValue.push(taskValue);
        }
      }
    }
    this.setState({
      taskData: this.state.taskData.map((item) => {
        item.isExpand = false;
        return item;
      }),
    });

    let targetPost = this.state.taskData[index];
    targetPost.isExpand = isexpend;
    this.state.taskData[index] = targetPost;

    //  if(ismsg == true)
    //  this.setState({MsgDetailKeyValue : taskKeyValue});
    //  else
    this.setState({ TaskDetailKeyValue: taskKeyValue });

    if (finalData.Actions)
      this.setState({ actions: JSON.parse(finalData.Actions).Actions });
    else this.setState({ actions: "" });

    var updatedTask = this.state.taskData;
    //Loader.isLoading = false;
    //this.setState({loading:false});
    this.setState({
      taskData: updatedTask,
    });

    if (ismsg) {
      this.setState({
        messageData: updatedTask,
      });
    }
    //alert(JSON.stringify(this.state.TaskDetailKeyValue));
    this.setState({ loading: false });

    if (
      (!item.ReadStatusID || item.ReadStatusID == 0) &&
      this.state.SupportReadStatus
    ) {
      this.setKeyUserReadStatus(item, index, finalData);
      //here we need to set ReadStatusID in offline data for item ROWID and set the status 1 for unread future
      this.state.messageData[index].ReadStatusID == 1;
      this.setState({ messageData: this.state.messageData });
      item.ReadStatusID = 1;
      database.setupMessageAsync(item.RowID, item);
    }

    this.setState({ loading: false });
  }
  setKeyUserReadStatus = async (item, index, detail) => {
    UserReadStatusModel.UserGroupAppID = item.UserGroupAppID;
    UserReadStatusModel.RowID = item.RowID;
    UserReadStatusModel.RowIDKeyTypeID = item.RowIDKeyTypeID;
    UserReadStatusModel.ActionRowID = item.ActionRowID;
    UserReadStatusModel.ActionRowIDKeyTypeID = item.ActionRowIDKeyTypeID;
    UserReadStatusModel.KeyID = detail.KeyID;
    UserReadStatusModel.KeyTypeID = detail.KeyTypeID;
    let objData = DynamicTaskData.getInstance();
    let result = await objData.SetKeyUserReadStatus(item.RowID);
    // not need to call from server
    //this.callmessagedatafromserver(item, index, detail);
  };

  getcode(priority) {
    let text = "";
    if (priority) {
      if (priority.indexOf("Critical") > -1) text = "CRITICAL";
      else if (priority.indexOf("High") > -1) text = "HIGH";
      else if (priority.indexOf("Medium") > -1) text = "MEDIUM";
      else if (priority.indexOf("Low") > -1) text = "LOW";
    }
    return text;
  }
  getColorcode(priority) {
    let color = "#0549FD";
    if (priority) {
      if (priority.indexOf("Critical") > -1) color = "#ff8989";
      else if (priority.indexOf("High") > -1) color = "#89b3ff";
      else if (priority.indexOf("Medium") > -1) color = "#92d050";
      else if (priority.indexOf("Low") > -1) color = "#ffe181";
    }
    return color;
  }
  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    //colors[index % colors.length]
    let colors = ["#FD0527", "#051CFD", "#FDD405", "#23FD05"];
    return (
      <Block>
        <Block card shadow style={styles.product}>
          <Block row>
            <View
              style={{
                backgroundColor: this.getColorcode(item.Priority),
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 85,
                marginLeft: 0,
                marginRight: 0,
                padding: 0,
              }}
            >
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  padding: 0,
                  fontSize: 8,
                  fontWeight: "bold",
                }}
              >
                {this.getcode(item.Priority)}
              </Text>
            </View>
            {/* <Block style={{  backgroundColor: this.getColorcode(item.Priority), justifyContent: 'center', alignItems:'center', width:12}}>
              <Text size={14} style={{transform: [{ rotate: '-360deg'}], fontWeight:'bold', alignItems:'center', justifyContent: 'center'}}>{this.getcode(item.Priority)}</Text>
              </Block> */}

            <Block flex style={styles.productDescription}>
              <Block flex row space="between">
                <Block flex style={{ marginTop: 10 }}>
                  <TouchableWithoutFeedback
                    onPress={() => this.setTaskModel(item, index, true)}
                  >
                    <Text
                      size={13}
                      style={
                        ({ marginTop: 5, marginBottom: 10 }, styles.textcolor)
                      }
                    >
                      <Text style={{ fontWeight: "bold" }}>{item.Status}</Text>{" "}
                    </Text>
                  </TouchableWithoutFeedback>
                </Block>
                <Block>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginTop: 10,
                      marginRight: 10,
                      color: scheme === "dark" ? "#17a2b8" : "#181818",
                    }}
                  >
                    {" "}
                    {item.Number}
                    {item.isExpand}
                  </Text>
                </Block>
                {!item.isExpand ? (
                  <Block bottom>
                    <AntDesign
                      style={({ marginRight: 5 }, styles.textcolor)}
                      onPress={() => this.setTaskModel(item, index, true)}
                      name="down"
                      size={18}
                      color="black"
                    />
                  </Block>
                ) : (
                  <Block bottom>
                    <AntDesign
                      style={({ marginRight: 5 }, styles.textcolor)}
                      onPress={() => this.setTaskModel(item, index, false)}
                      name="up"
                      size={18}
                      color="black"
                    />
                  </Block>
                )}
              </Block>
              {!item.isExpand ? (
                <Block>
                  <TouchableWithoutFeedback
                    onPress={() => this.setTaskModel(item, index, true)}
                  >
                    {!item.ReadStatusID &&
                    this.state.SupportReadStatus == "True" ? (
                      <Text size={18} style={styles.boldtitle}>
                        {item.Title.length > 70
                          ? item.Title.substring(0, 70) + "..."
                          : item.Title}
                      </Text>
                    ) : (
                      <Text size={18} style={styles.title}>
                        {item.Title.length > 70
                          ? item.Title.substring(0, 70) + "..."
                          : item.Title}
                      </Text>
                    )}
                  </TouchableWithoutFeedback>
                </Block>
              ) : (
                <Block visible={this.state.loading}>
                  {/* this.state.loading */}
                  <Block>
                    <TouchableWithoutFeedback
                      onPress={() => this.setTaskModel(item, index, false)}
                    >
                      <Text size={18} style={styles.title}>
                        {/* {this.state.taskDetail?.Title} */}
                        {item.Title}
                      </Text>
                    </TouchableWithoutFeedback>
                    <View
                      style={{
                        borderBottomColor: "black",
                        borderBottomWidth: 0.5,
                        marginBottom: 10,
                      }}
                    />
                    <View>
                      <Block style={styles.actioncontainer}>
                        <Block style={styles.item}>
                          <Button
                            round
                            shadowless
                            onPress={() => this.showaction()}
                            color="#EAE7E7"
                            textStyle={styles.actionbutton}
                          >
                            {"Actions"}
                          </Button>
                        </Block>
                        <Block style={styles.item}>
                          <Button
                            round
                            onPress={() => this.movescreen(item)}
                            shadowless
                            color="#EAE7E7"
                            textStyle={styles.actionbutton}
                          >
                            Open
                          </Button>
                        </Block>
                        {/* { this.state.taskDetail && (this.state.taskDetail.ServiceNodeType == 30 || this.state.taskDetail.ActivityTypeID ==15) ? 
            <Block style={styles.item}>
              <Button round
               onPress={() => navigation.navigate('AddQuotes', {taskId : this.state.taskDetail.RowID, StatusID:this.state.taskDetail.StatusID})}
                shadowless
                color='#EAE7E7'
                textStyle={styles.actionbutton}
                >
                Quote
              </Button>
            </Block>
            : null}  */}
                      </Block>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Modal
                        isVisible={this.state.isActionVisible}
                        style={styles.bottomModal}
                      >
                        <TouchableOpacity
                          style={{ flex: 1, justifyContent: "flex-end" }}
                          onPress={() => this.hideaction()}
                        >
                          <View style={{ flex: 1, justifyContent: "flex-end" }}>
                            <View style={styles.modalContent}>
                              <TouchableOpacity
                                onPress={() => this.hideaction()}
                                style={{
                                  position: "absolute",

                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                }}
                              >
                                <AntDesign
                                  name="closecircleo"
                                  size={24}
                                  color={
                                    scheme === "dark"
                                      ? "white"
                                      : theme.COLORS["ICON"]
                                  }
                                  style={{}}
                                />
                              </TouchableOpacity>
                              <Block style={styles.actioncontainer}>
                                <Spinner
                                  //visibility of Overlay Loading Spinner
                                  visible={this.state.actionloading}
                                  //Text with the Spinner - this.state.loading
                                  textContent={
                                    this.state.actionName + " is executing..."
                                  }
                                  //Text style of the Spinner Text
                                  textStyle={styles.spinnerTextStyle}
                                />
                                {this.state.actions
                                  ? this.state.actions.map((buttonInfo) => {
                                      return (
                                        <Block style={styles.item}>
                                          <Button
                                            round
                                            shadowless
                                            onPress={() =>
                                              this.setAction(buttonInfo, item)
                                            }
                                            color="#EAE7E7"
                                            textStyle={styles.actionbutton}
                                            key={buttonInfo.ActionID}
                                          >
                                            {buttonInfo.ActionName}
                                          </Button>
                                        </Block>
                                      );
                                    })
                                  : null}
                              </Block>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </View>

                    <View
                      style={{
                        borderBottomColor: "black",
                        borderBottomWidth: 0.5,
                        marginBottom: 10,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => this.setTaskModel(item, index, false)}
                    >
                      {!this.props.route.params.ismsg ? (
                        <Text
                          style={
                            (styles.textcolor,
                            { fontWeight: "bold", paddingBottom: 10 })
                          }
                          size={theme.SIZES.BASE * 0.9}
                          color={scheme === "dark" ? "#c7c5bd" : "black"}
                        >
                          {this.state.taskDetail
                            ? this.state.taskDetail?.CategoryDesc +
                              "\\" +
                              this.state.taskDetail?.SubCategoryDesc +
                              "\\" +
                              this.state.taskDetail?.SubCategoryTaskDesc
                            : null}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    <Block visible={this.state.loading}>
                      {this.state.TaskDetailKeyValue
                        ? this.state.TaskDetailKeyValue?.map((item) => {
                            return (
                              <Block style={styles.taskitem}>
                                {item.Key == "Description" ? (
                                  <View>
                                    <View style={{ width: 130 }}>
                                      <Text
                                        style={styles.itemkey}
                                        size={theme.SIZES.BASE * 0.9}
                                      >
                                        {item.Key}:
                                      </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                      {
                                        /* <Text style={styles.textcolor} size={theme.SIZES.BASE * 0.90}>{item.Value}</Text> */
                                        <RenderHtml
                                          style={styles.textcolor}
                                          source={{ html: item.Value }}
                                          tagsStyles={{
                                            span: { fontSize: 15 },
                                            p: {
                                              fontSize: 15,
                                              color:
                                                scheme === "dark"
                                                  ? "#c7c5bd"
                                                  : "black",
                                            },
                                          }}
                                        />
                                      }
                                    </View>
                                  </View>
                                ) : item.Key != "isExpand" ? (
                                  <View
                                    style={{ flex: 1, flexDirection: "row" }}
                                  >
                                    <View style={{ width: 130 }}>
                                      <Text
                                        style={styles.itemkey}
                                        size={theme.SIZES.BASE * 0.9}
                                      >
                                        {item.Key}:
                                      </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                      <Text
                                        style={styles.textcolor}
                                        size={theme.SIZES.BASE * 0.9}
                                      >
                                        {item.Value}
                                      </Text>
                                    </View>
                                  </View>
                                ) : null}
                              </Block>
                            );
                          })
                        : null}
                    </Block>
                  </Block>
                  <Block row flex style={{ paddingBottom: 7 }}>
                    <Icon
                      size={22}
                      family="entypo"
                      name="eye"
                      style={styles.textcolor}
                      color={theme.COLORS["ICON"]}
                    />

                    <TouchableOpacity style={{ paddingLeft: 0 }}>
                      <Text
                        style={
                          (styles.textcolor,
                          {
                            fontWeight: "bold",
                            paddingLeft: 10,
                            paddingTop: 5,
                          })
                        }
                        color={scheme === "dark" ? "#c7c5bd" : "black"}
                      >
                        View Contractor
                      </Text>
                    </TouchableOpacity>
                  </Block>
                </Block>
              )}
            </Block>
          </Block>
        </Block>
      </Block>
    );
  };

  renderData = (navigation, scene) => {
    const { back, title, white, transparent, pageData } = this.props;
    //alert(JSON.stringify(this.props));
    const noShadow = ["Search", "Profile"];
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    ];

    return (
      <View>
        <Block style={styles.shadow}>{this.renderNavigation()}</Block>
        <Toast></Toast>
        {this.state.filterStatus != "" && this.state.filterStatus != null ? (
          <View>
            <TouchableOpacity onPress={() => this.clearfilter()}>
              <Block style={{ textAlign: "center" }}>
                <Text size={14} style={styles.statustitle}>
                  {this.state.filterStatus}
                </Text>

                <Entypo
                  size={16}
                  style={{ position: "absolute", top: 0, left: 155 }}
                  color={theme.COLORS.MUTED}
                  name="circle-with-cross"
                  family="entypo"
                />
              </Block>
            </TouchableOpacity>
          </View>
        ) : null}
        {Platform.OS === "ios" ? (
          <View
            flex
            showsVerticalScrollIndicator={false}
            style={styles.products}
          >
            <Block flex style={styles.notification}>
              <Spinner
                //visibility of Overlay Loading Spinner
                visible={this.state.loading}
                //Text with the Spinner - this.state.loading
                textContent={"Please wait..."}
                //Text style of the Spinner Text
                textStyle={styles.spinnerTextStyle}
              />

              {this.state.taskData != null && this.state.taskData.length > 0 ? (
                <FlatList
                  extraData={this.state}
                  data={this.state.taskData}
                  keyExtractor={(item, index) => item.RowID?.toString()}
                  renderItem={this.renderItem}
                />
              ) : null}
            </Block>
          </View>
        ) : (
          <Block
            flex
            showsVerticalScrollIndicator={false}
            style={styles.products}
          >
            <Block flex style={styles.notification}>
              <Spinner
                //visibility of Overlay Loading Spinner
                visible={this.state.loading}
                //Text with the Spinner this.state.loading
                textContent={"Please wait..."}
                //Text style of the Spinner Text
                textStyle={styles.spinnerTextStyle}
              />

              {this.state.taskData != null && this.state.taskData.length > 0 ? (
                <FlatList
                  extraData={this.state}
                  data={this.state.taskData}
                  keyExtractor={(item, index) => item.RowID?.toString()}
                  renderItem={this.renderItem}
                />
              ) : null}
            </Block>
          </Block>
        )}
      </View>
    );
  };

  render() {
    //alert(JSON.stringify(this.props));
    return (
      <Block flex center style={styles.home}>
        {this.renderData()}
      </Block>
    );
  }
}
const scheme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  home: {
    width: width,
  },
  group: {
    paddingTop: theme.SIZES.BASE * 3.75,
  },

  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: scheme === "dark" ? theme.COLORS.WHITE : "#181818",
    shadowColor: scheme === "dark" ? "white" : "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 8,
    shadowOpacity: 0.6,
    elevation: 4,
    zIndex: 2,
  },

  navbar: {
    backgroundColor: scheme === "dark" ? "#181818" : "white",
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4.5 : theme.SIZES.BASE,
    zIndex: 5,
  },
  divider: {
    borderRightWidth: 0.5,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 0,
    paddingVertical: theme.SIZES.BASE * 0,
  },
  notification: {
    paddingVertical: theme.SIZES.BASE / 3,
    color: scheme === "dark" ? "white" : "#181818",
  },
  title: {
    fontSize: 17,

    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 0.6,
    color: scheme === "dark" ? "white" : "#181818",
  },
  boldtitle: {
    fontSize: 17,
    fontWeight: "bold",
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 0.6,
    color: scheme === "dark" ? "white" : "#181818",
  },
  navtitle: {
    fontSize: 17,
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 1,
    color: scheme === "dark" ? "white" : "#181818",
  },
  rows: {
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 1.25,
    color: scheme === "dark" ? "white" : "#181818",
  },
  product: {
    backgroundColor: scheme === "dark" ? "#181818" : "white",
    color: scheme === "dark" ? "white" : "#181818",
    marginVertical: theme.SIZES.BASE / 6,
    borderWidth: 0,
    minHeight: 72,
    margin: 0,
  },
  productTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 0.1,
    color: scheme === "dark" ? "white" : "#181818",
  },
  productDescription: {
    paddingLeft: 7,
    margin: 0,
    color: scheme === "dark" ? "white" : "#181818",
  },
  shadow: {
    backgroundColor: scheme === "dark" ? "white" : "#181818",
    shadowColor: scheme === "dark" ? "white" : "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  buttonshadow: {
    shadowColor: scheme === "dark" ? "white" : "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 3,
  },
  searchbutton: {
    paddingLeft: 0,
    paddingTop: 15,
    position: "relative",
  },
  options: {
    paddingHorizontal: theme.SIZES.BASE / 2,
  },
  optionsText: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: "white", //scheme === "dark" ? "white" : "#181818",
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  actionbutton: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: "black", //scheme === "dark" ? "white" : "#181818",
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  textcolor: {
    color: scheme === "dark" ? "#17a2b8" : "#181818",
  },
  optionsButton: {
    color: scheme === "dark" ? "white" : "#181818",
    width: "auto",
    height: 32,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 2,
  },
  button: {
    color: scheme === "dark" ? "white" : "#181818",
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 3,
  },
  circle: {
    flex: 1,
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  },
  headerColor: {
    color: scheme === "dark" ? "white" : "#181818",
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  actioncontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginRight: 10,
    //margin :10 // if you want to fill rows left to right
  },
  item: {
    width: "50%", // is 50% of container width
  },
  taskitem: {
    width: "100%", // is 50% of container width
    paddingTop: 2,
    paddingBottom: 2,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  statustitle: {
    paddingBottom: theme.SIZES.BASE * 0.4,
    color: "white",
    width: width - theme.SIZES.BASE * 0,
    paddingVertical: 5,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10,

    height: 30,
    width: 150,
    textAlign: "center",
    backgroundColor: "gray",
  },

  itemkey: {
    color: scheme === "dark" ? "white" : "#181818",
    fontWeight: "bold",
  },
});
