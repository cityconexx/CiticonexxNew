import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Appearance,
  FlatList,
} from "react-native";
import { Button, Block } from "galio-framework";
const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import materialTheme from "../constants/Theme";
import NetInfo from "@react-native-community/netinfo";

import Spinner from "react-native-loading-spinner-overlay";
export default class DocumentUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        title: false,
        category: false,
        Desc: false,
        AssignedBy: false,
      },
      TaskID: 0,
      TaskStatusID: 10200,
      isCapturing: false,
      accessCameraLabel: "Start",
      capturedPhotoBase64: null,
      capturedPhoto: null,
      imageName: "",
      camera: null,
      isProcessing: false,
      loading: false,
      imageList: [{ src: "" }],
    };
  }
  setCamera = (ref) => {
    this.state.camera = ref;
  };
  componentDidMount() {
    let isConnected = false;
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
  }
  async takePictureAsync() {
    if (this.state.camera) {
      let photo = await this.state.camera
        .takePictureAsync({ base64: true })
        .then((res) => {
          //console.log(res)
          let imgarr = res.uri.split("/");
          this.setState({
            isCapturing: false,
            capturedPhotoBase64: res.uri,
            capturedPhoto: res.base64,
            imageName: imgarr[imgarr.length - 1],
          });
          var item = {};
          item.src = this.state.capturedPhoto;
          this.setState({
            imageList: [...this.state.imageList.src, item],
          });
          console.log("imagelist size", this.state.imageList.length);
          console.log("imagelist data", JSON.stringify(this.state.imageList));
        });
    }
  }
  async accessCamera() {
    this.setState({ isCapturing: true });
  }

  renderProducts = () => {
    const setCamera = (ref) => {
      this.state.camera = ref;
    };
    return (
      <View>
        {!this.state.isCapturing ? (
          <View>
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
                <FlatList
                  data={this.state.imageList}
                  renderItem={({ item }) => (
                    <View
                      style={{ flex: 1, flexDirection: "column", margin: 1 }}
                    >
                      <Image
                        style={{ width: 150, height: 150 }}
                        source={{ uri: item.src }}
                      />
                    </View>
                  )}
                  //Setting the number of column
                  numColumns={2}
                  keyExtractor={(item, index) => index}
                />
              ) : null}
            </Block>
            <TouchableOpacity>
              <Button
                shadowless
                style={{
                  height: 48,
                  marginBottom: 30,
                }}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={() => {
                  //
                }}
              >
                {this.state.isProcessing ? "Please Wait" : "Upload Document"}
              </Button>
            </TouchableOpacity>
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
});
