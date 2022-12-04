import React from "react";

import {
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Appearance,
} from "react-native";

import { Block, GalioProvider } from "galio-framework";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";

import Screens from "./navigation/Screens";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
enableScreens();

import { Asset } from "expo-asset";
import { Images, materialTheme } from "./constants/";

import { database } from "./OfflineData/Tables";
import { udatabase } from "./OfflineData/UserAyncDetail";

import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Camera } from "expo-camera";
import * as Location from "expo-location";
const BACKGROUND_FETCH_TASK = "background-fetch";
const assetImages = [Images.Profile, Images.Avatar];
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  udatabase.addlog(
    "Got background fetch call at date: ${new Date(now).toISOString()}"
  );
  console.log(
    "Got background fetch call at date: ${new Date(now).toISOString()}"
  );
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});
function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
async function registerBackgroundFetchAsync() {
  console.log("going for register task");
  udatabase.addlog("going for register task");
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 5, // 1 minutes (60*5) //// second 5
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
  console.log("Task registered");
  udatabase.addlog("Task registered");
}

async function unregisterBackgroundFetchAsync() {
  console.log("going for unregister task");
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  async componentDidMount() {
    // console.log("yes this app comonent");
    //this.enablePushNotifications();
    //this.checkStatusAsync1();
    //await BackgroundService.start(veryIntensiveTask, options);
    //for testing purpose
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("camera : success");
      this.setState({ hasCameraPermission: status === "granted" });
    } catch (error) {
      console.log("camera :error");
    }
    // try {
    //   const foregroundPermission =
    //     await Location.requestForegroundPermissionsAsync();
    //   let locationSubscrition = null;
    //   if (foregroundPermission.granted) {
    //     locationSubscrition = Location.watchPositionAsync(
    //       {
    //         // Tracking options
    //         accuracy: Location.Accuracy.High,
    //         distanceInterval: 10,
    //       },
    //       (location) => {
    //         // this.setState({ lat: location.coords.latitude });
    //         // this.setState({ long: location.coords.longitude });
    //         // this.props.route.params.pageData.lat = location.coords.latitude;
    //         // this.props.route.params.pageData.long = location.coords.longitude;
    //         console.log(location.coords.latitude);
    //         console.log(location.coords.longitude);
    //       }
    //     );
    //   }
    // } catch (error) {
    //   console.log("Location:", error);
    // }

    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this._loadResourcesAsync();
  }
  checkStatusAsync1 = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    this.setState({ taskStatus: status });
    this.setState({ isRegistered: isRegistered });
    console.log("status", status);
    udatabase.addlog("status" + status);
    console.log("isRegistered", isRegistered);
    udatabase.addlog("isRegistered" + isRegistered);
    udatabase.addlog("componentDidMount called");
    if (!isRegistered) await registerBackgroundFetchAsync();
    else await unregisterBackgroundFetchAsync();
  };

  enablePushNotifications = async () => {
    let token = await this.registerForPushNotifications();
    if (token) {
      //alert(JSON.stringify(token.data));
      console.log("token");
      console.log(token);
      AsyncStorage.setItem("deviceToken", token.data);
      //this.setState({ token });
    }
  };

  registerForPushNotifications = async () => {
    const enabled = await this.askPermissions();
    if (!enabled) {
      return Promise.resolve();
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    return token;
  };
  askPermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };

  getPushNotificationPermissions_ = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("finalstatus");
    console.log(finalStatus);
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
    console.log(finalStatus);

    // Get the token that uniquely identifies this device
    console.log(
      "Notification Token: ",
      await Notifications.getExpoPushTokenAsync()
    );
  };

  render() {
    let scheme = Appearance.getColorScheme();
    // let scheme = useColorScheme();

    if (!this.state.isLoadingComplete) {
      console.log("return null");
      return null;
    }
    return (
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <GalioProvider theme={materialTheme}>
          <Block flex>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  }
  _loadResourcesAsync = async () => {
    let tables = await database.setupDatabaseTableAsync();
    this.setState({ isLoadingComplete: true }, async () => {
      await SplashScreen.hideAsync();
    });
    return Promise.all([...cacheImages(assetImages)]);
  };
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
});
