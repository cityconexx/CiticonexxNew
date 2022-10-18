import React from "react";
import {
  StyleSheet,
 
  View,
 
} from "react-native";
import { Text } from "galio-framework";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      scanned: false,
      //type: Camera.Constants.Type.back,
    };
  }
  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
    //await this.resetScanner();
  }

  toggleSwitch = (switchNumber) =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.navigation.navigate("ScannerResult");
  };
  setScanned() {
    this.setState({ scanned: false });
  }
  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={
            // this.state.scanned ? undefined : this.handleBarCodeScanned
            this.handleBarCodeScanned
          }
          style={StyleSheet.absoluteFillObject}
        />
        {/* {this.state.scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => this.setScannedfalse()}
          />
        )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  scanScreenMessage: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
