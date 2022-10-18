import React from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,

  Platform,
  View,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import { Block, Input, Text, theme } from "galio-framework";

import { LinearGradient } from "expo-linear-gradient";
import { materialTheme } from "../constants/";
import { HeaderHeight } from "../constants/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonDataManager from "../core/CommonDataManager";
import baseAPI, { setClientToken } from "../core/baseAPI";

import { Appearance } from 'react-native';
import { udatabase } from "../OfflineData/UserAyncDetail";

const { width } = Dimensions.get("window");
const requestModel = {
  ClientId: 0, // Store `username` when user enters their username
  HostApplicationType: "",
  MarketAdminUser: 0, // Store `password` when user enters their password
  MarketSuperClientID: 0,
  SignedInUserId: 0,
  UserId: 0,
};

export default class Organisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      clientFilerList: {},
      clientList: {},
      errors: {},
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("clientList").then((result) => {
      if (result) {
        this.setState({ clientList: JSON.parse(result) });
        this.setState({ clientFilerList: JSON.parse(result) });
        //console.log(this.state.clientList);
      }
    });
  }

  render() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const scheme = Appearance.getColorScheme();

    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        const newData = this.state.clientList.filter(function (item) {
          const itemData = item.ClientName
            ? item.ClientName.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });

        this.setState({ clientFilerList: newData });
      } else {
        this.setState({ clientFilerList: this.state.clientList });
      }
    };

    const getItem = async (item) => {
      //alert(JSON.stringify(item));
      // Function for click on an item
      let commonData = CommonDataManager.getInstance();

      commonData.setClientDetail(item);
      await udatabase.setupUserDataAsync("clientdetail", item);
      AsyncStorage.setItem("clientdetail", JSON.stringify(item));

      let userData = await commonData.getUserDetail();
      //alert(JSON.stringify(item));
      requestModel.UserId = userData.UserID;
      requestModel.SignedInUserId = userData.UserID;
      requestModel.ClientId = item.ClientID;
      requestModel.HostApplicationType = "10";
      requestModel.MarketSuperClientID = item.MarketSuperClientID;
      requestModel.MarketAdminUser = 1; //(item.MarketAdminUser && item.MarketAdminUser  > 0) ? 1 : 0;
      //alert(JSON.stringify(item));

      const onSuccess = async ({ data }) => {
        //alert('test');
        //alert(JSON.stringify(data.Result.Token));
        if (
          data.Result.ErrorMessage != "" &&
          data.Result.ErrorMessage != null
        ) {
          alert(data.Result.ErrorMessage);
          return false;
        }
        //alert(JSON.stringify(data.Result.ClientApps));
        //alert(JSON.stringify(data.Result.Modules));
        //console.log(data.Result.Groups);
        //console.log(data.Result.Modules);

        setClientToken(data.Result.Token);
        commonData.setClientAppData(data.Result.ClientApps);
        commonData.setMenuData(data.Result);
        commonData.setGroupDetail(data.Result.Groups);
        commonData.setModuleDetail(data.Result.Modules);

        //await udatabase.setupUserDataAsync('menuData', data.Result);
        await udatabase.setupUserDataAsync(
          "clientApps",
          data.Result.ClientApps
        );
        await udatabase.setupUserDataAsync("groupData", data.Result.Groups);
        await udatabase.setupUserDataAsync("moduleData", data.Result.Modules);
        //await udatabase.setupUserDataAsync(requestModel.UserName, 'userdetail', data.Result.Modules);

        let _clientAppData = data.Result.ClientApps.filter(
          (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
        );

        //alert('navigating');
        const { navigate } = this.props.navigation;
        navigate("App", { clientAppData: _clientAppData });
      };

      const onFailure = (error) => {
        alert(JSON.stringify(error));
        console.log(error && error.response);
        this.setState({ errors: error.response.data, isLoading: false });
      };

      // Show spinner when call is made
      this.setState({ isLoading: true });

      baseAPI
        .post("Organisation/GetUserAppsList", requestModel)
        .then(onSuccess)
        .catch(onFailure);

      //alert('Id : ' + item.ClientID + ' Title : ' + item.ClientName);
    };

    const ItemView = ({ item }) => {
      return (
        // Flat List Item
        <Text style={styles.itemStyle} onPress={() => getItem(item)}>
          {item.ClientName.toUpperCase()}
        </Text>
      );
    };

    const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View
          style={{
            height: 0.5,
            width: "100%",
            backgroundColor: "#C8C8C8",
          }}
        />
      );
    };

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1.1 }}
        locations={[0.2, 1]}
        colors={[scheme === "dark" ? "#181818" : "#FCFCFC", "#17a2b8"]}
        style={[styles.signin, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
      >
        <Block flex middle>
          <KeyboardAvoidingView behavior="padding" enabled>
            <Block middle>
              <Block
                row
                center
                space="between"
                style={{ marginVertical: theme.SIZES.BASE * 5 }}
              >
                <Block flex middle center>
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/logo.png")}
                  />
                </Block>
              </Block>
            </Block>

            <Block flex>
              <Block center>
                <SafeAreaView style={{ flex: 1 }}>
                  <View
                    style={
                      scheme === "dark"
                        ? styles.darkcontainer
                        : styles.container
                    }
                  >
                    <Input
                      bgColor="transparent"
                      placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                      borderless
                      color={scheme === "dark" ? "white" : "black"}
                      placeholder="Select Organisation"
                      autoCapitalize="none"
                      style={[styles.input]}
                      onChangeText={(text) => searchFilterFunction(text)}
                    />

                    <FlatList
                      data={this.state.clientFilerList}
                      keyExtractor={(item, index) => index.toString()}
                      ItemSeparatorComponent={ItemSeparatorView}
                      renderItem={ItemView}
                    />
                  </View>
                </SafeAreaView>
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </Block>
      </LinearGradient>
    );
  }
}

const scheme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  signin: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  inputActive: {
    borderBottomColor: scheme === "dark" ? "white" : "black",
  },
  container: {
    backgroundColor: "white",
  },
  darkcontainer: {
    backgroundColor: "#181818",
  },
  itemStyle: {
    padding: 10,
    color: scheme === "dark" ? "white" : "black",
  },
  textInputStyle: {
    height: 30,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: scheme === "dark" ? "white" : "black",
  },
});
