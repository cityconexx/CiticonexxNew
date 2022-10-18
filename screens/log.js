import React from 'react';
import { StyleSheet, Dimensions, View, Platform, FlatList, Pressable, Image, TouchableOpacity } from 'react-native';
import {  Block, NavBar, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from '../components/';

import { Appearance } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { udatabase } from '../OfflineData/UserAyncDetail';
import * as BackgroundFetch from 'expo-background-fetch';

var timer = null;
export default class Log extends React.Component {

  constructor(props) {
    super(props);
    //alert('message screen called1');

    this.state = {
      logData: [],
      messagefullData: null,
      isLoading: false,
      errors: {},
      selectedData: {},
      isexpand: "false",
      isSearchShow: false,
      loading: false,
      SupportReadStatus: false,
      taskStatus: null,
      isRegistered: false
    };



  }



  async componentDidMount() {

    this.loadData();
    //this.checkStatusAsync();
    //initBackgroundFetch(BACKGROUND_FETCH_TASK, myTask, 60);

    timer = setInterval(() => {
      udatabase.addlog('timer called' + (new Date()).toLocaleString());
      //console.log('timer called' + (new Date()).toLocaleString());
    }, 60 * 1000);
  }

  componentWillUnmount() {
    if (timer != null) {
      clearInterval(timer)
    }
  }

  // checkStatusAsync = async () => {
  //   const status = await BackgroundFetch.getStatusAsync();
  //   const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  //   this.setState({ taskStatus: status });
  //   this.setState({ isRegistered: isRegistered });
  //   console.log('isRegistered', this.state.isRegistered);
  //   console.log('taskStatus', this.state.taskStatus);
  //   udatabase.addlog('status' + this.state.taskStatus);
  //   udatabase.addlog('isRegistered' + this.state.isRegistered);

  // };
  // checkStatusAsync1 = async () => {
  //   const status = await BackgroundFetch.getStatusAsync();
  //   const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  //   this.setState({ taskStatus: status });
  //   this.setState({ isRegistered: isRegistered })
  //   console.log('status', status);
  //   udatabase.addlog('status' + status);
  //   console.log('isRegistered', isRegistered);
  //   udatabase.addlog('isRegistered' + isRegistered);
  //   udatabase.addlog('componentDidMount called');
  //   if (!isRegistered)
  //     await registerBackgroundFetchAsync();
  //   else
  //     await unregisterBackgroundFetchAsync();
  // };


  // toggleFetchTask = async () => {
  //   if (this.state.isRegistered) {
  //     await unregisterBackgroundFetchAsync();
  //   } else {
  //     await registerBackgroundFetchAsync();
  //   }

  //   this.checkStatusAsync();
  // };

  async loadData() {

    let logData = null;

    this.setState({ loading: true });
    var logdata = await udatabase.getlog();
    //alert(JSON.stringify(logdata));
    this.setState({ loading: false });
    this.setState({ logData: logdata.logdata });
  }



  async deletelog() {
    this.setState({ loading: true });
    await udatabase.deletelog();
    var logdata = await udatabase.getlog();

    this.setState({ loading: false });
    this.setState({ logData: logdata.logdata });
  }
  handleSearch = async (text) => {
    //alert(text);


  };


  renderSearch = () => {
    const { navigation } = this.props;
    const { text } = this.state;
    return (
      null
      //   <Input
      //     right
      //     color="black"
      //     style={styles.search}
      //     placeholder="What are you looking for?"

      //     onChangeText={this.handleSearch} value={text}
      //     iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
      //   />
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

    if (this.state.isSearchShow)
      this.setState({ isSearchShow: false })
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
              <Text size={16} style={{ fontWeight: 'bold', paddingRight: 5, paddingTop: 5, color: scheme === 'dark' ? 'white' : 'black' }}>  Logs{this.props.route.params?.product?.title}</Text>
            </Block>
          }
          leftStyle={{ paddingTop: 2, flex: 0.2, fontSize: 18 }}
          left={<Block flex row>
            <TouchableOpacity onPress={() => this.handleLeftPress()}>
              <Icon
                size={20}
                style={{ paddingRight: 20, paddingTop: 20 }}
                family="entypo"
                name="chevron-left"
                color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
              />

            </TouchableOpacity>
          </Block>}
          // rightStyle={{ alignItems: 'center' }}

          style={styles.navbar}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
          ]}

          rightStyle={{ alignItems: 'center' }}
          rightIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}

          onLeftPress={this.handleLeftPress}
        />
        {this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    )
  }


  setTaskModel = async (item, index, isexpend) => {

  }

  setKeyUserReadStatus = async (item, index, detail) => {

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
            {/* <View style={{backgroundColor: this.getColorcode(item.Priority), alignItems: 'center', justifyContent: 'center', width:40,marginLeft:0, marginRight:0, padding:0}}><Text style={{transform: [{ rotate: '-90deg'}],  marginLeft:0, marginRight:0, marginTop:0, marginBottom:0, padding:0, fontSize:8, fontWeight:'bold'}}>{this.getcode(item.Priority)}</Text></View> */}
            {/* <Block style={{ backgroundColor: colors[index % colors.length], width:10}} /> */}
            <Block flex style={styles.productDescription}>

              <Block flex row space="between">
                <Block flex style={{ marginTop: 10 }} >

                  <Text size={13} style={[styles.textcolor, { marginTop: 5, marginBottom: 10 }]}><Text style={{ fontWeight: 'bold' }}>{item.log}</Text> </Text>

                </Block>

              </Block>

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
        {Platform.OS === 'ios' ?
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

            <View>
              <Text>
                Background fetch status:{' '}
                <Text style={styles.boldText}>
                  {this.state.taskStatus && BackgroundFetch.BackgroundFetchStatus[this.state.taskStatus]}
                </Text>
              </Text>
              <Text>
                Background fetch task name:{' '}
                <Text style={styles.boldText}>
                  {this.state.isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
                </Text>
              </Text>
            </View>
            <Block flex style={styles.notification}>
              <Pressable style={styles.smallbutton} onPress={() => this.toggleFetchTask()}>
                <Text size={17} style={styles.smallbuttontext} color={scheme === "dark" ? "white" : "black"}>
                  {this.state.isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}</Text>
              </Pressable>
              <Pressable style={styles.smallbutton} onPress={() => this.deletelog()}>
                <Text size={17} style={styles.smallbuttontext} color={scheme === "dark" ? "white" : "black"}>
                  {'Delete Logs'}</Text>
              </Pressable>
              <Pressable style={styles.smallbutton} onPress={() => this.loadData()}>
                <Text size={17} style={styles.smallbuttontext} color={scheme === "dark" ? "white" : "black"}>
                  {'Refresh Logs'}</Text>
              </Pressable>
              {/* <TouchableWithoutFeedback onPress={ () => this.deletelog() }>
    <Text size={15} style={{marginTop:15, marginBottom:20},  styles.textcolor}><Text style={{fontWeight:'bold'}}>{'Delete Log'}</Text> </Text>
</TouchableWithoutFeedback> */}
              <FlatList
                extraData={this.state}
                data={this.state.logData}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this.renderItem}
              />


            </Block>


          </Block> :

          <Block flex

            showsVerticalScrollIndicator={false}
            style={styles.products}>

            <Block flex style={styles.notification}>
              <Pressable style={styles.smallbutton} onPress={() => this.deletelog()}>
                <Text size={17} style={styles.smallbuttontext} color={scheme === "dark" ? "white" : "black"}>
                  {'Delete Logs'}</Text>
              </Pressable>
              <FlatList
                extraData={this.state}
                data={this.state.logData}
                keyExtractor={(item, index) => item.id.toString()}
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
    paddingLeft: theme.SIZES.BASE / 1,
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
  smallbuttontext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  smallbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 15,

    margin: 3,
    backgroundColor: 'gray',
  }
});