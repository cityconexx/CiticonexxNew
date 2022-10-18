import React from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Platform, FlatList, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import {  Block, NavBar, Text, Input, theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon  } from '../components/';

import { AntDesign } from '@expo/vector-icons';


import DynamicMessageData, { requestModel, UserReadStatusModel } from '../Data/DynamicMessageData';

import NetInfo from "@react-native-community/netinfo";
import { database } from '../OfflineData/MessageSyncData';
import { Appearance } from 'react-native';

import { format } from "date-fns";

import Spinner from 'react-native-loading-spinner-overlay';
import { udatabase } from '../OfflineData/UserAyncDetail';
import RenderHtml from 'react-native-render-html';

var msgtimer = null;
export default class MyMessages extends React.Component {

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

    let data = null;
    let msgdata = null;
    let metadata = null;
    let d = [];

    let objData = DynamicMessageData.getInstance();
    requestModel.SPName = 'getMessagesForUser';

    this.setState({ loading: true });
    msgdata = await database.getMessageDataJSONAsync();
    metadata = await database.getMessageMetaDataJSONAsync();
    //metadata = JSON.parse(msgdata.messageData);
    try {

      if ((msgdata != null && msgdata.messageData && msgdata.messageData.length > 0)) {
        //alert(metadata.messageData.SupportReadStatus);
        if (metadata.messageData)
          this.setState({ SupportReadStatus: metadata.messageMetaData.SupportReadStatus });

        //alert(JSON.stringify(msgdata));
        data = msgdata.messageData;
        d = [];

        for (let i = 0; i < data.length; i++) {
          let item = JSON.parse(data[i]);
          item.isExpand = false;
          d.push(item);
        }
      }
      else {

        data = await objData.getDynamicMessageListData(); //TaskList.QueryData

        if (data.MetaData) {
          //alert('yes data');
          if (msgtimer != null)
            clearInterval(msgtimer);

          //alert(parseInt(data.MetaData.AutoDeltaRefreshFrequencySeconds));
          if (msgtimer == null && data.MetaData.AutoDeltaRefreshFrequencySeconds != '') {
            tasktimer = setInterval(() => {
              this.refreshData();
              udatabase.addlog('msgtimer called, Data refersh at - ' + (new Date()).toLocaleString());
            }, parseInt(data.MetaData.AutoDeltaRefreshFrequencySeconds) * 1000);
          }
          this.setState({ SupportReadStatus: data.MetaData.SupportReadStatus });
        }

        data = data.DataList;
        d = [];
        for (let i = 0; i < data.length; i++) {
          let item = JSON.parse(data[i].RowJSON);
          item.isExpand = false;
          d.push(item);
        }


      }


    }
    catch (e) {
      alert('error occored');
      //alert('error', JSON.stringify(e));

      // data = await objData.getDynamicMessageListData(); //TaskList.QueryData

      //   if(data.MetaData)
      //     this.setState({SupportReadStatus: data.MetaData.SupportReadStatus});

      //   data = data.DataList;
      //   d = [];
      //   for(let i=0; i<data.length; i++)
      //   { let item = JSON.parse(data[i].RowJSON);
      //     item.isExpand = false;
      //     d.push(item);
      //   }
    }

