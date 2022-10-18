import React from 'react';
import { StyleSheet, Dimensions, View, FlatList, Platform, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import { Button, Block, NavBar, Text, Input, theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon} from '../components/';

import materialTheme from '../constants/Theme';
import { AntDesign, FontAwesome } from '@expo/vector-icons';



export default class Tasks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      notification: [
        { title: "Air Conditioning Systems", fulltitle: "Air Conditioning Systems", location: "Truganina CL > WH2", id: "1", desc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", fulldesc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", type: "Materials handling > Stock picker", referenceNumber: '342123', isMonitored: 'No', Status: "Inactive", isExpand: false },
        { title: "Boiler room diesel engine", fulltitle: "Boiler room diesel engine", location: "Truganina -WH3", id: "2", desc: "Boiler room diesel engine - Catepillar TD4564", fulldesc: "Boiler room diesel engine - Catepillar TD4564", type: "Facilities essentials > Diesel supply - generator", referenceNumber: '342343', isMonitored: 'No', Status: "Active", isExpand: false },
        { title: "Cleaning machine", fulltitle: "Cleaning machine", location: "Eskine Park", id: "3", desc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", fulldesc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", type: "Materials handling > Stock picker", referenceNumber: '423232', isMonitored: 'No', Status: "Inactive", isExpand: false },
        { title: "Divesh Pratap Singh", fulltitle: "Divesh Pratap Singh", location: "Truganina CL > WH2", id: "4", desc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", fulldesc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", type: "Staff tracking > Staff tracking", referenceNumber: '42312', isMonitored: 'No', Status: "Active", isExpand: false },
        { title: "Boiler room diesel engine", fulltitle: "Boiler room diesel engine", location: "Truganina CL > WH2", id: "5", desc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", fulldesc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", type: "Materials handling > Stock picker", referenceNumber: '4394849', isMonitored: 'No', Status: "Inactive", isExpand: false },
        { title: "Cleaning machine", fulltitle: "Cleaning machine", location: "Truganina CL > WH2", id: "6", desc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", fulldesc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", type: "Materials handling > Stock picker", referenceNumber: '4940322', isMonitored: 'No', Status: "Inactive", isExpand: false },
        { title: "Air Conditioning Systems", fulltitle: "Air Conditioning Systems", location: "Truganina CL > WH2", id: "7", desc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", fulldesc: "Heating & Cooling System for WH2 Building - Level 1 and Level 2", type: "Materials handling > Stock picker", referenceNumber: '4303930', isMonitored: 'No', Status: "Active", isExpand: false },
      ],
      isexpand: "false",
      isSearchShow: false
    };
  }




  toggleSwitch = switchNumber =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onFocus={() => { Keyboard.dismiss(); navigation.navigate('Search'); }}
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

  showSearch = () => {

    if (this.state.isSearchShow)
      this.setState({ isSearchShow: false })
    else
      this.setState({ isSearchShow: true })
  }


  handleLeftPress = () => {
    const { back, navigation } = this.props;
    navigation.goBack();
  }
  renderNavigation = () => {

    const { back, title, white, transparent, navigation, scene, product } = this.props;
    const noShadow = ["Search", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];
    //alert(JSON.stringify(this.props.route.params.pageData.ClientAppName));
    return (
      <Block style={headerStyles}>
        <NavBar

          title={
            <Block flex row shadow>
              <Image
                title="group"
                source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
                style={{

                  marginBottom: 0,
                  width: 30,
                  height: 30,
                }}
              />
              <Text size={18} style={{ fontWeight: 'bold', paddingTop: 5 }}> {this.props.route.params.pageData.ReportMenuLabel} {this.props.route.params?.product?.title}</Text>
            </Block>
          }
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ paddingTop: 3, flex: 0.3, fontSize: 18 }}
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
                color={theme.COLORS['ICON']}
              />

            </TouchableOpacity>

            <TouchableOpacity style={{ paddingLeft: 0 }}>
              <Icon
                size={22}
                style={{ paddingRight: 10 }}
                family="entypo"
                name="plus"
                color={theme.COLORS['ICON']}
              />


            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: 0 }} onPress={() => navigation.navigate('Groups')}>
              <FontAwesome style={{ paddingRight: 10 }} name="group" size={20} color="black" />

            </TouchableOpacity>
          </Block>
          }
         
        />
        { this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    )
  }

  setTaskModel = (item, index, isexpend) => {

    this.setState({
      notification: this.state.notification.map(item => {
        item.isExpand = false;
        return item;
      })
    });

    //let { notification } = this.state;
    let targetPost = this.state.notification[index];

    targetPost.isExpand = isexpend;

    // Then update targetPost in 'posts'
    this.state.notification[index] = targetPost;
    this.setState({
      notification: this.state.notification
    });

    //alert(JSON.stringify(this.state.notification));
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    let colors = ['#FD0527', '#051CFD', '#FDD405', '#23FD05'];
    return (

      <Block >

        <Block card shadow style={styles.product}>

          <Block flex row >

            {/* <Block style={{ backgroundColor: colors[index % colors.length], width:10}} /> */}
            <Block flex style={styles.productDescription}>

              <Block flex row space="between">
                <Block flex>

                  <Text size={12} style={{ marginTop: 5, marginBottom: 5 }}>Reference Number: <Text style={{ fontWeight: 'bold' }}>{item.referenceNumber} {item.isExpand}</Text>, Status: <Text style={{ fontWeight: 'bold' }}>{item.Status}</Text></Text>
                </Block>
                {!item.isExpand ?
                  <Block bottom>
                    <AntDesign style={{ marginRight: 5 }} onPress={() => this.setTaskModel(item, index, true)} name="down" size={18} color="black" />
                  </Block>
                  :
                  <Block bottom>
                    <AntDesign style={{ marginRight: 5 }} onPress={() => this.setTaskModel(item, index, false)} name="up" size={18} color="black" />
                  </Block>
                }
              </Block>
              {!item.isExpand ?

                <Block>
                  <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, true)}>
                    <Text size={17} style={styles.title}>{item.title}</Text>
                  </TouchableWithoutFeedback>
                  <Block flex row space="between">
                    <Block flex>
                      <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, true)}>
                        <Text
                          style={{ paddingBottom: 7 }}
                          size={theme.SIZES.BASE * 0.90}
                          color={materialTheme.COLORS.CAPTION}>
                          {item.desc}


                          {/* <Text style={{fontWeight:'bold'}}
                        size={theme.SIZES.BASE * 1.2}
                        color={materialTheme.COLORS.ERROR}>
                        {item.title.startsWith('W') ? '!' : ''}
                      </Text> */}


                        </Text>
                      </TouchableWithoutFeedback>
                    </Block>
                    {/* <Block bottom>
                        <TouchableWithoutFeedback onPress={ () => this.setTaskModel(item, index) }>
                           <Text size={12} style={{marginRight:5}}>Read more</Text>
                    </TouchableWithoutFeedback>
                    </Block> */}
                  </Block>
                </Block>
                :
                <Block>
                  <Block>
                    <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, false)}>
                      <Text size={17} style={styles.title}>{item.fulltitle}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setTaskModel(item, index, false)}>
                      <Text style={{ paddingBottom: 7 }}
                        size={theme.SIZES.BASE * 0.90}
                        color={materialTheme.COLORS.CAPTION}>{item.fulldesc}</Text>
                    </TouchableWithoutFeedback>



                    <Text style={{ paddingBottom: 7 }}
                      size={theme.SIZES.BASE * 0.90}
                      color={materialTheme.COLORS.CAPTION}>Location: {item.location}</Text>
                    <Text style={{ paddingBottom: 7 }}
                      size={theme.SIZES.BASE * 0.90}
                      color={materialTheme.COLORS.CAPTION}>Type: {item.type}</Text>

                    <Text style={{ paddingBottom: 7 }}
                      size={theme.SIZES.BASE * 0.90}
                      color={materialTheme.COLORS.CAPTION}>Is Monitored?: {item.isMonitored}</Text>


                  </Block>

                  <Block row space="evenly">



                    <Block flex>
                      <Button

                        shadowless
                        color={materialTheme.COLORS.ACTION}
                        textStyle={styles.optionsText}
                        style={[styles.optionsButton, styles.buttonshadow]}>
                        EDIT
              </Button>
                    </Block>
                  </Block>

                </Block>
              }
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
          <View flex

            style={styles.products}>

            <Block flex style={styles.notification}>
              <FlatList
                extraData={this.state}
                data={this.state.notification}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
              />


            </Block>


          </View>
          : <Block flex

            style={styles.products}>

            <Block flex style={styles.notification}>
              <FlatList
                extraData={this.state}
                data={this.state.notification}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
              />


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
    shadowColor: theme.COLORS.BLACK,
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
  },
  title: {
    fontSize: 16,

    paddingTop: theme.SIZES.BASE / 5,
    paddingBottom: theme.SIZES.BASE * 0.4,
  },
  navtitle: {
    fontSize: 17,
    paddingTop: theme.SIZES.BASE / 3,
    paddingBottom: theme.SIZES.BASE * 1,
  },
  rows: {
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 1.25,
  }
  , product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 6,
    borderWidth: 0,
    minHeight: 72,
    margin: 0,

  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 0.1,
  },
  productDescription: {
    paddingLeft: theme.SIZES.BASE / 1,
    margin: 0
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  buttonshadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - (theme.SIZES.BASE * 3),
  },
  searchbutton: {
    paddingLeft: 20,
    paddingTop: 15,
    position: 'relative',
  },
  options: {
    paddingHorizontal: theme.SIZES.BASE / 2,
  },
  optionsText: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: '#ffffff',
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.29,
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
  }
});
