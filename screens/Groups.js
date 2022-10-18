import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Platform, View, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import {  Block, NavBar, Text, Input, theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from '../components/';
import { Ionicons } from '@expo/vector-icons';

import materialTheme from '../constants/Theme';
import CommonDataManager from "../core/CommonDataManager";
import { database } from '../OfflineData/TaskSyncData';
import { Appearance } from 'react-native';
import { udatabase } from '../OfflineData/UserAyncDetail';

export default class Groups extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      status: [],
      filterStatus: '',
      statusChart: [],
      groupData: [],
      isSearchShow: false

    };
  }
  componentWillMount() {
    console.log('First this called');
  }
  async componentDidMount() {
    this.setState({ isSearchShow: false });
    this.setGroupData();
  }
  setGroupData = async () => {
    //alert(this.props.route.params.pageData.ClientAppID);
    //alert(JSON.stringify(this.props.route.params.pageData));
    let commonData = CommonDataManager.getInstance();
    let moduleData = await commonData.getModuleDetail();
    //database.getTaskStatusAsync(1);
    if (moduleData == null) {
      moduleData = await udatabase.getUserDatAsync('moduleData');
      moduleData = JSON.parse(moduleData.userData);
    }
    //alert(JSON.stringify(this.props.route.params));
    const clientModuleAppData = moduleData.filter(e => e.ClientAppID == this.props.route.params.pageData.ClientAppID);;
    let data = await database.getTaskStatusChartJSONAsync(this.props.route.params.pageData.ClientAppID);

    data = data.taskData;
    //alert(JSON.stringify(clientModuleAppData));
    var statusList = [];
    this.setState({ groupData: clientModuleAppData });


    for (let i = 0; i < data.length; i++) {
      data[i].name = data[i].Status;
      data[i].color = this.getColorcode(data[i].Status);
      data[i].legendFontColor = this.getColorcode(data[i].Status);
      data[i].legendFontSize = '15';

      var DLData = {
        label: data[i].Status,
        value: data[i].Status
      };

      statusList.push(DLData);
    }
    //alert('final data');
    //alert(JSON.stringify(data));
    this.setState({ statusChart: data });
    this.setState({ status: statusList });
  }

  movetaskScreen = async (item) => {
    const { navigation } = this.props;
    if (item != null) {
      if (this.props.route.params.screen && this.props.route.params.screen == 'addtask') {
        //navigation.navigate('Tasks',{GroupAppID:item.GroupAppID});
        navigation.navigate('AddTask', { pageData: this.props.route.params.pageData, GroupAppID: item.GroupAppID, GroupID: item.GroupID });
      }
      else {
        navigation.navigate('Tasks', { GroupAppID: item.GroupAppID })
      }

    }
    else {

      navigation.navigate('Tasks', { GroupAppID: 0, Status: '' })
    }
  }
  getRandomColor(status) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getColorcode(priority) {

    let color = '#089A9C';
    if (priority) {
      if (priority.indexOf('Completed') > -1)
        color = '#089C0B';
      else if (priority.indexOf('Active') > -1)
        color = '#8EF50A';
      else if (priority.indexOf('Being worked on') > -1)
        color = '#F59F0A';
      else if (priority.indexOf('New') > -1)
        color = '#0A27F5';
      else if (priority.indexOf('Backlog') > -1)
        color = '#9C1F08';
      else if (priority.indexOf('Closed') > -1)
        color = '#69089C';
      else if (priority.indexOf('General') > -1)
        color = '#9C0821';
      else if (priority.indexOf('Failed') > -1)
        color = '#08969C';
      else if (priority.indexOf('Deleted') > -1)
        color = '#82089C';
      else if (priority.indexOf('Cancelled') > -1)
        color = '#9C0850';
      else if (priority.indexOf('Done') > -1)
        color = '#FF8C00';
    }
    return color;
  }

  handleSearch = async (text) => {
    //alert(text);
    if (text) {
      const formatQuery = text.toLowerCase();
      let masterDataSource = this.state.groupData;
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.GroupName
          ? item.GroupName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({ groupData: newData });
    }
    else {
      this.setGroupData();
    }
  };

  renderRight = () => {
    const { white, title, style, isWhite, navigation, scene } = this.props;
    <TouchableOpacity style={[styles.searchbutton]} onPress={() => navigation.navigate('Chat')}>
      <Icon
        family="GalioExtra"
        size={16}
        name="chat-33"
        color={theme.COLORS['ICON']}
      />
      <Block middle style={styles.notify} />
    </TouchableOpacity>
  }
  renderSearch = () => {
    const { navigation } = this.props;
    const { text } = this.state;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onChangeText={this.handleSearch} value={text}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
      />
    )
  }
  renderHeader = () => {
    return (
      <Block center>
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
    debugger;
    const { back, title, white, transparent, navigation, scene, product } = this.props;
    //alert(JSON.stringify(this.props.route.params.product.title));
    // const { routeName } = navigation.state;
    // const { options } = scene.descriptor;
    // const routeName = scene.descriptor?.options.headerTitle ?? '';
    const noShadow = ["Search", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];
    return (
      <Block style={headerStyles}>
        {/* <NavBar
               
                title={'Groups'}
                style={styles.navbar}
                transparent={transparent}
                left={
                    <Image
              
              source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
              style={{ width: 50, height: 50 }}
            /> 
                }
                rightStyle={{ alignItems: 'center' }}
                leftStyle={{ paddingTop: 0, flex: 0.3 }}
                
                titleStyle={[
                    styles.navtitle,
                    { color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
                ]}
               
                /> */}

        <NavBar
          back={true}
          title={
            <Block flex row shadow>
              <Image
                title="Groups"
                source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
                style={{

                  marginBottom: 0,
                  width: 30,
                  height: 30,
                }}
              />
              <Text size={18} style={{ fontWeight: 'bold', paddingRight: 5, paddingTop: 5, color: scheme === 'dark' ? 'white' : 'black' }}>  Groups</Text>
            </Block>
          }
          left={<Block flex row>
            <TouchableOpacity onPress={() => this.handleLeftPress()}>
              <Icon
                size={22}
                style={{ paddingTop: 20 }}
                family="entypo"
                name="chevron-left"
                color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
              />

            </TouchableOpacity>
          </Block>}
          right={
            <TouchableOpacity style={[styles.searchbutton]} onPress={() => this.movetaskScreen(null)}>

              <Ionicons
                size={22}
                family="entypo"
                name="sync"
                color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
              />

            </TouchableOpacity>

          }
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ fontSize: 18 }}
          style={styles.navbar}
          onLeftPress={this.handleLeftPress}


        />
        { this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    )
  }

  renderReportItem = ({ item }) => {
    return (
      <Block flex row space="between">
        <Text style={styles.textcolor}
          size={theme.SIZES.BASE * 0.86}
          color={materialTheme.COLORS.CAPTION}>
          {item.ReportName}

        </Text>
      </Block>
    )

  }

  renderStatusItem = ({ item }) => {
    const { navigation } = this.props;

    return (
      <Block>
        <Block card shadow style={styles.statusproducts}>
          <Block flex row>

            <Block flex style={styles.productDescription}>


              <TouchableWithoutFeedback style={styles.statustitle} onPress={() => navigation.navigate('Tasks', { Status: item.Status })}>
                <Text size={14} style={styles.statustitle}>{item.Status}</Text>
              </TouchableWithoutFeedback>


            </Block>
          </Block>

        </Block>
      </Block>
    )
  }
  renderItem = ({ item }) => {
    const { navigation } = this.props;

    return (
      <Block>
        <Block card shadow style={styles.product}>
          <Block flex row>

            <Block flex style={styles.productDescription}>

              <Block flex row space="between">

              </Block>
              <TouchableWithoutFeedback style={styles.title} onPress={() => this.movetaskScreen(item)}>
                <Text size={17} style={styles.title}>{item.GroupName + '/' + item.ReportMenuLabel + '/' + item.AppName}</Text>
              </TouchableWithoutFeedback>


            </Block>
          </Block>
          {/* <Block flex row space="between" style={styles.options}>
                <Block style={{marginTop: 7.5}}>
                <Text>New or Updated – 15,   Total - 25 </Text>
                </Block>
                
              </Block> */}
        </Block>
      </Block>
    )
  }

  filterStatus(filter) {
    if (filter) {
      const { navigation } = this.props;
      navigation.navigate('Tasks', { Status: filter.value });
    }
    else {
      navigation.navigate('Tasks', { Status: '' });
    }
    //alert(status);
  }
  renderProducts = (navigation, scene) => {
    const { back, title, white, transparent } = this.props;
    const noShadow = ["Search", "Profile"];
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];


    return (

      <View>
        <Block style={styles.shadow}>
          {this.renderNavigation()}
        </Block>
        { Platform.OS === 'ios' ?
          <View flex style={styles.products}>
            <Block left>
              <Text bold size={theme.SIZES.BASE} style={{ paddingBottom: 5, paddingTop: 5, paddingLeft: 10, color: scheme === "dark" ? "white" : "black" }}>
                {'Group and Apps'}
              </Text>

            </Block>

            <Block flex>
              {this.state.groupData ?
                <FlatList
                  data={this.state.groupData}
                  keyExtractor={(item, index) => item.GroupAppID.toString()}
                  renderItem={this.renderItem}
                /> : null}

              {/* <FlatList
          data={this.state.statusChart}
          keyExtractor={(item, index) => item.Status}
          renderItem={this.renderStatusItem}
          /> */}
            </Block>

          </View>
          :

          <Block flex

            style={styles.products}>
            <Block left>
              <Text bold size={theme.SIZES.BASE} style={{ paddingBottom: 15, paddingTop: 15, paddingLeft: 15, color: scheme === "dark" ? "white" : "black" }}>
                {'Group and Apps'}
              </Text>

            </Block>
            <Block flex style={styles.notification}>
              {this.state.groupData ?
                <FlatList
                  data={this.state.groupData}
                  keyExtractor={(item, index) => item.GroupAppID.toString()}
                  renderItem={this.renderItem}
                />
                : null}
            </Block>

          </Block>
        }
      </View>


    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
      </Block>
    );

  }
}

