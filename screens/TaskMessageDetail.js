import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Platform,
 
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Block, NavBar, Text, Input, theme } from "galio-framework";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from "../components/";
import Toast from "react-native-toast-message";
import materialTheme from "../constants/Theme";
import { AntDesign, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Textarea from "react-native-textarea";

import DynamicMessageData, {
  
  requestGetQuery,
  requestSetQuery,
} from "../Data/DynamicMessageData";

import NetInfo from "@react-native-community/netinfo";

import { Appearance } from 'react-native';

import Spinner from "react-native-loading-spinner-overlay";

var msgtimer = null;
export default class TaskMessageDetail extends React.Component {
  constructor(props) {
    super(props);
    //alert('message screen called1');

    this.state = {
      messageData: [],
      queryData: [],
      MsgText: null,
      messagefullData: null,
      isLoading: false,
      errors: {},
      selectedData: {},
      isexpand: "false",
      isSearchShow: false,
      loading: false,
      SupportReadStatus: false,
      TaskDetailKeyValue: null,
      searchtext: "",
      Subject: "",
      Message: "",
      isProcessing: false,
      active: {
        Subject: false,
        Message: false,
      },
      isreply: false,
    };
  }

  async componentDidMount() {
    this.setState({ searchtext: "" });

    let isConnected = true;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
    this.getQuery();
  }
  async getQuery() {
    let objData = DynamicMessageData.getInstance();

    //requestTaskMessageModel.SPName = 'getMessagesForUser';
    console.log(JSON.stringify(this.props.route.params));
    if (this.props.route.params.screenmode == "edit") {
      this.setState({ isreply: false });
      this.setState({
        Subject: this.props.route.params.item.Subject
          ? this.props.route.params.item.Subject
          : this.props.route.params.item.Title,
      });
      requestGetQuery.AppliesToOCID = this.props.route.params.taskItem.RowID;
      requestGetQuery.QueryID = this.props.route.params.item.RowID;

      this.setState({ loading: true });

      let res = await objData.getDynamicGetQueryData((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.setState({ MsgText: JSON.parse(res.MsgText) });
        this.setState({ queryData: res });
      });
    } else this.setState({ isreply: true });
  }
  async setQuery(action) {
    //alert(JSON.stringify(this.props.route.params.taskItem));
    let objData = DynamicMessageData.getInstance();
    requestSetQuery.ActionName = action; //"Submit";
    requestSetQuery.AppliesToOCID = this.props.route.params.taskItem.RowID;
    requestSetQuery.LastUpdatedDate =
      this.props.route.params.taskItem.UpdatedDate;
    requestSetQuery.UpdatedDate = new Date().toDateString();
    requestSetQuery.ModuleId = 0;
    requestSetQuery.MsgDraftText = this.state.Message;
    requestSetQuery.MsgSubject = this.state.Subject;
    requestSetQuery.MsgID = 0;
    requestSetQuery.MsgTypeID = 20;
    requestSetQuery.UserGroupAppID =
      this.props.route.params.taskItem.groupappid;
    //requestTaskMessageModel.SPName = 'getMessagesForUser';
    if (this.props.route.params.screenmode == "edit") {
      requestSetQuery.AppliesToOCID = this.state.queryData.AppliesToOCID;
      requestSetQuery.AdminNotes = this.state.queryData.AdminNotes;
      requestSetQuery.AppliesToMsgID = this.state.queryData.AppliesToMsgID;
      requestSetQuery.AppliesToOCID = this.state.queryData.AppliesToOCID;
      requestSetQuery.ClientActionRowID =
        this.state.queryData.ClientActionRowID;
      requestSetQuery.ClientUserGroupAppID =
        this.state.queryData.ClientUserGroupAppID;
      requestSetQuery.ContractorActionRowID =
        this.state.queryData.ContractorActionRowID;
      requestSetQuery.ContractorUserGroupAppID =
        this.state.queryData.ContractorUserGroupAppID;
      requestSetQuery.CreatedByUserID = this.state.queryData.CreatedByUserID;
      requestSetQuery.CreatedDate = this.state.queryData.CreatedDate;
      requestSetQuery.JobNumber = this.state.queryData.JobNumber;
      requestSetQuery.LastUpdatedDate = this.state.queryData.LastUpdatedDate;
      requestSetQuery.ModuleId = this.state.queryData.ModuleId;

      requestSetQuery.MsgDraftTextAdmin =
        this.state.queryData.MsgDraftTextAdmin;
      requestSetQuery.MsgID = this.state.queryData.MsgID;
      requestSetQuery.MsgNumber = this.state.queryData.MsgNumber;
      requestSetQuery.MsgStatus = this.state.queryData.MsgStatus;
      requestSetQuery.MsgStatusID = this.state.queryData.MsgStatusID;
      requestSetQuery.MsgSubject = this.state.Subject;
      requestSetQuery.MsgText = this.state.queryData.MsgText;
      requestSetQuery.MsgTypeID = this.state.queryData.MsgTypeID;
      requestSetQuery.ObjectKey = this.state.queryData.ObjectKey;
      requestSetQuery.ParentOCID = this.state.queryData.ParentOCID;
      requestSetQuery.RaisedByUserID = this.state.queryData.RaisedByUserID;
      requestSetQuery.RaisedByUserName = this.state.queryData.RaisedByUserName;
      requestSetQuery.UpdatedByUserID = this.state.queryData.UpdatedByUserID;
      requestSetQuery.UpdatedDate = this.state.queryData.UpdatedDate;
      //requestSetQuery.UserGroupAppID = this.state.queryData.UserGroupAppID;
    }
    const { back, navigation } = this.props;
    //navigation.navigate('TaskDetail', {pageData : this.props.route.params.pageData, taskData:this.props.route.params.taskItem,  item:this.props.route.params.item, isfrommsg: false, ismsgrefresh:true});
    this.setState({ loading: true });
    //alert(JSON.stringify(requestSetQuery));
    let result = await objData.getDynamicSetQueryData((res) => {
      Toast.show({
        type: "success",
        text1: "Message has been saved.",
      });
      this.setState({ loading: false });
      if (this.props.route.params.screenmode == "edit") this.getQuery();
      else
        navigation.navigate("TaskDetail", {
          pageData: this.props.route.params.pageData,
          taskData: this.props.route.params.taskItem,
          item: this.props.route.params.item,
          isfrommsg: false,
        });
    });
  }
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
         style={{...styles.headerColor, ...styles.navbar}}
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
                  paddingTop: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                {"Message Detail"}
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
         
        />
        {/* { this.state.isSearchShow ? this.renderHeader() : null} */}
      </Block>
    );
  };

  handleSearch = async (text) => {
    this.setState({ searchtext: text });
    if (text) {
      let masterDataSource = this.state.messagefullData;
      var results = [];
      var index;
      var entry;

      text = text.toUpperCase();
      for (index = 0; index < masterDataSource.length; ++index) {
        entry = masterDataSource[index];
        //alert(entry.Number);
        if (
          entry &&
          entry.RowID &&
          entry.RowID.toString().indexOf(text) !== -1
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

      this.setState({ messageData: results });
    } else {
      this.setState({ messageData: this.state.messagefullData });
    }
  };

  renderSearch = () => {
    const { navigation } = this.props;
    const { text } = this.state;
    return (
      <Input
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

  renderHeader = () => {
    return (
      <Block center style={styles.headerColor}>
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
  showSearch = () => {
    if (this.state.isSearchShow) {
      this.setState({ isSearchShow: false });
      this.handleSearch("");
    } else this.setState({ isSearchShow: true });
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  toggleActive = (name) => {
    const { active } = this.state;
    active[name] = !active[name];

    this.setState({ active });
  };

  showreply() {
    if (this.state.isreply == true) this.setState({ isreply: false });
    else this.setState({ isreply: true });
  }

  closemessage() {
    this.setQuery("Close");
  }

  renderProducts = (navigation, scene) => {
    const { back, title, white, transparent } = this.props;

    return (
      <View>
        <Block style={styles.shadow}>{this.renderNavigation()}</Block>
        <Toast></Toast>
        {this.props.route.params.screenmode == "edit" ? (
          <Block>
            <Block row space="between">
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  marginLeft: 10,
                  color: scheme === "dark" ? "#17a2b8" : "#181818",
                }}
              >
                {" "}
                Number: {this.state.queryData?.MsgNumber}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  marginLeft: 10,
                  color: scheme === "dark" ? "#17a2b8" : "#181818",
                }}
              >
                {" "}
                Job Number: {this.state.queryData?.JobNumber}
              </Text>
              <Text> {""}</Text>
            </Block>
            <Block row space="between">
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  marginLeft: 10,
                  color: scheme === "dark" ? "#17a2b8" : "#181818",
                }}
              >
                {" "}
                Status: {this.state.queryData?.MsgStatus}
              </Text>
            </Block>
            <Block row space="between">
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  marginLeft: 10,
                  color: scheme === "dark" ? "#17a2b8" : "#181818",
                }}
              >
                {" "}
                Raised By: {this.state.queryData?.RaisedByUserName}
              </Text>
            </Block>
          </Block>
        ) : null}
        <Block
          flex
          showsVerticalScrollIndicator={false}
          style={styles.products}
        >
          <Spinner
            //visibility of Overlay Loading Spinner
            visible={this.state.loading}
            //Text with the Spinner
            textContent={"Please wait..."}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />

          <Block flex style={styles.notification}>
            <ScrollView contentContainerStyle={styles.products}>
              <Block flex style={styles.notification}>
                <Block space="between">
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    {this.props.route.params.screenmode == "edit" ? (
                      <TouchableOpacity
                        style={{ paddingLeft: 12, paddingTop: 10 }}
                        onPress={() => this.showreply()}
                      >
                        <FontAwesome
                          name="pencil"
                          size={18}
                          color={
                            scheme === "dark" ? "white" : theme.COLORS["ICON"]
                          }
                        >
                          {" "}
                          Reply Message
                        </FontAwesome>
                      </TouchableOpacity>
                    ) : null}
                    {this.props.route.params.screenmode == "edit" ? (
                      <TouchableOpacity
                        style={{ paddingLeft: 12, paddingTop: 10 }}
                        onPress={() => this.closemessage()}
                      >
                        <AntDesign
                          name="close"
                          size={18}
                          color={
                            scheme === "dark" ? "white" : theme.COLORS["ICON"]
                          }
                        >
                          {" "}
                          Close
                        </AntDesign>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Block center>
                    <Input
                      bgColor="transparent"
                      placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                      borderless
                      color={scheme === "dark" ? "white" : "black"}
                      placeholder="Subject"
                      autoCapitalize="none"
                      style={[styles.input]}
                      value={this.state.Subject}
                      onChangeText={(text) =>
                        this.handleChange("Subject", text)
                      }
                      onBlur={() => this.toggleActive("Subject")}
                      onFocus={() => this.toggleActive("Subject")}
                    />
                    {this.state.isreply == true ? (
                      <Textarea
                        containerStyle={styles.textareaContainer}
                        style={styles.textarea}
                        onChangeText={(text) =>
                          this.handleChange("Message", text)
                        }
                        defaultValue={this.state.Message}
                        maxLength={500}
                        placeholder={"Message"}
                        placeholderTextColor={"#c7c7c7"}
                        underlineColorAndroid={"transparent"}
                      />
                    ) : null}
                  </Block>
                  {this.state.isreply == true ? (
                    <Block style={{ paddingLeft: 10, textAlign: "left" }}>
                      <Button
                        shadowless
                        style={{
                          height: 38,
                          width: 90,
                          marginBottom: 30,
                          fontWeight: "bold",
                        }}
                        color={materialTheme.COLORS.BUTTON_COLOR}
                        onPress={() => {
                          this.setQuery("Submit");
                        }}
                      >
                        {this.state.isProcessing ? "Please Wait" : "Submit"}
                      </Button>
                    </Block>
                  ) : null}
                  <Block>
                    {this.state.MsgText
                      ? this.state.MsgText.map((text) => {
                          return (
                            <Block>
                              <Block
                                style={styles.msgitem}
                                column
                                space="between"
                              >
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    marginTop: 2,
                                    marginLeft: 10,
                                    color:
                                      scheme === "dark" ? "#17a2b8" : "#181818",
                                  }}
                                >
                                  {" "}
                                  {text.Message}
                                </Text>
                                <View style={{ alignItems: "flex-end" }}>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 10,
                                      paddingRight: 20,
                                      fontSize: 10,
                                      color:
                                        scheme === "dark"
                                          ? "#17a2b8"
                                          : "#181818",
                                    }}
                                  >
                                    {text.Name} on {text.Date}
                                  </Text>
                                </View>
                              </Block>
                              {/* <Block row space="between">
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    marginTop: 10,
                                    marginLeft: 10,
                                    color:
                                      scheme === "dark" ? "#17a2b8" : "#181818",
                                  }}
                                >
                                  {" "}
                                  {text.Name} on {text.Date}
                                </Text>
                              </Block> */}
                            </Block>
                          );
                        })
                      : null}
                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </Block>
        </Block>
      </View>
    );
  };

  render() {
    //alert(JSON.stringify(this.state.messageData));
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
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
    color: "black",
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
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notification: {
    paddingVertical: theme.SIZES.BASE / 3,
    color: scheme === "dark" ? "white" : "#181818",
  },
  title: {
    marginTop: 0,
    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 0.4,
    color: scheme === "dark" ? "white" : "#181818",
  },
  titlebold: {
    marginTop: 0,
    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 0.4,
    color: scheme === "dark" ? "white" : "#181818",
    fontWeight: "600",
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
    minHeight: 60,
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
    margin: 10,
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
    width: width - theme.SIZES.BASE * 5,
  },
  searchbutton: {
    paddingLeft: 50,
    paddingTop: 15,
    position: "relative",
  },
  options: {
    paddingHorizontal: theme.SIZES.BASE / 2,
  },
  optionsText: {
    fontSize: theme.SIZES.BASE * 1,
    color: scheme === "dark" ? "white" : "#181818",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  textcolor: {
    color: scheme === "dark" ? "#17a2b8" : "#181818",
  },
  optionsButton: {
    width: "auto",
    height: 32,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 2,
  },
  button: {
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
    color: scheme === "dark" ? "white" : "black",
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  taskitem: {
    width: "100%", // is 50% of container width
    paddingTop: 2,
    paddingBottom: 2,
  },
  textareaContainer: {
    height: 250,
    width: 350,
    padding: 0,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  textarea: {
    textAlignVertical: "top", // hack android
    height: 250,
    fontSize: 14,
    color: scheme === "dark" ? "white" : "#333",
    paddingLeft: 18,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },

  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 6,
    borderWidth: 0,
    minHeight: 72,
    margin: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 1,
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
  productTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 0.1,
  },
  productDescription: {
    paddingLeft: theme.SIZES.BASE / 1,
    margin: 0,
  },
  msgitem: {
    width: "100%", // is 50% of container width
    margin: 5,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
