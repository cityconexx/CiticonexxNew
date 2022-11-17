import React from "react";
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  Keyboard,
  Appearance,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Block, NavBar, Text, Input, theme } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from "../components/";

import materialTheme from "../constants/Theme";

import RNPickerSelect from "react-native-picker-select";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import DynamicTaskData, {
  requestTaskDLLModel,
  requestTaskSaveModel,
} from "../Data/DynamicTaskData";
import CommonDataManager from "../core/CommonDataManager";
import { Camera } from "expo-camera";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../OfflineData/TaskSyncData";

import Spinner from "react-native-loading-spinner-overlay";
import { MaterialIcons } from "@expo/vector-icons";
// import {
//   RichTextEditor,
//   RichTextViewer,
//   ActionMap,
//   ActionKey,
// } from "@siposdani87/expo-rich-text-editor";
import * as Location from "expo-location";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

/////import {Ionicons} from '@expo/vector-icons';

export default class AddTask extends React.Component {
  constructor(props) {
    super(props);
    this.customStyles = {
      body: { fontSize: 11 },
      heading: { fontSize: 16 },
      title: { fontSize: 20 },
      ol: { fontSize: 11 },
      ul: { fontSize: 11 },
      bold: { fontSize: 11, fontWeight: "bold", color: "" },
    };
    this.state = {
      RowID: "",
      selectedTag: "body",
      selectedStyles: [],
      Description: "",
      selectedCategory: "",
      TaskName: "",
      value: "",
      ActivityTypeID: 0,
      ActivityTypeTaskID: 0,
      TaskID: 0,
      TaskStatusID: 10200,
      TaskStatus: "",
      AssignedToUserID: 0,
      Priority: 10,
      favSport0: undefined,
      StartDate: moment(new Date()).format("YYYY/MM/DD"),
      showStartDate: false,
      EndDate: new Date(),
      showEndDate: false,
      LocationID: 0,
      disabledlocation: false,
      //hasCameraPermission: null, //Permission value
      type: Camera.Constants.Type.back, //specifying app start with back camera.
      active: {
        title: false,
        category: false,
        Desc: false,
        AssignedBy: false,
      },
      hasCameraPermission: null,
      isCapturing: false,
      accessCameraLabel: "Start",
      capturedPhotoBase64: null,
      capturedPhoto: null,
      imageName: "",
      camera: null,
      LocationItems: [],
      UserItems: [],
      PriorityItems: [],
      StatusItems: [],
      isProcessing: false,
      loading: false,
      EnableNewRecord: false,
      lat: 35.681236,
      long: 139.767125,
      richText: "",
    };

    this.editor = React.createRef();
  }
  onValueChanged = (value) => {
    this.setState({
      value: value,
    });
  };
  getColor = (selected) => {
    return selected ? "red" : "black";
  };
  getActionMap = () => {
    return {
      [ActionKey.bold]: ({ selected }) => (
        <MaterialIcons
          name="format-bold"
          size={14}
          color={this.getColor(selected)}
        />
      ),
    };
  };

  async componentDidMount() {
    const foregroundPermission =
      await Location.requestForegroundPermissionsAsync();
    let locationSubscrition = null;

    if (foregroundPermission.granted) {
      locationSubscrition = Location.watchPositionAsync(
        {
          // Tracking options
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (location) => {
          this.setState({ lat: location.coords.latitude });
          this.setState({ long: location.coords.longitude });
          console.log(location.coords.latitude);
          console.log(location.coords.longitude);
        }
      );
    }

    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      AsyncStorage.getItem("selectedCategory").then((result) => {
        //alert(result)
        this.setState({ selectedCategory: result });
        AsyncStorage.removeItem("selectedCategory");
      });

      AsyncStorage.getItem("ActivityTypeID").then((result) => {
        //alert(result)
        this.setState({ ActivityTypeID: result });
        AsyncStorage.removeItem("ActivityTypeID");
      });
      AsyncStorage.getItem("ActivityTypeTaskID").then((result) => {
        //alert(result)
        this.setState({ ActivityTypeTaskID: result });
        AsyncStorage.removeItem("ActivityTypeTaskID");
      });
    });

    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
    //this.getPermissionAsync();
    //alert(JSON.stringify(this.props.route.params.pageData));