const scheme = Appearance.getColorScheme();
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    textShadowColor: '#f0f',
    //borderWidth: 1,
    //borderColor: 'gray',
    //borderRadius: 4,
    color: scheme === "dark" ? "white" : "black",
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,

    paddingRight: 30, // to ensure the text is never behind the icon
  },
  optionsText: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: scheme === "dark" ? "white" : "#181818",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: scheme === "dark" ? "white" : "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

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
    shadowColor: scheme === "dark" ? "white" : theme.COLORS.BLACK,
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
  statusproducts: {
    width: width - theme.SIZES.BASE * 0,
    paddingVertical: 5,

  },
  notification: {
    paddingVertical: theme.SIZES.BASE / 3,
    color: scheme === "dark" ? "white" : "#181818",
  },
  title: {
    marginTop: 0,
    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 1.5,
    color: scheme === "dark" ? "white" : "#181818",
  },
  removefilter: {
    marginTop: 0,
    flexDirection: 'row',
    textAlign: 'right',
    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 1.5,
    color: scheme === "dark" ? "white" : "#181818",
  },
  statustitle: {
    marginTop: 0,
    paddingBottom: theme.SIZES.BASE * 0.4,
    color: scheme === "dark" ? "white" : "#181818",
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
  actioncontainer: {

    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginRight: 10
    //margin :10 // if you want to fill rows left to right
  },
  actionbutton: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: scheme === "dark" ? "black" : "white",
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: -0.29,

  },
  filtercolor: {
    color: scheme === "dark" ? "white" : "black",
  }
  , smallbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 15,

    margin: 3,
    backgroundColor: 'gray',
  },
  smallremovebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 15,

    margin: 3,
    backgroundColor: 'gray',
  },
  smallbuttontext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
