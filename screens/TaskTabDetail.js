import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Appearance,
  Image,
} from "react-native";
import { Block, NavBar, Text, Input, theme } from "galio-framework";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from "../components/";

import materialTheme from "../constants/Theme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import AddTaskScreen from "./AddTask";
import TaskMessages from "./TaskMessages";
import QuoteScreen from "./quotes/AddQuotes";

const Tab = createMaterialTopTabNavigator();

export default class TaskTabDetail extends React.Component {
  constructor(props) {
    super(props);
  }

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
                  paddingTop: 0,
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                {"Task Detail"}
              </Text>
            </Block>
          }
          leftStyle={{ paddingTop: 0, flex: 0.2, fontSize: 18 }}
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
      </Block>
    );
  };

  render() {
    return (
      <>
        {this.renderNavigation()}
        <Tab.Navigator>
          <Tab.Screen
            name="Detail"
            children={() => <AddTaskScreen {...this.props} />}
          />
          {this.props.route.params.taskData.ServiceNodeType == 30 ||
          this.props.route.params.taskData.ServiceNodeType == 15 ? (
            <Tab.Screen
              name="Quote"
              children={() => <QuoteScreen {...this.props} />}
            />
          ) : null}
          <Tab.Screen
            name="Messages"
            children={() => <TaskMessages {...this.props} />}
          />
        </Tab.Navigator>
      </>
    );
  }
}

const scheme = Appearance.getColorScheme();

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
});
