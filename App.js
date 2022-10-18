import React from "react";

import { StyleSheet, Platform, StatusBar, Image, View, Text } from "react-native";

import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";


import { AppearanceProvider,Appearance } from 'react-native';


import { database } from "./OfflineData/Tables";
// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";

enableScreens();

import {Screens} from "./navigation/Screens";
import { Images, materialTheme } from "./constants/";


const assetImages = [Images.Profile, Images.Avatar];



function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  async componentDidMount() {
    console.log('yes this app comonent');
    //this.enablePushNotifications();
    //this.checkStatusAsync1();
    //await BackgroundService.start(veryIntensiveTask, options);
  }

  
 
 
  render() {
    let scheme = Appearance.getColorScheme();

      return (
        <AppearanceProvider>
          <NavigationContainer
            theme={scheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <GalioProvider theme={materialTheme}>
              <Block flex>
                {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                <Screens />
                
                {/* <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={Loader.isLoading}
                    //Text with the Spinner - this.state.loading
                    textContent={'Please wait...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                  />  */}
              </Block>
            </GalioProvider>
          </NavigationContainer>
        </AppearanceProvider>
      );
 

 
}
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
});