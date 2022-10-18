import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions,  Platform, View, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import {  Block, NavBar, Text, Input, theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon } from '../components/';

import { Appearance } from 'react-native';
import materialTheme from '../constants/Theme';


export default class MyMessageGroups extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      isSearchShow: false

    };
  }
  componentDidMount() {
    this.setState({ isSearchShow: false });
  }

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
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onFocus={() => { navigation.navigate('Search'); }}
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


        <NavBar
          back={true}
          title={
            <Block flex row shadow>
              <Image
                title="Filters"
                source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
                style={{

                  marginBottom: 0,
                  width: 30,
                  height: 30,
                }}
              />
              <Text size={16} style={{ fontWeight: 'bold', paddingRight: 5, paddingTop: 5, color: scheme === 'dark' ? 'white' : 'black' }} >  Filters</Text>
            </Block>
          }
          left={<Block flex row>
            <TouchableOpacity onPress={() => this.handleLeftPress()}>
              <Icon
                size={25}
                style={{ paddingTop: 20 }}
                family="entypo"
                name="chevron-left"
                color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
              />

            </TouchableOpacity>
          </Block>}
          right={<TouchableOpacity style={[styles.searchbutton]} onPress={() => this.showSearch()}>
            <Icon
              size={20}
              family="entypo"
              name="magnifying-glass"
              color={scheme === 'dark' ? "white" : theme.COLORS['ICON']}
            />

          </TouchableOpacity>}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ fontSize: 18 }}
          style={styles.navbar}

          onLeftPress={this.handleLeftPress}


        />
        { this.state.isSearchShow ? this.renderHeader() : null}
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
                <Block>
                  <TouchableWithoutFeedback onPress={() => navigation.navigate('Tasks', { product: item })}>
                    <Text style={styles.textcolor}
                      size={theme.SIZES.BASE * 0.86}
                      color={materialTheme.COLORS.CAPTION}>
                      {'Total -' + item.total + ', Replied - ' + item.replied + ', Read - ' + item.read}

                    </Text>
                  </TouchableWithoutFeedback>
                </Block>
                {/* <Block bottom>
                      <Text
                        size={theme.SIZES.BASE * 0.75}
                        color={materialTheme.COLORS.ACTIVE}>
                        $ {item.price * item.qty}
                      </Text>
                    </Block> */}
              </Block>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('Tasks', { product: item })}>
                <Text size={17} style={styles.title}>{item.title}</Text>
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

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    navigation.goBack();
  }
  renderProducts = (navigation, scene) => {
    const { back, title, white, transparent } = this.props;
    const noShadow = ["Search", "Profile"];
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const notifications = [
      { title: "All", id: "0", new: "15", total: "50", critical: "15", high: "20" },
      { title: "CEVA Truganina", id: "1", replied: "5", total: "10", read: "2", high: "3" },
      { title: "CEVA VL Truganina", id: "2", replied: "5", total: "20", read: "10", high: "5" },
      { title: "CEVA Dandenong", id: "3", replied: "10", total: "30", read: "10", high: "10" },
      { title: "CEVA Mulgrave", id: "4", replied: "5", total: "40", read: "20", high: "15" },
      { title: "CEVA Orchard Hills", id: "5", replied: "25", total: "50", read: "20", high: "5" },
      { title: "CEVA Minto", id: "6", replied: "40", total: "60", read: "10", high: "10" },
      { title: "CEVA Minchinbury", id: "7", replied: "50", total: "70", read: "10", high: "20" },
      { title: "CEVA Hazelmere", id: "8", replied: "50", total: "80", read: "20", high: "10" },
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
                data={notifications}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
              />
            </Block>
          </View>
          :
          <Block flex

            style={styles.products}>

            <Block flex style={styles.notification}>
              <FlatList
                data={notifications}
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
  }
});