    this.setState({ loading: false });
    //alert(JSON.stringify(d));
    this.setState({ messagefullData: d });
    this.setState({ messageData: d });




  }
  async refreshData() {
    let data = null;
    let msgdata = null;
    let metadata = null;
    let d = [];

    let objData = DynamicMessageData.getInstance();
    requestModel.SPName = 'getMessagesForUser';
    data = await objData.getDynamicMessageListData(); //TaskList.QueryData

    if (data.MetaData)
      this.setState({ SupportReadStatus: data.MetaData.SupportReadStatus });

    data = data.DataList;
    d = [];
    for (let i = 0; i < data.length; i++) {
      let item = JSON.parse(data[i].RowJSON);
      item.isExpand = false;
      d.push(item);
    }

    this.setState({ loading: false });
    //alert(JSON.stringify(d));
    this.setState({ messagefullData: d });
    this.setState({ messageData: d });
  }
  callmessagedatafromserver = async (itemrow, index, detail) => {
    let objData = DynamicMessageData.getInstance();
    requestModel.SPName = 'getMessagesForUser';
    let data = await objData.getDynamicMessageListData(); //TaskList.QueryData
    this.setState({ SupportReadStatus: data.MetaData.SupportReadStatus });
    data = data.TaskList.QueryData;
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (itemrow.RowID == item.RowID) {
        item.isExpand = true;
        this.setState({ selectedData: item });
      }
      else
        item.isExpand = false;

      data[i] = item;
    }
    //alert("setup");
    this.setState({ messagefullData: data });
    this.setState({ messageData: data });
    //this.setTaskModel(item, index, detail);
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
  renderNavigation = () => {

    const { back, title, white, transparent, navigation, scene, product } = this.props;
    const noShadow = ["Search", "Profile"].includes(title);

    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,

    ];
    return (
      <Block style={headerStyles}>
        <NavBar
          backgroundColor="black"
          title={
            <Block flex row>
              <Image
                title="group"
                source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
                style={{

                  marginBottom: 0,
                  width: 30,
                  height: 30,
                }}
              />
              <Text size={16} style={{ fontWeight: 'bold', paddingRight: 5, paddingTop: 5, color: scheme === 'dark' ? 'white' : 'black' }}>  My Messages {this.props.route.params?.product?.title}</Text>
            </Block>
          }
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ paddingTop: 3, flex: 0.3 }}
          style={styles.navbar}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
          ]}
          right={<Block flex row style={[styles.searchbutton]}>
            <TouchableOpacity onPress={() => this.showSearch()}>
              <Icon
                size={22}
                style={{ paddingRight: 10 }}
                family="entypo"
                name="magnifying-glass"
                color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
              />

            </TouchableOpacity>

            
          </Block>
          }
          rightIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}

          onLeftPress={this.handleLeftPress}
        />
        { this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    )
  }


  setTaskModel = async (item, index, isexpend) => {
    this.setState({ loading: true });
    //alert(JSON.stringify(item));
    this.setState({
      messageData: this.state.messageData.map(item => {
        item.isExpand = false;
        return item;
      })
    });

    let targetPost = this.state.messageData[index];

    targetPost.isExpand = isexpend;

    // Then update targetPost in 'posts'
    this.state.messageData[index] = targetPost;
    this.setState({
      messageData: this.state.messageData
    });
    //alert(JSON.stringify(item));
    let detail = await database.getMessageDetailAsync(item.RowID);
    //alert(JSON.stringify(detail));
    let finalData = JSON.parse(detail.messageDetailData);
    //alert(JSON.stringify(finalData));
    let taskKeyValue = [];
    //alert(JSON.stringify(finalData));
    item.MsgText = finalData.MsgText;
    //alert(JSON.stringify(item));
    for (var key in item) {
      if (!key.endsWith('ID') && !key.endsWith('id') && !key.endsWith('...') && !key.endsWith('isExpand') && !key.endsWith('Title')) {
        let taskValue = {};
        taskValue.Key = key;
        if (key.endsWith('Date'))
          taskValue.Value = format(item[key], "MMMM do, yyyy H:mm a");
        else
          taskValue.Value = item[key];

        taskKeyValue.push(taskValue);
        console.log(key);
        console.log(item[key]);
      }
    }
    this.setState({ TaskDetailKeyValue: taskKeyValue })

    if ((!item.ReadStatusID || item.ReadStatusID == 0) && this.state.SupportReadStatus) {
      this.setKeyUserReadStatus(item, index, finalData);
      //here we need to set ReadStatusID in offline data for item ROWID and set the status 1 for unread future
      this.state.messageData[index].ReadStatusID == 1;
      this.setState({ messageData: this.state.messageData });
      item.ReadStatusID = 1;
      database.setupMessageAsync(item.RowID, item);
    }

    this.setState({ loading: false });
    this.setState({ selectedData: finalData });
  }

  setKeyUserReadStatus = async (item, index, detail) => {
    UserReadStatusModel.UserGroupAppID = item.UserGroupAppID;
    UserReadStatusModel.RowID = item.RowID;
    UserReadStatusModel.RowIDKeyTypeID = item.RowIDKeyTypeID;
    UserReadStatusModel.ActionRowID = item.ActionRowID;
    UserReadStatusModel.ActionRowIDKeyTypeID = item.ActionRowIDKeyTypeID;
    UserReadStatusModel.KeyID = detail.KeyID;
    UserReadStatusModel.KeyTypeID = detail.KeyTypeID;
    let objData = DynamicMessageData.getInstance();
    let result = await objData.SetKeyUserReadStatus(item.RowID);
    // not need to call from server
    //this.callmessagedatafromserver(item, index, detail);

  }
  getcode(priority) {

    let text = '';
    if (priority) {
      if (priority.indexOf('Critical') > -1)
        text = 'CRITICAL';
      else if (priority.indexOf('High') > -1)
        text = 'HIGH';
      else if (priority.indexOf('Medium') > -1)
        text = 'MEDIUM';
      else if (priority.indexOf('Low') > -1)
        text = 'LOW';

    }
    return text;
  }
  getColorcode(priority) {

    let color = '#0549FD';
    if (priority) {
      if (priority.indexOf('Critical') > -1)
        color = '#ff8989';
      else if (priority.indexOf('High') > -1)
        color = '#89b3ff';
      else if (priority.indexOf('Medium') > -1)
        color = '#92d050';
      else if (priority.indexOf('Low') > -1)
        color = '#ffe181';

    }
    return color;
  }
  renderItem = ({ item, index }) => {

    const { navigation } = this.props;
    let colors = ['#FD0527', '#051CFD', '#FDD405', '#23FD05'];
    return (

      <Block >

        <Block card shadow style={styles.product}>

          <Block row >
            <View style={{ backgroundColor: this.getColorcode(item.Priority), alignItems: 'center', justifyContent: 'center', width: 40, height: 85, marginLeft: 0, marginRight: 0, padding: 0 }}><Text style={{ transform: [{ rotate: '-90deg' }], marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, padding: 0, fontSize: 8, fontWeight: 'bold' }}>{this.getcode(item.Priority)}</Text></View>
            {/* <Block style={{ backgroundColor: colors[index % colors.length], width:10}} /> */}
            <Block flex style={styles.productDescription}>

              <Block flex row space="between">
                <Block flex style={{ marginTop: 10, marginTop: 5  }} >
                  <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, true)}>
                    <Text size={13} style={ styles.textcolor}><Text style={{ fontWeight: 'bold' }}>{item.Status}</Text> </Text>
                  </TouchableWithoutFeedback>
                </Block>
                <Block>
                  <Text style={{ fontWeight: 'bold', marginTop: 10, marginRight: 10, color: scheme === "dark" ? "#17a2b8" : "#181818" }}> {item.Number}{item.isExpand}</Text>
                </Block>
                {!item.isExpand ?
                  <Block bottom style={{marginRight: 5 }}>
                    <AntDesign style={ styles.textcolor} onPress={() => this.setTaskModel(item, index, true)} name="down" size={18} color={scheme === 'dark' ? 'white' : '#181818'} />
                  </Block>
                  :
                  <Block bottom style={{marginRight: 5 }}>
                    <AntDesign style={ styles.textcolor} onPress={() => this.setTaskModel(item, index, false)} name="up" size={18} color={scheme === 'dark' ? 'white' : '#181818'} />
                  </Block>
                }
              </Block>
              {!item.isExpand ?

                <Block>
                  <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, true)}>
                    {!item.ReadStatusID && this.state.SupportReadStatus == 'True' ?
                      // <Text size={17} style={styles.titlebold}>{item.Title}</Text>
                      <Text size={18} style={styles.titlebold}>{item.Title.length > 70 ? item.Title.substring(0, 70) + '...' : item.Title}</Text>
                      :
                      // <Text size={17} style={styles.title}>{item.Title}</Text>
                      <Text size={18} style={styles.title}>{item.Title.length > 70 ? item.Title.substring(0, 70) + '...' : item.Title}</Text>

                    }
                  </TouchableWithoutFeedback>

                </Block>
                :

                <Block>
                  <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, false)}>
                    <Text size={17} style={styles.title}>{item.Title}</Text>
                  </TouchableWithoutFeedback>
                  <Block visible={this.state.loading}>

                    {this.state.TaskDetailKeyValue ? this.state.TaskDetailKeyValue?.map(item => {

                      return (



                        <Block style={styles.taskitem}>
                          {item.Key == 'MsgText' ? <View >
                            <View style={{ width: 130, }}>
                              <Text style={styles.textcolor} size={theme.SIZES.BASE * 0.90}>{item.Key}:</Text>
                            </View>
                            <View style={{ flex: 1, }}>
                              {/* <Text style={styles.textcolor} size={theme.SIZES.BASE * 0.90}>{item.Value}</Text> */
                                <RenderHtml tyle={styles.textcolor} source={{ html: item.Value }} tagsStyles={{
                                  span: { fontSize: 15 },
                                  p: { fontSize: 15, color: scheme === "dark" ? "#c7c5bd" : "black" }
                                }} />
                              }
                            </View>
                          </View> :

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                              <View style={{ width: 130, }}>
                                <Text style={styles.textcolor} size={theme.SIZES.BASE * 0.90}>{item.Key}:</Text>
                              </View>
                              <View style={{ flex: 1, }}>
                                <Text style={styles.textcolor} size={theme.SIZES.BASE * 0.90}>{item.Value}</Text>
                              </View>
                            </View>

                          }



                        </Block>
                      );

                    }) : null}

                  </Block>


                </Block>

              }
            </Block>
          </Block>
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
        <Block style={styles.shadow}>
          {this.renderNavigation()}
        </Block>
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
    margin: 0,
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
