import React from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Image,
  Appearance,
} from "react-native";
import { Block, Button, Input, Text, theme } from "galio-framework";

import { LinearGradient } from "expo-linear-gradient";
import { materialTheme } from "../constants/";
import { HeaderHeight, iPhoneX } from "../constants/utils";

const { width } = Dimensions.get("window");
import baseAPI, { setClientToken } from "../core/baseAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonDataManager from "../core/CommonDataManager";
import { EvilIcons } from "@expo/vector-icons";
import { udatabase } from "../OfflineData/UserAyncDetail";
const requestModel = {
  UserName: "diveshps@hotmail.com", //'divesh.singh@cityconexx.com.au', // diveshps@hotmail.com       // Store `username` when user enters their username
  Password: "maharaj24",
  MarketSuperClientID: 289, // Store `password` when user enters their password
  KeepMeSignIn: false,
  DeviceToken: "",
};

const initialState = {
  email: "diveshps@hotmail.com", //'divesh.singh@cityconexx.com.au',        // Store `username` when user enters their username
  password: "maharaj24", // Store `password` when user enters their password
  errors: {}, // Store error data from the backend here
  isAuthorized: false, // If auth is successful, set this to `true`
  isLoading: false, // Set this to `true` if You want to show spinner
  active: {
    email: false,
    password: false,
  },
  deviceToken: "",
};
// const viaHook = () => {
//   const colorScheme = useColorScheme();
//   return colorScheme;
// };

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      AsyncStorage.getItem("deviceToken").then((result) => {
        //alert(result)
        this.setState({ deviceToken: result });
        //udatabase.clearAllData();
      });
    });

    try {
      let commonData = CommonDataManager.getInstance();
      let userData = await udatabase.getUserDatAsync("userdetail");
      userData = JSON.parse(userData.userData);
      if (userData != null && userData != "undefined") {
        try {
          setClientToken(userData.Token);
          let clientApps = await udatabase.getUserDatAsync("clientApps"); //await commonData.getClientAppData();
          clientApps = JSON.parse(clientApps.userData);
          //alert(JSON.stringify(clientApps));
          let gApps = await udatabase.getUserDatAsync("groupData"); //await commonData.getGroupDetail();

          let _clientAppData =
            clientApps != null
              ? clientApps.filter(
                  (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
                )
              : null;
          //alert(JSON.stringify(_clientAppData));
          const { navigate } = this.props.navigation;
          navigate("App", { clientAppData: _clientAppData });
        } catch (e) {
          udatabase.clearAllData();
        }
      } else {
        udatabase.clearAllData();
      }
    } catch (e) {
      //udatabase.clearAllData();
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  toggleActive = (name) => {
    const { active } = this.state;
    active[name] = !active[name];

    this.setState({ active });
  };

  onPressLogin() {
    requestModel.UserName = this.state.email;
    requestModel.Password = this.state.password;
    requestModel.MarketSuperClientID = 289;
    requestModel.KeepMeSignIn = true;
    requestModel.DeviceToken = this.state.deviceToken;
    console.log(requestModel);
    const onSuccess = async ({ data }) => {
      if (data.Result.ErrorMessage != "" && data.Result.ErrorMessage != null) {
        if (data.Result.ErrorMessage) alert(data.Result.ErrorMessage);

        return false;
      }
      const { navigate } = this.props.navigation;
      setClientToken(data.Result.UserDetail.Token);
      //('success');

      let commonData = CommonDataManager.getInstance();
      //alert(JSON.stringify(data.Result.ServceNodeMetaData));
      commonData.setServceNodeMetaData(data.Result.ServceNodeMetaData);
      commonData.setUserDetail(data.Result.UserDetail);
      //alert(JSON.stringify(data.Result.UserDetail));
      let test = await udatabase.setupUserDataAsync(
        "userdetail",
        data.Result.UserDetail
      );
      //alert("yes2");
      AsyncStorage.setItem(
        "userDetail",
        JSON.stringify(data.Result.UserDetail)
      );
      AsyncStorage.setItem(
        "serviceNode",
        JSON.stringify(data.Result.ServceNodeMetaData)
      );
      AsyncStorage.setItem(
        "clientList",
        JSON.stringify(data.Result.ClientList)
      );

      this.setState({ isLoading: false, isAuthorized: true });
      navigate("Organisation");
    };

    const onFailure = (error) => {
      alert(JSON.stringify(error));
      console.log(error && error.response);
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    baseAPI
      .post("/Account/Authenticate", requestModel)
      .then(onSuccess)
      .catch(onFailure);
  }

  getNonFieldErrorMessage() {
    // Return errors that are served in `non_field_errors`
    let message = null;
    const { errors } = this.state;
    if (errors.non_field_errors) {
      message = (
        <View style={styles.errorMessageContainerStyle}>
          {errors.non_field_errors.map((item) => (
            <Text style={styles.errorMessageTextStyle} key={item}>
              {item}
            </Text>
          ))}
        </View>
      );
    }
    return message;
  }

  getErrorMessageByField(field) {
    // Checks for error message in specified field
    // Shows error message from backend

    let message = null;
    if (this.state.errors[field]) {
      message = (
        <View style={styles.errorMessageContainerStyle}>
          {this.state.errors[field].map((item) => (
            <Text style={styles.errorMessageTextStyle} key={item}>
              {item} {"sadfsadfasf"}
            </Text>
          ))}
        </View>
      );
    }
    return message;
  }

  render() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const scheme = Appearance.getColorScheme();
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1.1 }}
        locations={[0.2, 1]}
        // colors={[scheme === "dark" ? "#181818" : "#FCFCFC", "#17a2b8"]}
        colors={[scheme === "dark" ? "#181818" : "#FCFCFC", "#17a2b8"]}
        style={[styles.signin, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
      >
        <Block flex middle>
          <KeyboardAvoidingView behavior="padding" enabled>
            <Block
              row
              center
              space="between"
              style={{ marginVertical: theme.SIZES.BASE * 7 }}
            >
              <Block flex middle center>
                {/* <Image
              
              source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
              style={{ width: 120, height: 120 }}
            /> */}

                <Image
                  resizeMode="contain"
                  source={require("../assets/images/logo.png")}
                />
              </Block>
            </Block>

            <Block center>
              <Input
                borderless
                // color={scheme === "dark" ? "white" : "#676A6A"}
                color={"dark"}
                placeholder="Email"
                type="email-address"
                autoCapitalize="none"
                bgColor="transparent"
                onBlur={() => this.toggleActive("email")}
                onFocus={() => this.toggleActive("email")}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={(text) => this.handleChange("email", text)}
                style={[
                  styles.input,
                  this.state.active.email ? styles.inputActive : null,
                ]}
              />
              {this.getErrorMessageByField("email")}
              <Input
                password
                viewPass
                borderless
                color="#676A6A"
                iconColor="#676A6A"
                placeholder="Password"
                bgColor="transparent"
                onBlur={() => this.toggleActive("password")}
                onFocus={() => this.toggleActive("password")}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={(text) => this.handleChange("password", text)}
                style={[
                  styles.input,
                  this.state.active.password ? styles.inputActive : null,
                ]}
              />
              {this.getErrorMessageByField("password")}

              {this.getNonFieldErrorMessage()}
              <Text
                color={theme.COLORS.WHITE}
                size={theme.SIZES.FONT * 0.75}
                onPress={() => Alert.alert("Not implemented")}
                style={{
                  alignSelf: "flex-end",
                  lineHeight: theme.SIZES.FONT * 2,
                }}
              >
                Forgot your password?
              </Text>
            </Block>
            <Block flex top style={{ marginTop: 0 }}>
              <Button
                shadowless
                color={materialTheme.COLORS.BUTTON_COLOR}
                style={{ height: 48 }}
                onPress={() => this.onPressLogin()}
              >
                <Text center color={theme.COLORS.WHITE} size={18}>
                  {this.state.isLoading ? (
                    <EvilIcons name="refresh" size={24} color="white" />
                  ) : (
                    ""
                  )}{" "}
                  SIGN IN
                </Text>
              </Button>
              {/* <Button color="transparent" shadowless onPress={() => navigation.navigate('Sign Up')}>
                  <Text
                    center
                    color={theme.COLORS.WHITE}
                    size={theme.SIZES.FONT * 0.75}
                    style={{marginTop:20}}
                  >
                    {"Don't have an account? Sign Up"}
                  </Text>
                </Button> */}
            </Block>
          </KeyboardAvoidingView>
        </Block>
      </LinearGradient>
    );
  }
}

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
    borderBottomColor: "#7B7B7B",
  },
  errorMessageContainerStyle: {
    marginBottom: 8,
    backgroundColor: "#7B7B7B",
    padding: 8,
    borderRadius: 4,
  },
  errorMessageTextStyle: {
    color: "#7B7B7B",
    textAlign: "center",
    fontSize: 12,
  },
});
