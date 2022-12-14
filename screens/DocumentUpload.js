import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Appearance,
  FlatList,
  ScrollView,Text
} from "react-native";
import { Button, Block , theme} from "galio-framework";
import DynamicTaskData, {
  TaskDocumentRequestModel
  
} from "../Data/DynamicTaskData";
import Toast from "react-native-toast-message";
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
      capturedPhots:[],
      imageName: "",
      camera: null,
      isProcessing: false,
      loading: false,
      Documents:[],
      testDocuments:[],
      imageList: [{ src: "" }],
    };
  }
  setCamera = (ref) => {
    this.state.camera = ref;
  };
  componentDidMount() {
    let isConnected = false;
    //alert(JSON.stringify(this.props.route.params.taskData.Documents));
    let doc = this.props.route.params.taskData.Documents ? JSON.parse(this.props.route.params.taskData.Documents) :  null;
    this.setState({Documents: doc});
    this.setState({testDocuments: doc});
    this.loadData();
    NetInfo.addEventListener((networkState) => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
    
  }
 setUploadTaskDocument= async () => {
  
    let objData = DynamicTaskData.getInstance();
    let that = this;
    this.setState({isProcessing:true});
    this.state.capturedPhots?.forEach(itemdoc => {
      TaskDocumentRequestModel.TaskID = this.props.route.params.taskData.TaskID;
      TaskDocumentRequestModel.Image = itemdoc.capturedPhoto;
      TaskDocumentRequestModel.OriginalFileName = itemdoc.imageName;
      TaskDocumentRequestModel.AttachmentFileName = itemdoc.imageName;

      let data = objData.SetTaskDocuments(
      
        (result) => {
         
          Toast.show({
            type: "success",
            text1: 'document uploaded',
          });
          
          that.setState({isProcessing:false});
          that.setState({capturedPhots: []});
          that.loadData();
         
        }
      );

    });
   
  }
  loadData = async () => {
  
    let objData = DynamicTaskData.getInstance();
    let that = this;
    TaskDocumentRequestModel.TaskID = this.props.route.params.taskData.TaskID;
    let data = objData.getDynamicTaskDocumentListData(
     
      (result) => {
       
        that.setState({Documents: JSON.parse(result)});
      }
    );
  };
  async takePictureAsync() {
    if (this.state.camera) {
      let photo = await this.state.camera
        .takePictureAsync({ base64: true })
        .then((res) => {
          console.log(res.uri);
          let imgarr = res.uri.split("/");
           let images = this.state.capturedPhots;
           var img = {};
           img.isCapturing =  false;
           img.capturedPhotoBase64= res.uri;
           img.capturedPhoto = res.base64;
           img.imageName= imgarr[imgarr.length - 1];
            images.push(img);
          //console.log(images);
          this.setState({isCapturing:false});
          this.setState({
           capturedPhots:images
          });

          // var item = {};
          // item.src = this.state.capturedPhoto;
          // this.setState({
          //   imageList: [...this.state.imageList.src, item],
          // });
          // console.log("imagelist size", this.state.imageList.length);
          // console.log("imagelist data", JSON.stringify(this.state.imageList));
        });
    }
  }
  async accessCamera() {
    this.setState({ isCapturing: true });
  }
 
  renderItem = ({ item, index }) => {

    const { navigation } = this.props;
    let imageUrl = 'https://api.cityconexx.com.au/Uploads/Documents/'+ item;
    console.log(imageUrl);
    let colors = ['#FD0527', '#051CFD', '#FDD405', '#23FD05'];
    return (

      <View
                      style={{ width:"30%", margin:10,
                      justifyContent: "left"}}
                    >
                      <Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: imageUrl }}
                      />
                    </View>

    )
  }

  rendercapturedItem = ({ item, index }) => {

    const { navigation } = this.props;
   
    
    
    let colors = ['#FD0527', '#051CFD', '#FDD405', '#23FD05'];
    return (

      <View
                      style={{ width:"30%", margin:10,
                      justifyContent: "left"}}
                    >
                      <Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: item.capturedPhotoBase64 }}
                      />
                    </View>

    )
  }
  renderProducts = () => {
    const setCamera = (ref) => {
      this.state.camera = ref;
    };
    return (
      
      <View>
     <View style={styles.imagecontainer}>

       <FlatList
                       extraData={this.state}
                      
                       
                       data={this.state.Documents}
                       keyExtractor={(item, index) => item.toString()}
                       renderItem={this.renderItem}
                       numColumns={3}
                      
                     />
           
            
               </View>
   
        {!this.state.isCapturing ? (
          <View style={{ margin:10, flexDirection: "row", flexWrap: "wrap",  }}>
            <TouchableOpacity
              style={{
                textAlign: "left",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
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
            <Block  top style={{ marginTop: 10 }}>
            <View style={styles.imagecontainer}>
              {this.state.capturedPhots ? (
                
                <FlatList
                       extraData={this.state}
                      
                       
                       data={this.state.capturedPhots}
                       keyExtractor={(item, index) => item.imageName.toString()}
                       renderItem={this.rendercapturedItem}
                       numColumns={3}
                      
                     />
              ) : null}</View>
            </Block>
            {this.state.capturedPhots && this.state.capturedPhots.length > 0 ? 
            <TouchableOpacity disabled={this.state.isProcessing}>
              <Button
                shadowless
                style={{
                  height: 48,
                  marginBottom: 30,
                }}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={() => this.setUploadTaskDocument()}
              >
                {this.state.isProcessing ? "Please Wait" : "Upload Document"}
              </Button>
            </TouchableOpacity> : null}
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
        <Toast></Toast>
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
    flexWrap: 'wrap',
    paddingBottom: 0.1,
    color: scheme === "dark" ? "white" : "#181818",
  },
  productDescription: {
    paddingLeft: theme.SIZES.BASE / 1,
    margin: 0,
    color: scheme === "dark" ? "white" : "#181818",
  },
  container: {
    flex: 1,
    paddingTop: 2,
    flexDirection: 'column',
  },
  list: {
    justifyContent: 'space-around',
  },
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  item: {
    flex: 1
  },
  imagecontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginRight: 10,
    //margin :10 // if you want to fill rows left to right
  },
});
