import React from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Platform, FlatList,TouchableOpacity } from 'react-native';
import {  Block, Text, Input, theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from '../components/';


import {  Ionicons } from '@expo/vector-icons';

import DynamicMessageData, {  requestTaskMessageModel } from '../Data/DynamicMessageData';
// import MessageData, { messageRequestModel } from '../Data/MessageData';

import { Appearance } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';



var msgtimer = null;
export default class TaskMessages extends React.Component {

  constructor(props) {
    super(props);
    //alert('message screen called1');

    this.state = {
      messageData: [],
      messagefullData: null,
      isLoading: false,
      errors: {},
      selectedData: {},
      isexpand: "false",
      isSearchShow: false,
      loading: false,
      SupportReadStatus: false,
      TaskDetailKeyValue: null,
      searchtext: '',

    };
  }

  async componentDidMount() {
    this.setState({ searchtext: '' });

    let isConnected = true;
    NetInfo.addEventListener(networkState => {
      console.log("Connection type - ", networkState.type);
      console.log("Is connected? - ", networkState.isConnected);
      isConnected = networkState.isConnected;

    });

    this.focusListener = this.props.navigation.addListener('focus', (e) => {
      this.refreshData();
    });

    this.refreshData();
    //this.setState({messageData: d});




  }


  handleSearch = async (text) => {
    this.setState({ searchtext: text });
    if (text) {

      let masterDataSource = this.state.messagefullData;
      var results = [];
      var index;
      var entry;

      text = text.toUpperCase();
      for (index = 0; index < masterDataSource.length; ++index) {
        entry = masterDataSource[index];
        //alert(entry.Number);
        if (entry && entry.RowID && entry.RowID.toString().indexOf(text) !== -1) {
          results.push(entry);
        }
      }
      //alert(results.length);
      if (results.length == 0) {
        for (index = 0; index < masterDataSource.length; ++index) {
          entry = masterDataSource[index];
          if (entry && entry.Title && entry.Title.toUpperCase().indexOf(text) !== -1) {
            results.push(entry);
          }
        }
      }

      this.setState({ messageData: results });
    }
    else {


      this.setState({ messageData: this.state.messagefullData });
    }
  };


  renderSearch = () => {
    const { navigation } = this.props;
    const { text } = this.state;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"

        onChangeText={this.handleSearch} value={this.state.searchtext}
        iconContent={<><TouchableOpacity onPress={() => this.showSearch()}><Icon size={25} color={theme.COLORS.MUTED} name="cross" family="entypo" /></TouchableOpacity></>}
      />
    )
  }


  renderHeader = () => {
    return (
      <Block center style={styles.headerColor}>
        {this.renderSearch()}
        {/* {options ? this.renderOptions() : null}
              {tabs ? this.renderTabs() : null} */}
      </Block>
    )
  }



  handleLeftPress = () => {
    const { back, navigation } = this.props;
    navigation.goBack();
  }
  showSearch = () => {

    if (this.state.isSearchShow) {
      this.setState({ isSearchShow: false });
      this.handleSearch('');
    }
    else
      this.setState({ isSearchShow: true })
  }

  movemessagedetail() {
    const { navigation } = this.props;
    navigation.navigate('TaskMessageDetail', { pageData: this.props.route.params.pageData, taskItem: this.props.route.params.taskData, item: this.props.route.params.item, screenmode: 'add' })
  }
  async refreshData() {
    //alert('refresh called');
    let objData = DynamicMessageData.getInstance();
    //requestTaskMessageModel.SPName = 'getMessagesForUser';
    requestTaskMessageModel.ModuleID = this.props.route.params.pageData.ModuleID;
    requestTaskMessageModel.AppliesToOCID = this.props.route.params.item.RowID;
    if (this.props.route.params.item.RowID) {
      requestTaskMessageModel.DataSetName = "getMessagesForOCID";
      requestTaskMessageModel.ActionRowID = this.props.route.params.item.ActionRowID ? this.props.route.params.item.ActionRowID : this.props.route.params.item.RowID;
    }
    else {
      if (this.props.route.params.pageData.ModuleID == 0)
        this.requestTaskMessageModel.DataSetName = 'getQueriesForAdminList';
      else if (this.props.route.params.pageData.ModuleID == 8)
        this.requestTaskMessageModel.DataSetName = 'getQueriesForClientList';
      else if (this.props.route.params.pageData.ModuleID == 35)
        this.requestTaskMessageModel.DataSetName = 'getQueriesForAdminList';

    }

    this.setState({ loading: true });

    let res = await objData.getDynamicTaskMessageListData((res) => {

      this.setState({ loading: false });
      this.setState({ messageData: res });
    });

  }

  renderItem = ({ item, index }) => {

    const { navigation } = this.props;
    let colors = ['#FD0527', '#051CFD', '#FDD405', '#23FD05'];
    return (

      <Block >

        <Block card shadow style={styles.product}>
          <TouchableOpacity style={{ paddingLeft: 0 }} onPress={() => navigation.navigate('TaskMessageDetail', { pageData: this.props.route.params.pageData, taskItem: this.props.route.params.taskData, item: item, screenmode: 'edit' })}>


            <Block row >
              {/* <Block style={{ backgroundColor: colors[index % colors.length], width:10}} /> */}
              <Block flex style={styles.productDescription}>

                <Block flex row space="between">
                  <Block flex style={{ marginTop: 10, marginBottom:10 }} >

                    <Text size={13} style={styles.textcolor}><Text style={{ fontWeight: 'bold' }}>{item.Status}</Text> </Text>

                  </Block>
                  <Block>
                    <Text style={{ fontWeight: 'bold', marginTop: 10, marginRight: 10, color: scheme === "dark" ? "#17a2b8" : "#181818" }}> {item.Number}</Text>
                  </Block>

                </Block>
                <Block>
                  <Text size={16} style={styles.title}>{item.Subject}</Text>

                </Block>
              </Block>
            </Block>
          </TouchableOpacity>
          <Spinner
            //visibility of Overlay Loading Spinner
            visible={this.state.loading}
            //Text with the Spinner
            textContent={'Please wait...'}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
        </Block>
      </Block>
    )
  }


  renderProducts = (navigation, scene) => {
    const { back, title, white, transparent } = this.props;


    return (

      <View>

        { Platform.OS === 'ios' ?
          <Block flex

            showsVerticalScrollIndicator={false}
            style={styles.products}>
            <Spinner
              //visibility of Overlay Loading Spinner
              visible={this.state.loading}
              //Text with the Spinner
              textContent={'Please wait...'}
              //Text style of the Spinner Text
              textStyle={styles.spinnerTextStyle}
            />
            <View style={{ flexDirection: 'row', textAlign: "right" }}>
              <TouchableOpacity style={{ paddingLeft: 0, textAlign: "right" }} onPress={() => this.movemessagedetail()}>
                <Icon

                  size={24}
                  style={{ paddingRight: 10, textAlign: "right", paddingLeft: 300 }}
                  family="entypo"
                  name="plus"
                  color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
                />

              </TouchableOpacity>
              <TouchableOpacity style={{ paddingLeft: 0, textAlign: "right" }} onPress={() => this.refreshData()}>
                <Ionicons
                  size={24}
                  family="entypo"
                  name="sync"
                  color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
                />
              </TouchableOpacity>
            </View>
            <Block flex style={styles.notification}>

              <FlatList
                extraData={this.state}
                data={this.state.messageData}
                keyExtractor={(item, index) => item.RowID.toString()}
                renderItem={this.renderItem}
              />


            </Block>


          </Block> :

          <Block flex

            showsVerticalScrollIndicator={false}
            style={styles.products}>

            <Block flex style={styles.notification}>

              <FlatList
                extraData={this.state}
                data={this.state.messageData}
                keyExtractor={(item, index) => item.RowID.toString()}
                renderItem={this.renderItem}
              />


            </Block>


          </Block>
        }

      </View>


    )
  }

  render() {
    //alert(JSON.stringify(this.state.messageData));
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
      </Block>
    );

  }
}

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
    color: "black"
  },
  header: {
    backgroundColor: scheme === "dark" ? theme.COLORS.WHITE : "#181818",
    shadowColor: scheme === "dark" ? "white" : 'black',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 8,
    shadowOpacity: 0.6,
    elevation: 4,
    zIndex: 2,
  },

  navbar: {
    backgroundColor: scheme === 'dark' ? '#181818' : 'white',

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
    color: scheme === "dark" ? "white" : "#181818",
  },
  title: {
    marginTop: 0,
    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 0.4,
    color: scheme === "dark" ? "white" : "#181818",
  },
  titlebold: {
    marginTop: 0,
    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 0.4,
    color: scheme === "dark" ? "white" : "#181818",
    fontWeight: "600"
  },
  navtitle: {
    fontSize: 17,
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 1,
    color: scheme === "dark" ? "white" : "#181818",
  },
  rows: {
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 1.25,
    color: scheme === "dark" ? "white" : "#181818",
  }
  , product: {
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
    paddingLeft: 7,
    margin: 10,
    color: scheme === "dark" ? "white" : "#181818",
  },
  shadow: {
    backgroundColor: scheme === "dark" ? "white" : "#181818",
    shadowColor: scheme === "dark" ? "white" : 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  buttonshadow: {
    shadowColor: scheme === "dark" ? "white" : 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - (theme.SIZES.BASE * 5),
  },
  searchbutton: {
    paddingLeft: 50,
    paddingTop: 15,
    position: 'relative',
  },
  options: {
    paddingHorizontal: theme.SIZES.BASE / 2,
  },
  optionsText: {
    fontSize: theme.SIZES.BASE * 1,
    color: scheme === "dark" ? "white" : "#181818",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  textcolor: {
    color: scheme === "dark" ? "#17a2b8" : "#181818",
  },
  optionsButton: {
    width: 'auto',
    height: 32,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - (theme.SIZES.BASE * 3),
  },
  circle: {
    flex: 1,
    width: 44,
    height: 44,
    borderRadius: 44 / 2
  },
  headerColor: {
    color: scheme === "dark" ? "white" : "black",
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  taskitem: {
    width: '100%', // is 50% of container width
    paddingTop: 2,
    paddingBottom: 2

  },
});
