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
 
  requestPanel2Model,
 
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
export default class Viewcontractor extends React.Component {
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
      metaData:null,
      displayColumn:null
    };
  }

  async componentDidMount() {
    this.loadData();
    this.setState({ searchtext: "" });
    // udatabase.addlog("componentDidMount called");
    this.focusListener = this.props.navigation.addListener("focus", (e) => {
      if (this.props.route.params.GroupAppID)
        this.setState({ groupAppID: this.props.route.params.GroupAppID });
      else this.setState({ groupAppID: 0 });

    });
  }
  clearfilter() {
    this.setState({ filterStatus: "" });
    this.loadData("");
  }
  loadData = async (type) => {
   
    
    let isConnected = true;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
    //alert(isConnected);
    let data = null;
    let pageData = this.props.route.params.pageData;
    let taskItem = this.props.route.params.taskItem;
    
    this.setState({ loading: true });
    
    let objData = DynamicTaskData.getInstance();
    let commonData = CommonDataManager.getInstance();
    let metaData = commonData.getServceNodeMetaData();
    
    metaData = metaData?._z.filter(e=>e.ActivityServiceNodeType ==taskItem.ServiceNodeTypeID);
    
    if(metaData && metaData.length >0)
    {
        requestPanel2Model.ReportID = metaData[0].Panel2ReportID;
        requestPanel2Model.DataSetName = metaData[0].Panel2SPName;
        requestPanel2Model.GroupAppId = this.props.route.params.GroupAppId;
        requestPanel2Model.ModuleID= this.props.route.params.pageData.ModuleID;
        requestPanel2Model.RowID = this.props.route.params.taskItem.RowID;

    }
   
    this.setState({ loading: true });
    data = objData.getDynamicViewContractorListData(
      this.props.route.params.pageData.GroupAppID,
      (result) => {
        this.setState({ loading: false });
        if (result != null) {
         
         this.setState({actions:this.props.route.params.actions});
         this.setState({metaData:result.TaskList.MetaData});
         this.setState({metaData:result.TaskList.DisplayColumJson});
       
       
        this.setState({ loading: false });
        this.setState({ taskData: result.TaskList.QueryData });
        this.setState({ taskfullData: result.TaskList.QueryData });

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
          entry.Status &&
          entry.Status.toString().indexOf(text) !== -1
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
            entry.ContractorName &&
            entry.ContractorName.toUpperCase().indexOf(text) !== -1
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
          style={[styles.headerColor, styles.navbar]}
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
              Contractor List
              </Text>
            </Block>
          }
          rightStyle={{ alignItems: "center" }}
          leftStyle={{ paddingTop: 3, flex: 0.3, fontSize: 18 }}
          left={
            <Block flex row>
              <TouchableOpacity onPress={() => this.handleLeftPress()}>
                <Icon
                  size={20}
                  style={{ paddingRight: 20, paddingTop: 20 }}
                  family="entypo"
                  name="chevron-left"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
            </Block>
          }
           titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? "WHITE" : "ICON"] },
          ]}
          right={
            <Block flex row style={[styles.searchbutton]}>
             
             
              <TouchableOpacity onPress={() => this.showSearch()}>
                <Icon
                  size={21}
                  style={{ paddingRight: 5 }}
                  family="entypo"
                  name="magnifying-glass"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
          
          
             
             
              <TouchableOpacity
                style={{ paddingLeft: 5, paddingRight: 15 }}
                onPress={() => this.loadData('')}
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
          
        />
        {this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    );
  };
 

  hideaction = async () => {
    this.setState({ isActionVisible: false });
  };
  showaction = async () => {
    this.setState({ isActionVisible: true });
  };

  

  setTaskModel = async (item, index, isexpend) => {
    try {
      let commonData = CommonDataManager.getInstance();
      console.log("Item data", JSON.stringify(item));
     
      
        //why we need this data parse here?
        let taskKeyValue = [];
        //alert(JSON.stringify(finalData));
        let fields = this.state.DisplayColumJson;
        if (fields) {
         
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
  movescreen() {
    let item = this.props.route.params.taskItem;
   
    const { navigation } = this.props;
    this.props.route.params.taskId = this.props.route.params.taskDetail.RowID;
      this.props.route.params.StatusID = this.props.route.params.taskDetail.StatusID;
      navigation.navigate("TaskDetail", {
        pageData: this.props.route.params.pageData,
        taskData: this.props.route.params.taskDetail,
        item: item,
        isfrommsg:false,
        iscontractor: true,
      });
  }
  setAction = async (actions) => {
    items = this.props.route.params.taskItem;
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
      //this.loadData("updated");
    });
  };
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
      if (priority.indexOf("Completed") > -1) color = "#ff8989";
      else if (priority.indexOf("Rejected") > -1) color = "#89b3ff";
      else if (priority.indexOf("Work done") > -1) color = "#92d050";
      else if (priority.indexOf("Waiting quote") > -1) color = "#ffe181";
      else if (priority.indexOf("Quote Saved") > -1) color = "#33FFDD";
      else if (priority.indexOf("Waiting serviceman") > -1) color = "#33FF64";
      else if (priority.indexOf("Waiting bid acceptance") > -1) color = "#FFBB33";
      else if (priority.indexOf("Waiting client approval") > -1) color = "#FF5B33";
      else if (priority.indexOf("Waiting verification") > -1) color = "#33C1FF";
      else if (priority.indexOf("Out of service") > -1) color = "#4C33FF";
      else if (priority.indexOf("Cancelled") > -1) color = "#E633FF";
      else if (priority.indexOf("Inactive") > -1) color = "#FF3390";
      
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
                backgroundColor: this.getColorcode(item.Status),
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
                {this.getcode(item.Status)}
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
                    {/* {item.Rank} */}
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
                        {item.ContractorName.length > 70
                          ? item.ContractorName.substring(0, 70) + "..."
                          : item.ContractorName}
                      </Text>
                    ) : (
                      <Text size={18} style={styles.title}>
                        {item.ContractorName.length > 70
                          ? item.ContractorName.substring(0, 70) + "..."
                          : item.ContractorName}
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
                        {item.ContractorName}
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
                            onPress={() => this.movescreen()}
                            shadowless
                            color="#EAE7E7"
                            textStyle={styles.actionbutton}
                          >
                            Open
                          </Button>
                        </Block>
                       
                       
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
                                              this.setAction(buttonInfo)
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
