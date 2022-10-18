import React from "react";
import {
  StyleSheet,
  Switch,
  FlatList,
  Platform,
  TouchableOpacity,
  
  View,
} from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";

import materialTheme from "../constants/Theme";
import CommonDataManager from "../core/CommonDataManager";

import { Appearance } from 'react-native';
import { udatabase } from "../OfflineData/UserAyncDetail";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    //alert(JSON.stringify(props));
    //alert(this.props.route.params.GroupAppID);
    this.state = {
      clientAppData: null,
      userData: null,
      clientData: null,
    };
  }
  async componentDidMount() {
    let commonData = CommonDataManager.getInstance();
    let clientAppsData = await commonData.getClientAppData();
    //alert(JSON.stringify(clientAppsData));
    //clientAppsData = JSON.parse(clientAppsData.userData);
    clientAppsData = clientAppsData.filter(
      (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
    );

    const userData = await commonData.getUserDetail();
    const clientData = await commonData.getClientDetail();

    this.setState({ clientAppData: clientAppsData });
    this.setState({ userData: userData });
    this.setState({ clientData: clientData });
  }
  toggleSwitch = (switchNumber) =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    //alert(JSON.stringify(item));
    switch (item.type) {
      case "switch":
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text size={14}>{item.title}</Text>
            <Switch
              onValueChange={() => this.toggleSwitch(item.id)}
              ios_backgroundColor={materialTheme.COLORS.SWITCH_OFF}
              thumbColor={
                Platform.OS === "android"
                  ? materialTheme.COLORS.SWITCH_OFF
                  : null
              }
              trackColor={{
                false: materialTheme.COLORS.SWITCH_OFF,
                true: materialTheme.COLORS.SWITCH_ON,
              }}
              value={this.state[item.id]}
            />
          </Block>
        );
      case "button":
        return (
          <Block style={styles.rows}>
            <TouchableOpacity>
              <Block row middle space="between" style={{ paddingTop: 7 }}>
                <Text size={14} color="scheme === 'dark' ? 'white' : 'black'">
                  {item.ReportMenuLabel}
                </Text>
                <Icon
                  name="angle-right"
                  family="font-awesome"
                  style={{ paddingRight: 5 }}
                />
              </Block>
            </TouchableOpacity>
          </Block>
        );
      default:
        break;
    }
  };

  renderMenuItem = ({ item }) => {
    const { navigate } = this.props.navigation;

    return (
      <Block style={styles.rows}>
        <TouchableOpacity onPress={() => this.getItem(item)}>
          <Block
            row
            middle
            space="between"
            style={{
              paddingTop: 7,
              color: scheme === "dark" ? "white" : "black",
            }}
          >
            <Icon
              name="bars"
              family="font-awesome"
              style={{
                paddingRight: 5,
                color: scheme === "dark" ? "white" : "black",
              }}
            >
              <Text
                size={16}
                style={{
                  paddingLeft: 0,
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                {item.ReportMenuLabel}
              </Text>
            </Icon>
            <Icon
              name="angle-right"
              family="font-awesome"
              style={{
                paddingRight: 5,
                color: scheme === "dark" ? "white" : "black",
              }}
            />
          </Block>
        </TouchableOpacity>
      </Block>
    );
  };
  logout = () => {
    udatabase.clearAllData();
    this.props.navigation.navigate("Login");
  };
  openNotificaiton = () => {
    this.props.navigation.navigate("Notification");
  };
  openLog = () => {
    this.props.navigation.navigate("Logs");
  };
  openScanner = () => {
    this.props.navigation.navigate("Scanner");
  };

  render() {
    //alert(JSON.stringify(clientData));
    return (
      <View style={styles.settings}>
        <Block center style={styles.title}>
          <Text
            bold
            size={theme.SIZES.BASE}
            style={{
              paddingBottom: 5,
              color: scheme === "dark" ? "white" : "black",
            }}
          >
            {this.state.clientData ? this.state.clientData.ClientName : ""}
          </Text>
          <Text
            size={12}
            color={scheme === "dark" ? "white" : materialTheme.COLORS.CAPTION}
          >
            {this.state.userData ? this.state.userData.FullName : ""},{" "}
            {this.state.userData ? this.state.userData.Email : ""}
          </Text>
        </Block>
        <Block style={styles.rows}>
          <TouchableOpacity onPress={() => this.openLog()}>
            <Block row middle space="between" style={{ paddingTop: 15 }}>
              <Text size={16} color={scheme === "dark" ? "white" : "black"}>
                Logs
              </Text>
              <Icon
                name="angle-right"
                family="font-awesome"
                style={{
                  paddingRight: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              />
            </Block>
          </TouchableOpacity>
          {/* <TouchableOpacity   onPress={ () => this.openNotificaiton() }>
          <Block row middle space="between" style={{paddingTop:15}}>
            <Text size={14} color={scheme === "dark" ? "white" : materialTheme.COLORS.CAPTION}>Send Notification</Text>
            <Icon name="angle-right" family="font-awesome" style={{ paddingRight: 5, color: scheme === "dark" ? "white" : "black" }} />
          </Block>

        </TouchableOpacity> */}
        </Block>
        <Block style={styles.rows}>
          <TouchableOpacity onPress={() => this.openScanner()}>
            <Block row middle space="between" style={{ paddingTop: 15 }}>
              <Text size={16} color={scheme === "dark" ? "white" : "black"}>
                Scan
              </Text>
              <Icon
                name="angle-right"
                family="font-awesome"
                style={{
                  paddingRight: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              />
            </Block>
          </TouchableOpacity>
        </Block>
        <Block style={styles.rows}>
          <TouchableOpacity onPress={() => this.logout()}>
            <Block row middle space="between" style={{ paddingTop: 15 }}>
              <Text size={16} color={scheme === "dark" ? "white" : "black"}>
                Logout
              </Text>
              <Icon
                name="angle-right"
                family="font-awesome"
                style={{
                  paddingRight: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              />
            </Block>
          </TouchableOpacity>
        </Block>
        <Block style={{ paddingRight: 10 }}>
          <Block center style={styles.title}>
            <Text
              bold
              size={theme.SIZES.BASE}
              style={{
                paddingTop: 15,
                paddingBottom: 15,
                color: scheme === "dark" ? "white" : "black",
              }}
            >
              All Menus
            </Text>
          </Block>

          <FlatList
            data={this.state.clientAppData}
            keyExtractor={(item, index) => item.ClientAppID}
            renderItem={this.renderMenuItem}
          />
        </Block>
      </View>
    );
  }

  getItem = async (item) => {
    const { back, navigation } = this.props;
    navigation.navigate("Tasks", { pageData: item });
  };
}

const scheme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
    color: scheme === "dark" ? "white" : "black",
  },
  rows: {
    //height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
    color: scheme === "dark" ? "white" : "black",
  },
  paddingitem: {
    paddingBottom: 10,
    paddingTop: 10,
  },
});