    let isConnected = false;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
    //alert(JSON.stringify(this.props.route.params.taskData));
    let dlldata = null;
    let isTaskEditMode = this.props.route.params.taskData ? true : false;
    //alert(JSON.stringify(this.props.route.params.taskData));
    //alert(isTaskEditMode);

    if (isConnected) {
      let objData = DynamicTaskData.getInstance();

      dlldata = await this.loadDLLDataFromServer();

      let commonData = CommonDataManager.getInstance();
      let groupData = await commonData.getGroupDetail();
      let moduleDetail = await commonData.getModuleDetail();

      moduleDetail = moduleDetail.filter(
        (e) =>
          e.GroupAppID ==
          parseInt(this.props.route.params.pageData.GroupAppsList)
      );
      groupData = groupData.filter((e) => e.GroupID == moduleDetail[0].GroupID);

      if (isTaskEditMode) await this.loadEditData();
      else
        this.setState({
          LocationID:
            groupData && groupData.length > 0
              ? groupData[0].GroupMemberLocationID
              : 1,
        });

      let userData = await commonData.getUserDetail();
      this.setState({ AssignedToUserID: userData.UserID });

      //this.setState({LocationID:this.this.props.route.params.})
    } else {
      //alert('getting offline data');
      //data =  await database.getTaskAsync(this.props.route.params.pageData.ClientAppID);
      //data = JSON.parse(data.taskData.TaskList.QueryData);
      //alert(JSON.stringify(data));
    }
  }
  loadEditData = async () => {
    let _selectedCategory =
      this.props.route.params.taskData.CategoryDesc +
      ">" +
      this.props.route.params.taskData.SubCategoryDesc +
      ">" +
      this.props.route.params.taskData.SubCategoryTaskDesc;
    //alert(_selectedCategory);
    this.setState({ selectedCategory: _selectedCategory });

    if (this.props.route.params.ActionRowID)
      this.setState({ RowID: this.props.route.params.ActionRowID });
    else this.setState({ RowID: this.props.route.params.taskData.RowID });

    this.setState({
      ActivityTypeID: this.props.route.params.taskData.ActivityTypeID,
    });
    this.setState({
      ActivityTypeTaskID: this.props.route.params.taskData.ActivityTypeTaskID,
    });
    this.setState({
      TaskStatusID: this.props.route.params.taskData.TaskStatusID,
    });
    this.setState({ TaskStatus: this.props.route.params.taskData.TaskStatus });
    this.setState({ TaskName: this.props.route.params.taskData.Title });
    this.setState({
      AssignedToUserID: this.props.route.params.taskData.AssignedToUserID,
    });
    this.setState({ Priority: this.props.route.params.taskData.Priority });

    this.setState({
      StartDate: moment(this.props.route.params.taskData.StartDate).format(
        "YYYY/MM/DD"
      ),
    });
    let desc = this.props.route.params.taskData.Description.startsWith("<div>")
      ? this.props.route.params.taskData.Description
      : "<div>" + this.props.route.params.taskData.Description + "</div>";

    this.setState({
      value: desc, //convertToObject(desc, this.customStyles),
    });
    //this.setState({Description:this.props.route.params.taskData.Description});
    this.setState({ LocationID: this.props.route.params.taskData.LocationID });
  };

  loadDLLDataFromServer = async () => {
    //alert(JSON.stringify(this.props.route.params));
    let objData = DynamicTaskData.getInstance();
    requestTaskDLLModel.ModuleId = this.props.route.params.pageData.ModuleID;
    requestTaskDLLModel.TaskID = this.props.route.params.taskData
      ? this.props.route.params.taskData.TaskID
      : 0;
    console.log("GroupAppID :", this.props.route.params.GroupAppID);
    requestTaskDLLModel.GroupAppId = this.props.route.params.GroupAppID;
    requestTaskDLLModel.AccessLevelId = 20;
    requestTaskDLLModel.GroupId = this.props.route.params.pageData.GroupID;
    requestTaskDLLModel.ModuleFeature =
      this.props.route.params.pageData.ModuleFeatureLevelID;

    let isConnected = false;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });

    let data = null;
    this.setState({ loading: true });
    if (isConnected) {
      //var a = this.props.route.params.pageData.GroupAppsList.split(',');
      data = await database.getTaskDLLAsync(
        this.props.route.params.pageData.GroupAppsList
      );

      //alert(data.taskDLL);
      if (data.taskDLL == null || data.taskDLL == "{}") {
        console.log("lading from server");

        data = await objData.getTaskDLLData((result) => {
          this.setDropdownData(result);
          if (
            this.props.route.params.pageData.ModuleID == 35 &&
            this.props.route.params.taskData &&
            this.props.route.params.taskData.TaskID > 0
          )
            this.setState({ disabledlocation: true });

          this.setState({ loading: false });
        });
      } else {
        console.log("lading from sql ligth1");
        //this.setState({loading:true});
        data = JSON.parse(data.taskDLL);
        //alert(JSON.stringify(data));
        this.setDropdownData(data);
        if (
          this.props.route.params.pageData.ModuleID == 35 &&
          this.props.route.params.taskData &&
          this.props.route.params.taskData.TaskID > 0
        )
          this.setState({ disabledlocation: true });
        this.setState({ loading: false });
      }
    } else {
      console.log("lading from sql ligth2");
      //this.setState({loading:true});
      data = await database.getTaskDLLAsync(
        this.props.route.params.pageData.GroupAppsList
      );
      data = JSON.parse(data.taskDLL);
      //alert(JSON.stringify(data));
      this.setDropdownData(data);
      if (
        this.props.route.params.pageData.ModuleID == 35 &&
        this.props.route.params.taskData &&
        this.props.route.params.taskData.TaskID > 0
      )
        this.setState({ disabledlocation: true });

      this.setState({ loading: false });
    }

    return data;
  };
  setDropdownData(data) {
    var locaitonList = [];
    var userList = [];
    var priorityList = [];
    var statusList = [];

    if (data.LocationList != null) {
      for (let i = 0; i < data.LocationList.length; i++) {
        var DLData = {
          label: data.LocationList[i].LocationName,
          value: data.LocationList[i].LocationID,
        };

        locaitonList.push(DLData);
      }
    }
    if (data.UserList != null) {
      for (let i = 0; i < data.UserList.length; i++) {
        var DLData = {
          label: data.UserList[i].UserName,
          value: data.UserList[i].UserID,
        };

        userList.push(DLData);
      }
    }
    if (data.ValuesList != null) {
      for (let i = 0; i < data.ValuesList.length; i++) {
        var DLData = {
          label: data.ValuesList[i].ListItemName,
          value: data.ValuesList[i].LOVID,
        };

        priorityList.push(DLData);
      }
    }
    if (data.StatusList != null) {
      for (let i = 0; i < data.StatusList.length; i++) {
        var DLData = {
          label: data.StatusList[i].Status,
          value: data.StatusList[i].StatusID,
        };

        statusList.push(DLData);
      }
    }
    this.setState({ LocationItems: locaitonList });
    this.setState({ UserItems: userList });
    this.setState({ PriorityItems: priorityList });
    this.setState({ StatusItems: statusList });
  }
  getPermissionAsync = async () => {
    // Camera roll Permission
    if (Platform.OS === "ios") {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    // Camera Permission
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  toggleActive = (name) => {
    const { active } = this.state;
    active[name] = !active[name];

    this.setState({ active });
  };

  renderHeader = () => {
    return (
      <Block center>
        {this.renderSearch()}
        {/* {options ? this.renderOptions() : null}
              {tabs ? this.renderTabs() : null} */}
      </Block>
    );
  };
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    navigation.goBack();
  };

  saveback = (taskmsg) => {
    const { back, navigation } = this.props;
    navigation.navigate("Tasks", { Type: "updated", msg: taskmsg });
    //navigation.goBack('focus');
  };

  renderNavigation = () => {
    debugger;
    const { back, title, white, transparent, navigation, scene, product } =
      this.props;

    const noShadow = ["Search", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    ];
    return (
      <Block style={headerStyles}>
        <NavBar
          back={true}
          title={
            <Block flex row shadow style={{ paddingLeft: 30 }}>
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
                  paddingRight: 0,
                  paddingTop: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                {this.props.route.params.taskData ? "Edit Task" : "Add Task"}
              </Text>
            </Block>
          }
          leftStyle={{ paddingTop: 2, flex: 0.2, fontSize: 18 }}
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
          // leftIconFamily="font-awesome"
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? "WHITE" : "ICON"] },
          ]}
          style={styles.navbar}
          //  rightStyle={{ alignItems: 'center' }}
          //  leftStyle={{ fontSize: 18 }}
          //  style={styles.navbar}
          onLeftPress={this.handleLeftPress}
        />
        {this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    );
  };

  returnData(data) {
    this.setState({ selectedCategory: data });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  refreshCateogry = (data) => {
    alert(data);
  };

  handleCameraType12 = () => {
    alert("calling");
    const { cameraType } = this.state;

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
    //let photo = await this.camera.takePictureAsync();
  };
  async takePictureAsync() {
    if (this.state.camera) {
      let photo = await this.state.camera
        .takePictureAsync({ base64: true })
        .then((res) => {
          //console.log(res)
          let imgarr = res.uri.split("/");
          this.setState({
            isCapturing: false,
            capturedPhotoBase64: res.base64,
            capturedPhoto: res.uri,
            imageName: imgarr[imgarr.length - 1],
          });
        });

      //this.setState({ capturedPhoto: photo.uri });
    }
  }
  async accessCamera() {
    this.setState({ isCapturing: true });
  }
  renderProducts = (scene) => {
    const { back, title, white, transparent, navigation } = this.props;
    const noShadow = ["Search", "Profile"];
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    ];

    const placeholder = {
      label: "Select a sport...",
      value: null,
      color: "#9EA0A4",
    };

    const showToast = () => {
      Toast.show({
        type: "erros",
        text1: "Hello",
      });
    };

    const saveTask = async () => {
      if (
        !this.state.ActivityTypeID ||
        this.state.ActivityTypeID == 0 ||
        !this.state.ActivityTypeTaskID ||
        this.state.ActivityTypeTaskID == 0
      ) {
        alert("Please select category");
        return;
      } else if (!this.state.Priority || this.state.Priority == 0) {
        alert("Please select priority");
        return;
      } else if (this.state.TaskName == "") {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Please add task',

        // });
        //alert("Please add task");
        alert("Please add task");
        return;
      } else if (this.state.AssignedToUserID == "") {
        Toast.show({
          type: "error",
          text1: "Please assign user",
        });
        //alert("Please add task");
        alert("Please assign user");
        return;
      }

      //alert(JSON.stringify(this.props.route.params.pageData));
      let objData = DynamicTaskData.getInstance();
      let commonData = CommonDataManager.getInstance();
      let clientData = await commonData.getClientDetail();
      //let d = JSON.parse(clientData);

      //alert(JSON.stringify(this.props.route.params));
      if (this.props.route.params.taskData) {
        requestTaskSaveModel.GroupAppID =
          this.props.route.params.taskData.groupappid;
        console.log("edit case groupAppId:", requestTaskSaveModel.GroupAppID);
      } else {
        console.log(" Add case groupAppId:", this.props.route.params.GroupAppI);
        if (
          this.props.route.params.GroupID &&
          this.props.route.params.GroupAppID
        ) {
          requestTaskSaveModel.GroupAppID = this.props.route.params.GroupAppID;
        } else {
          let groupApps =
            this.props.route.params.pageData.GroupAppsList.split(",");
          requestTaskSaveModel.GroupAppID =
            this.props.route.params.pageData.GroupAppsList;
        }
      }

      this.setState({ isProcessing: true });
      console.log("task data:", this.props.route.params.taskData);
      requestTaskSaveModel.TaskID = this.props.route.params.taskData
        ? this.props.route.params.taskData.TaskID
        : 0;
      //requestTaskSaveModel.GroupAppID = this.props.route.params.pageData.GroupAppID == 0 ? this.props.route.params.pageData.GroupAppsList : this.props.route.params.pageData.GroupAppID;
      requestTaskSaveModel.TaskNumber = this.props.route.params.taskData
        ? this.props.route.params.taskData.TaskNumber
        : 0;
      requestTaskSaveModel.TaskStatusID = this.state.TaskStatusID;
      requestTaskSaveModel.TaskName = this.state.TaskName;
      requestTaskSaveModel.AssignedToUserID = this.state.AssignedToUserID;
      requestTaskSaveModel.Priority = this.state.Priority;
      requestTaskSaveModel.StartDate = this.state.StartDate;
      requestTaskSaveModel.Description = convertToHtmlString(this.state.value);
      requestTaskSaveModel.LocationID = this.state.LocationID;
      requestTaskSaveModel.OriginalFileName = this.state.imageName;
      requestTaskSaveModel.Image = this.state.capturedPhotoBase64;
      requestTaskSaveModel.UTCOffSet = clientData.UTCOffSet;
      requestTaskSaveModel.TimeZone = clientData.TimeZone;
      requestTaskSaveModel.LastUpdatedDate = this.props.route.params.taskData
        ? this.props.route.params.taskData.UpdatedDate
        : null;
      requestTaskSaveModel.ServiceNodeType = this.props.route.params.taskData
        ? this.props.route.params.taskData.ServiceNodeType
        : 0;
      requestTaskSaveModel.ActivityTypeID = this.props.route.params.taskData
        ? this.props.route.params.taskData.ActivityTypeID
        : this.state.ActivityTypeID;
      requestTaskSaveModel.ActivityTypeTaskID = this.props.route.params.taskData
        ? this.props.route.params.taskData.ActivityTypeTaskID
        : this.state.ActivityTypeTaskID;
      requestTaskSaveModel.UpdatedDate = moment(new Date()).format(
        "YYYY/MM/DD"
      );
      // let location = await Location.getCurrentPositionAsync({});
      requestTaskSaveModel.Lat = this.state.lat;
      requestTaskSaveModel.Long = this.state.long;
      console.log("request for edit: ", JSON.stringify(requestTaskSaveModel));
      this.setState({ loading: true });

      let data = objData.SaveTaskData(
        (result) => {
          //alert(JSON.stringify(result));
          this.setState({ isProcessing: false });
          if (
            result.Result.ErrorMessage
              ? result.Result.ErrorMessage
              : result.Result.Errors[0]
          ) {
            this.setState({ loading: false });
            return;
          }

          if (result.Result) {
            this.setState({ loading: false });
            let message = this.props.route.params.taskData
              ? "Task has been updated!"
              : "Task has been created!";

            Toast.show({
              type: "success",
              text1: message,
            });

            this.saveback(message);
          }
        },
        (error) => {
          this.setState({ isProcessing: false });
          this.setState({ loading: false });
          alert("" + error);
        }
      );
    };

    const handleConfirm = (date) => {
      this.setState({ showStartDate: false });
      this.setState({ StartDate: moment(date).format("DD/MM/YYYY") });
    };

    const hideDatePicker = () => {
      this.setState({ showStartDate: false });
    };

    const setCamera = (ref) => {
      this.state.camera = ref;
    };
    return (
      <View>
        {!this.state.isCapturing ? (
          <View>
            {this.props.route.params.isfrommsg != true ? (
              <Block style={styles.shadow}>{this.renderNavigation()}</Block>
            ) : null}
            <Toast></Toast>
            <ScrollView contentContainerStyle={styles.products}>
              <Block flex style={{ paddingLeft: 30, paddingTop: 15 }}>
                <Text
                  size={18}
                  style={{ paddingBottom: 10 }}
                  bold
                  color={scheme === "dark" ? "#c7c5bd" : "#181818"}
                >
                  {this.props.route.params.item?.Number}
                </Text>
                {/* <TouchableOpacity 

onPress={() => this.props.navigation.navigate('TaskCategory', { pageData: this.props.route.params.pageData, GroupAppID: this.props.route.params.GroupAppID })}>
<Button round shadowless
                style={{
                  position: 'absolute',
                  right: 5,
                  top: -45, width:85  }}
                color='#EAE7E7'
                textStyle={styles.itembutton}
                 >{'Message'}</Button>
          
</TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("TaskCategory", {
                      pageData: this.props.route.params.pageData,
                      GroupAppID: this.props.route.params.GroupAppID,
                    })
                  }
                >
                  <Text
                    size={18}
                    bold
                    color={scheme === "dark" ? "#c7c5bd" : "#181818"}
                  >
                    Select Category
                  </Text>
                </TouchableOpacity>
                <Text
                  size={14}
                  bold
                  color={scheme === "dark" ? "#c7c5bd" : "#181818"}
                  style={{ paddingTop: 10 }}
                >
                  {this.state.selectedCategory}
                </Text>
              </Block>
              <Block flex style={styles.notification}>
                <Block center space="between">
                  <Block center>
                    <Input
                      bgColor="transparent"
                      placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                      borderless
                      color={scheme === "dark" ? "white" : "black"}
                      placeholder="Task Name"
                      autoCapitalize="none"
                      style={[styles.input]}
                      value={this.state.TaskName}
                      onChangeText={(text) =>
                        this.handleChange("TaskName", text)
                      }
                      onBlur={() => this.toggleActive("TaskName")}
                      onFocus={() => this.toggleActive("TaskName")}
                    />

                    {/* <Textarea
    containerStyle={styles.textareaContainer}
    style={styles.textarea}
    onChangeText={text => this.handleChange('Description', text)}
    defaultValue={this.state.Description}
    maxLength={120}
    placeholder={'Description'}
    placeholderTextColor={'#c7c7c7'}
    underlineColorAndroid={'transparent'}
  /> */}

                    <KeyboardAvoidingView
                      enabled
                      keyboardVerticalOffset={0}
                      style={{
                        flex: 1,
                        paddingTop: 10,
                        backgroundColor: "#eee",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.main}>
                          {/* <CNRichTextEditor
                            ref={(input) => (this.editor = input)}
                            value={this.state.value}
                            style={{ backgroundColor: "#fff" }}
                            styleList={defaultStyles}
                            onValueChanged={this.onValueChanged}
                          /> */}

                          {/* <RichTextEditor
                            minHeight={150}
                            value={this.state.value}
                            selectionColor="green"
                            actionMap={this.getActionMap()}
                            onValueChange={this.onValueChanged}
                            toolbarStyle={styles.toolbar}
                            editorStyle={styles.editor}
                          />
                          

                          <RichTextViewer
                            value={this.state.value}
                            editorStyle={styles.viewer}
                            linkStyle={styles.link}
                          /> */}
                          <SafeAreaView>
                            <ScrollView>
                              <KeyboardAvoidingView
                                behavior={
                                  Platform.OS === "ios" ? "padding" : "height"
                                }
                                style={{ flex: 1 }}
                              >
                                <RichToolbar
                                  editor={this.editor}
                                  actions={[
                                    actions.setBold,
                                    actions.setItalic,
                                    actions.setUnderline,
                                    actions.heading1,
                                  ]}
                                  iconMap={{
                                    [actions.heading1]: ({ tintColor }) => (
                                      <Text style={[{ color: tintColor }]}>
                                        H1
                                      </Text>
                                    ),
                                  }}
                                />
                                <RichEditor
                                  ref={this.editor}
                                  height={250}
                                  scrollEnabled={true}
                                  onChange={(descriptionText) => {
                                    this.setState({
                                      richText: descriptionText,
                                    });
                                  }}
                                />
                              </KeyboardAvoidingView>
                            </ScrollView>
                          </SafeAreaView>
                        </View>
                      </TouchableWithoutFeedback>

                      <View
                        style={{
                          minHeight: 45,
                        }}
                      >
                        <View style={styles.toolbarContainer}>
                          {/* <RichTextToolbar
                            style={{
                              height: 45,
                            }}
                            iconSetContainerStyle={{
                              flexGrow: 1,
                              justifyContent: "space-evenly",
                              alignItems: "center",
                            }}
                            size={28}
                            iconSet={[
                              {
                                type: "tool",
                                iconArray: [
                                  {
                                    toolTypeText: "bold",
                                    buttonTypes: "style",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-bold" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "italic",
                                    buttonTypes: "style",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-italic" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "underline",
                                    buttonTypes: "style",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-underline" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "lineThrough",
                                    buttonTypes: "style",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-strikethrough-variant" />
                                    ),
                                  },
                                ],
                              },
                              {
                                type: "seperator",
                              },
                              {
                                type: "tool",
                                iconArray: [
                                  {
                                    toolTypeText: "body",
                                    buttonTypes: "tag",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-text" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "title",
                                    buttonTypes: "tag",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-header-1" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "heading",
                                    buttonTypes: "tag",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-header-3" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "ul",
                                    buttonTypes: "tag",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-list-bulleted" />
                                    ),
                                  },
                                  {
                                    toolTypeText: "ol",
                                    buttonTypes: "tag",
                                    iconComponent: (
                                      <MaterialCommunityIcons name="format-list-numbered" />
                                    ),
                                  },
                                ],
                              },
                              {
                                type: "seperator",
                              },
                            ]}
                            selectedTag={this.state.selectedTag}
                            selectedStyles={this.state.selectedStyles}
                            // onStyleKeyPress={this.onStyleKeyPress}
                            backgroundColor="aliceblue" // optional (will override default backgroundColor)
                            color="gray" // optional (will override default color)
                            selectedColor="white" // optional (will override default selectedColor)
                            selectedBackgroundColor="deepskyblue" // optional (will override default selectedBackgroundColor)
                          /> */}
                        </View>
                      </View>
                    </KeyboardAvoidingView>

                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showStartDate: true });
                      }}
                    >
                      <Input
                        bgColor="transparent"
                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                        borderless
                        color={scheme === "dark" ? "white" : "black"}
                        placeholder="Start Date"
                        autoCapitalize="none"
                        style={[styles.input]}
                        value={this.state.StartDate}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={this.state.showStartDate}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />

                    {this.state.RowID > 0 ? (
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                          <Text
                            size={16}
                            style={{
                              textAlign: "left",
                              paddingLeft: 12,
                              paddingTop: 5,
                              color: scheme === "dark" ? "white" : "black",
                            }}
                          >
                            {" "}
                            {this.state.TaskStatus}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <RNPickerSelect
                        placeholder={{
                          label: "Status",
                          value: null,
                          color: "#9e9d98",
                        }}
                        placeholderTextColor="red"
                        items={this.state.StatusItems}
                        onValueChange={(value) => {
                          this.setState({
                            TaskStatusID: value,
                          });
                        }}
                        style={pickerSelectStyles}
                        // onUpArrow={() => {
                        //   this.inputRefs.firstTextInput.focus();
                        // }}
                        // onDownArrow={() => {
                        //   this.inputRefs.favSport1.togglePicker();
                        // }}

                        value={this.state.TaskStatusID}
                        // ref={el => {
                        //   this.inputRefs.favSport0 = el;
                        // }}
                      />
                    )}
                    <RNPickerSelect
                      placeholder={{
                        label: "Priority",
                        value: null,
                        color: "#9e9d98",
                      }}
                      placeholderTextColor="red"
                      items={this.state.PriorityItems}
                      onValueChange={(value) => {
                        this.setState({
                          Priority: value,
                        });
                      }}
                      style={pickerSelectStyles}
                      // onUpArrow={() => {
                      //   this.inputRefs.firstTextInput.focus();
                      // }}
                      // onDownArrow={() => {
                      //   this.inputRefs.favSport1.togglePicker();
                      // }}

                      value={this.state.Priority}
                      // ref={el => {
                      //   this.inputRefs.favSport0 = el;
                      // }}
                    />
                    <RNPickerSelect
                      disabled={this.setState.disabledlocation}
                      placeholder={{
                        label: "Location",
                        value: null,
                        color: "#9e9d98",
                      }}
                      placeholderTextColor="red"
                      items={this.state.LocationItems}
                      onValueChange={(value) => {
                        this.setState({
                          LocationID: value,
                        });
                      }}
                      style={pickerSelectStyles}
                      // onUpArrow={() => {
                      //   this.inputRefs.firstTextInput.focus();
                      // }}
                      // onDownArrow={() => {
                      //   this.inputRefs.favSport1.togglePicker();
                      // }}

                      value={this.state.LocationID}
                      // ref={el => {
                      //   this.inputRefs.favSport0 = el;
                      // }}
                    />
                    <RNPickerSelect
                      placeholder={{
                        label: "Assigned By",
                        value: null,
                        color: "#9e9d98",
                      }}
                      placeholderTextColor="red"
                      items={this.state.UserItems}
                      onValueChange={(value) => {
                        this.setState({
                          AssignedToUserID: value,
                        });
                      }}
                      value={this.state.AssignedToUserID}
                      style={pickerSelectStyles}
                    />

                    <TouchableOpacity
                      style={{
                        textAlign: "left",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 50,
                      }}
                      onPress={() => this.accessCamera()}
                    >
                      <FontAwesome
                        color={scheme === "dark" ? "white" : "black"}
                        name="camera"
                        size={30}
                        style={{ width: 350, paddingTop: 10 }}
                      />
                    </TouchableOpacity>

                    <Block flex top style={{ marginTop: 10 }}>
                      {this.state.capturedPhoto ? (
                        <Image
                          source={{ uri: this.state.capturedPhoto }}
                          style={{ width: 150, height: 150 }}
                        />
                      ) : null}
                    </Block>
                    <TouchableOpacity>
                      <Button
                        shadowless
                        style={{ height: 48, marginBottom: 30 }}
                        color={materialTheme.COLORS.BUTTON_COLOR}
                        onPress={() => {
                          saveTask();
                        }}
                      >
                        {this.state.isProcessing ? "Please Wait" : "Save Task"}
                      </Button>
                    </TouchableOpacity>
                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.container}>
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.fixedRatio}
              type={this.state.type}
              ratio={"1:1"}
            />

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 70,
              }}
              onPress={() => this.takePictureAsync()}
            >
              <FontAwesome
                color={scheme === "dark" ? "white" : "black"}
                name="camera"
                size={30}
                style={{ width: 50 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner - this.state.loading
          textContent={"Please wait..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
      </Block>
    );
  }
}

