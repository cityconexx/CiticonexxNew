import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
} from "react-native";
import { Button, Block, NavBar, Text, Input, theme } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from "../components/";

import materialTheme from "../constants/Theme";
import { Appearance } from "react-native";
import * as Notifications from "expo-notifications";
import NetInfo from "@react-native-community/netinfo";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class SendNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Title: "",
      Body: "",
      deviceToken: "",
      selectedCategory: "",
      isProcessing: false,
    };
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      AsyncStorage.getItem("deviceToken").then((result) => {
        //alert(result)
        this.setState({ deviceToken: result });
      });
    });

    let isConnected = false;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
  }
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  renderHeader = () => {
    return (
      <Block center>
        {/* {this.renderSearch()} */}
        {/* {options ? this.renderOptions() : null}
              {tabs ? this.renderTabs() : null} */}
      </Block>
    );
  };
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    navigation.goBack();
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
                {"Notification"}
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

  returnData(data) {}

  componentWillUnmount() {
    this._unsubscribe();
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

    const sendNotification = async () => {
      const message = {
        to: this.state.deviceToken,
        sound: "default",
        title: this.state.Title,
        body: this.state.Body,
        data: { someData: "goes here" },
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    };

    return (
      <View>
        <Block style={styles.shadow}>{this.renderNavigation()}</Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}
        >
          <Block flex style={{ paddingLeft: 30, paddingTop: 15 }}>
            <Text
              size={14}
              bold
              color={scheme === "dark" ? "#c7c5bd" : "#181818"}
              style={{ paddingTop: 10 }}
            >
              {"Send Notification"}
            </Text>
          </Block>
          <Block flex style={styles.notification}>
            <Block flex={1} center space="between">
              <Block center>
                <Text
                  size={14}
                  bold
                  color={scheme === "dark" ? "#c7c5bd" : "#181818"}
                  style={{ paddingTop: 10 }}
                >
                  {this.state.deviceToken}
                </Text>
                <Input
                  bgColor="transparent"
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  borderless
                  color={scheme === "dark" ? "white" : "black"}
                  placeholder="Title"
                  autoCapitalize="none"
                  style={[styles.input]}
                  value={this.state.Title}
                  onChangeText={(text) => this.handleChange("Title", text)}
                />

                <Input
                  bgColor="transparent"
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  borderless
                  color={scheme === "dark" ? "white" : "black"}
                  placeholder="Body"
                  autoCapitalize="none"
                  style={[styles.input]}
                  value={this.state.Body}
                  onChangeText={(text) => this.handleChange("Body", text)}
                />
              </Block>

              <Block flex top style={{ marginTop: 20 }}>
                {this.state.capturedPhoto ? (
                  <Image
                    source={{ uri: this.state.capturedPhoto }}
                    style={{ width: 150, height: 150 }}
                  />
                ) : null}

                <Button
                  shadowless
                  style={{ height: 48 }}
                  color={materialTheme.COLORS.BUTTON_COLOR}
                  onPress={sendNotification}
                >
                  {this.state.isProcessing
                    ? "Please Wait"
                    : "Send Notificaiton"}
                </Button>
              </Block>
            </Block>
          </Block>
        </ScrollView>
      </View>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
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
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
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
});
