import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  View,
  FlatList,
  Image,
  Appearance,
  LogBox,
} from "react-native";
import R from "ramda";
import { Block, NavBar, Text, Input, theme } from "galio-framework";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);
import NetInfo from "@react-native-community/netinfo";
import { Icon } from "../components/";
import materialTheme from "../constants/Theme";
import { database } from "../OfflineData/TaskSyncData";
import DynamicTaskData, { requetActivityModel } from "../Data/DynamicTaskData";
import Spinner from "react-native-loading-spinner-overlay";
import Theme from "../constants/Theme";

LogBox.ignoreAllLogs(true);
let finalResult = [];

export default class TaskCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      fulldata: null,
      selected: [],
      selectedCat: "",
      title: "-",
      category: "-",
      Desc: "-",
      AssignedBy: "-",
      loading: false,
      isSearchShow: false,
      isInputForSearch: false,
      active: {
        title: false,
        category: false,
        Desc: false,
        AssignedBy: false,
      },
      selectedParentPosition: -1,
      selectedChildPosition: -1,
      selectedSubChildPosition: -1,
      text: "",
    };
  }

  async componentDidMount() {
    let isConnected = false;
    NetInfo.addEventListener((networkState) => {
      // console.log("Connection type - ", networkState.type);
      // console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;
    });
    //await database.dropTable()

    let data = await database.getTaskCategoryFromLocal(
      this.props.route.params.GroupAppID
    );

    if (data.activityData == null) {
      this.loadActivityDataFromServer(async (result) => {
        let data = await database.getTaskCategoryFromLocal(
          this.props.route.params.GroupAppID
        );

        this.setState({ data: data.activityData });
        this.setState({ fulldata: data.activityData });
        console.log("without search data", data.length);
      });
    } else {
      this.setState({ data: data.activityData });
      this.setState({ fulldata: data.activityData });
      console.log("without search outside data", this.state.data.length);
    }
  }
  loadActivityDataFromServer = async (onloadsucess) => {
    let objData = DynamicTaskData.getInstance();
    requetActivityModel.GroupAppID = this.props.route.params.GroupAppID;
    requetActivityModel.AccessLevelID = 30;
    this.setState({ loading: true });
    objData.getActivityData((result) => {
      this.setState({ loading: false });
      onloadsucess(result);
    });
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  toggleActive = (name) => {
    const { active } = this.state;
    active[name] = !active[name];

    this.setState({ active });
  };

  renderSearch = () => {
    const { navigation } = this.props;
    const { text } = this.state;
    return (
      <Input
        autoFocus={true}
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onChangeText={this.handleSearch}
        value={text}
        iconContent={
          <>
            <TouchableOpacity
              onPress={() => {
                this.showSearch();
                this.setState({ text: "" });
                this.setState({
                  isInputForSearch: !this.state.isInputForSearch,
                });
                this.handleSearch("");
              }}
            >
              <Icon
                size={16}
                color={theme.COLORS.MUTED}
                name="cross"
                family="entypo"
              />
            </TouchableOpacity>
          </>
        }
      />
    );
  };

  handleSearch = async (text) => {
    this.setState({ text: text });
    this.setState({
      selectedParentPosition: -1,
      selectedChildPosition: -1,
      selectedSubChildPosition: -1,
    });
    await this.searchResult(text);
  };

  searchResult = async (text) => {
    if (text) {
      this.setState({ isInputForSearch: true });
      const masterDataSource = this.state.fulldata;

      //make parent data
      let index1;
      let index2;
      let index3;
      //parent data start
      let tempArray = [];
      finalResult = [];
      //set final resul empty incase user click on cross
      if (text === "") this.setState({ data: finalResult });
      //top level loop start
      for (index1 = 0; index1 < masterDataSource.length; index1++) {
        let parentObject = R.clone(masterDataSource[index1]);
        if (
          parentObject.category_text.toLowerCase().includes(text.toLowerCase())
        ) {
          parentObject.items = JSON.parse(parentObject.items);
          tempArray.push(parentObject);
        } else {
          //second level start
          let tempLevel2DataParsed = JSON.parse(masterDataSource[index1].items);
          let tempArray2 = [];
          //second level loop start
          for (
            index2 = 0;
            index2 < tempLevel2DataParsed.items.length;
            index2++
          ) {
            let level2Object = R.clone(
              JSON.parse(JSON.stringify(tempLevel2DataParsed.items[index2]))
            );
            if (level2Object.text.toLowerCase().includes(text.toLowerCase())) {
              tempArray2.push(level2Object);
            } else {
              //third level start
              let tempLevel3Data = JSON.parse(masterDataSource[index1].items)
                .items[index2].items;
              let tempArray3 = [];
              //third level loop start
              for (index3 = 0; index3 < tempLevel3Data.length; index3++) {
                let level3Object = R.clone(tempLevel3Data[index3]);
                if (
                  level3Object.text.toLowerCase().includes(text.toLowerCase())
                ) {
                  tempArray3.push(level3Object);
                }
              }
              if (tempArray3.length > 0) {
                level2Object.items = [...tempArray3];
                tempArray2.push(level2Object);
              }
              tempArray3 = [];
            }
          }
          //bind two level data
          if (tempArray2.length > 0) {
            parentObject.items = [...tempArray2];
            tempArray.push(parentObject);
          }
          tempArray2 = [];
        }
        //final data bind here
        if (tempArray.length > 0) {
          finalResult.push(...tempArray);
        }
        tempArray = [];
      }

      this.setState({ data: finalResult });
    } else {
      this.setState({ isInputForSearch: !this.state.isInputForSearch });
      this.setState({ data: this.state.fulldata });
    }
  };
  renderHeader = () => {
    return <Block center>{this.renderSearch()}</Block>;
  };
  showSearch = () => {
    this.setState({
      selectedParentPosition: -1,
      selectedChildPosition: -1,
      selectedSubChildPosition: -1,
      isSearchShow: !this.state.isSearchShow,
    });
  };
  handleLeftPress = () => {
    const { back, route, navigation } = this.props;
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
            <Block flex row shadow>
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
                  paddingRight: 5,
                  paddingTop: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                Categories
              </Text>
            </Block>
          }
          left={
            <Block flex row>
              <TouchableOpacity onPress={() => this.handleLeftPress()}>
                <Icon
                  size={20}
                  style={{ paddingTop: 20 }}
                  family="entypo"
                  name="chevron-left"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
            </Block>
          }
          rightStyle={{ alignItems: "center" }}
          leftStyle={{ fontSize: 18 }}
          style={styles.navbar}
          onLeftPress={this.handleLeftPress}
          right={
            <Block flex row style={[styles.searchbutton]}>
              <TouchableOpacity onPress={() => this.showSearch()}>
                <Icon
                  size={22}
                  style={{ paddingRight: 10, paddingTop: 10 }}
                  family="entypo"
                  name="magnifying-glass"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
            </Block>
          }
        />
        {this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    );
  };

  getChildrenName = (node) => {
    if (node.name === "Item level 1.2.2") {
      return "children";
    }

    return "descendants";
  };

  toggleChecked = (node) => {
    if (this.state.selected.includes(node.customId)) {
      const selected = this.state.selected.filter((id) => id !== node.customId);
      this.setState({
        selected,
      });
    } else {
      this.setState({
        selected: [node.customId, ...this.state.selected],
      });
    }
  };

  renderProducts = (navigation, scene) => {
    const { back, title, white, transparent } = this.props;
    const noShadow = ["Search", "Profile"];
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    ];

    return (
      <View>
        <Block style={styles.shadow}>{this.renderNavigation()}</Block>
        {Platform.OS === "ios" ? (
          <View
            flex
            showsVerticalScrollIndicator={false}
            style={styles.products}
          >
            <Block flex style={styles.notification}>
              {this.state.data != null
                ? // <NestedListView style={styles.textcolor}
                  //   data={this.state.data}
                  //   getChildrenName={this.getChildrenName}
                  //   onNodePressed={this.onNodePressed}
                  //   renderNode={this.renderNode}

                  // />
                  this.renderLists()
                : // null
                  null}
            </Block>
          </View>
        ) : (
          <Block
            flex
            showsVerticalScrollIndicator={false}
            style={styles.products}
          >
            <Block flex style={styles.notification}>
              {/*                 
                <NestedListView
          data={this.state.data}
          getChildrenName={this.getChildrenName}
          onNodePressed={this.onNodePressed}
          renderNode={this.renderNode}
        />
              */}

              {this.renderLists()}
            </Block>
          </Block>
        )}

        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner - this.state.loading
          textContent={"Please wait..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  };

  renderLists = () => {
    return (
      <FlatList
        data={this.state.data}
        initialNumToRender={30}
        keyExtractor={({ item, index }) => item + "-" + index}
        renderItem={({ item, index }) => {
          let itemParent = item;
          let secondNodeData = [];

          if (this.state.isInputForSearch) {
            if (typeof item.items.items === "object") {
              secondNodeData = item.items.items;
            } else {
              secondNodeData = item.items;
            }
          } else {
            secondNodeData = JSON.parse(item.items).items;
          }

          return (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  selectedParentPosition:
                    this.state.selectedParentPosition === index ? -1 : index,
                  selectedChildPosition: -1,
                  selectedSubChildPosition: -1,
                });
              }}
            >
              {this.renderNodeParent(
                item.category_text,
                0,
                this.state.isInputForSearch
              )}
              {this.state.selectedParentPosition === index ? (
                <FlatList
                  data={secondNodeData}
                  keyExtractor={({ item, index }) => item + "=" + index}
                  renderItem={({ item, index }) => {
                    let itemChild = item;
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            selectedChildPosition:
                              this.state.selectedChildPosition === index
                                ? -1
                                : index,
                            selectedSubChildPosition: -1,
                          });
                        }}
                      >
                        {this.renderNodeLevel1(item.text, 1)}
                        {this.state.selectedChildPosition === index ? (
                          <FlatList
                            data={item.items}
                            keyExtractor={({ item, index }) =>
                              item + "x" + index
                            }
                            renderItem={({ item, index }) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.onNodePressed(
                                      itemParent,
                                      itemChild,
                                      item
                                    );
                                  }}
                                >
                                  {this.renderNodeLevel2(item.text, 2)}
                                </TouchableOpacity>
                              );
                            }}
                          />
                        ) : null}
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  renderNodeParent = (text, level, isSearchShow) => {
    const paddingLeft = (level + 1) * 30;
    const backgroundColor = isSearchShow ? Theme.COLORS.LIGTGREY : "white";

    return (
      <View style={[styles.node, { backgroundColor, paddingLeft }]}>
        <Text style={styles.textcolor}>{text}</Text>
      </View>
    );
  };
  renderNodeLevel1 = (text, level) => {
    const paddingLeft = (level + 1) * 30;
    const backgroundColor = colorLevels[level] || "white";

    return (
      <View style={[styles.node, { backgroundColor, paddingLeft }]}>
        <Text style={styles.textcolor}>{text}</Text>
      </View>
    );
  };
  renderNodeLevel2 = (text, level) => {
    const paddingLeft = (level + 1) * 30;
    const backgroundColor = colorLevels[level] || "white";
    return (
      <View style={[styles.node, { backgroundColor, paddingLeft }]}>
        <Text style={styles.textcolor}>{text}</Text>
      </View>
    );
  };

  onNodePressed = (itemParent, itemChild, item) => {
    // if (!node.items) {
    //   let catitem = node.CID_SCID.split('-');
    //   let topCat = this.state.data.filter(e => e.ID == catitem[0]);
    //   let middleCat = topCat[0].items.filter(e => e.ID == catitem[1]);
    //   this.setState({ selectedCat: topCat[0].text + '>' + middleCat[0].text + '>' + node.text });
    //   AsyncStorage.setItem('selectedCategory', topCat[0].text + '>' + middleCat[0].text + '>' + node.text);
    //   AsyncStorage.setItem('ActivityTypeID', catitem[1].toString());
    //   AsyncStorage.setItem('ActivityTypeTaskID', node.ID.toString());
    //   this.handleLeftPress();
    // }
    let catitem = item.CID_SCID.split("-");
    let catSelected =
      itemParent.category_text + ">" + itemChild.text + ">" + item.text;
    this.setState({ selectedCat: catSelected });
    AsyncStorage.setItem("selectedCategory", catSelected);
    AsyncStorage.setItem("ActivityTypeID", catitem[1].toString());
    AsyncStorage.setItem("ActivityTypeTaskID", item.ID.toString());
    this.handleLeftPress();
  };

  getChildrenName = (node) => {
    return "items";
  };
  render() {
    return (
      <Block flex center style={styles.home}>
        {/* <Image 
        title="group"
        source={{ uri: 'https://demo.cityconexx.com.au/assets/images/loading.gif' }}
        
    />  */}
        {this.renderProducts()}
      </Block>
    );
  }
}
const colorLevels = {
  [0]: "white",
  [1]: scheme === "dark" ? "#181818" : "d9d9d0",
  [2]: scheme === "dark" ? "#82827f" : "d9d9d0",
  [3]: scheme === "dark" ? "#adada8qa" : "d9d9d0",
};
const scheme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  home: {
    width: width,
  },
  group: {
    paddingTop: theme.SIZES.BASE * 3.75,
  },

  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
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
  textcolor: {
    color: scheme === "dark" ? "white" : "#181818",
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
  container: { backgroundColor: "rgb(255, 255, 255)", padding: 10 },
  node: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  spinnerTextStyleTest: {
    color: "#FFF",
    fontSize: 12,
  },
});