const scheme = Appearance.getColorScheme();
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    textShadowColor: "#f0f",
    //borderWidth: 1,
    //borderColor: 'gray',
    //borderRadius: 4,
    color: scheme === "dark" ? "white" : "black",
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,

    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: scheme === "dark" ? "white" : "black",
    marginStart: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
const styles = StyleSheet.create({
  test: {
    color: "red",
  },
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  home: {
    width: width,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  group: {
    paddingTop: theme.SIZES.BASE * 3.75,
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },

  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: scheme === "dark" ? "#181818" : "white",
    shadowColor: theme.COLORS.BLACK,
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
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 1,
  },
  navtitle: {
    fontSize: 17,
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 1,
  },
  rows: {
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 1.25,
  },
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 6,
    borderWidth: 0,
    minHeight: 72,
    margin: 0,
  },
  productTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 0.1,
  },
  productDescription: {
    paddingLeft: theme.SIZES.BASE / 1,
    margin: 0,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  searchbutton: {
    paddingLeft: 50,
    position: "relative",
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 8,
    right: 8,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  inputActive: {
    borderBottomColor: "white",
  },
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0,
  },
  categoryTitle: {
    textAlign: "left",
    height: "100%",
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textareaContainer: {
    height: 150,
    width: 350,
    padding: 0,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  textarea: {
    textAlignVertical: "top", // hack android
    height: 150,
    fontSize: 14,
    color: scheme === "dark" ? "white" : "#333",
    paddingLeft: 18,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  descareacontainer: {
    flex: 1,

    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  datePicker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  main: {
    flex: 1,
    width: 370,
    marginTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 1,
    alignItems: "stretch",
  },
  toolbarButton: {
    fontSize: 20,
    width: 28,
    height: 28,
    textAlign: "center",
  },
  italicButton: {
    fontStyle: "italic",
  },
  boldButton: {
    fontWeight: "bold",
  },
  underlineButton: {
    textDecorationLine: "underline",
  },
  lineThroughButton: {
    textDecorationLine: "line-through",
  },
  toolbarContainer: {
    minHeight: 45,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  itembutton: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: "black", //scheme === "dark" ? "white" : "#181818",
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  viewer: {
    borderColor: "green",
    borderWidth: 1,
    padding: 5,
    // fontFamily: 'Oswald_400Regular',
  },
  editor: {
    borderColor: "blue",
    borderWidth: 1,
    padding: 5,
    // fontFamily: 'Inter_500Medium',
    fontSize: 18,
  },
  toolbar: {
    borderColor: "red",
    borderWidth: 1,
  },
  link: {
    color: "green",
  },
});
