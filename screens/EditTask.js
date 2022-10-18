import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, ScrollView, View, Image } from 'react-native';
import { Button, Block, NavBar, Text, Input, theme } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

import { Icon} from '../components/';

import materialTheme from '../constants/Theme';
import Textarea from 'react-native-textarea';



export default class AddTask extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: '',
      title: '-',
      category: '-',
      Desc: '-',
      AssignedBy: '-',
      active: {
        title: false,
        category: false,
        Desc: false,
        AssignedBy: false,
      }
    };
  }



  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }
  toggleActive = (name) => {
    const { active } = this.state;
    active[name] = !active[name];

    this.setState({ active });
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

  renderNavigation = () => {
    debugger;
    const { back, title, white, transparent, navigation, scene, product } = this.props;

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
            <Block flex row shadow style={{ paddingLeft: 30 }}>
              <Image
                title="group"
                source={{ uri: 'https://demo.cityconexx.com.au/assets/images/CITYCONEXX_LOGO_50X50.png' }}
                style={{

                  marginBottom: 0,
                  width: 30,
                  height: 30,
                }}
              />
              <Text size={18} style={{ fontWeight: 'bold', paddingRight: 0, paddingTop: 5 }}> Edit Task</Text>
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
                color={theme.COLORS['ICON']}
              />

            </TouchableOpacity>
          </Block>}
          // leftIconFamily="font-awesome"
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
          ]}
          style={styles.navbar}

          //  rightStyle={{ alignItems: 'center' }}
          //  leftStyle={{ fontSize: 18 }}
          //  style={styles.navbar}
          onLeftPress={this.handleLeftPress}


        />
        { this.state.isSearchShow ? this.renderHeader() : null}
      </Block>
    )
  }

  returnData(data) {
    this.setState({ selectedCategory: data });
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {

      AsyncStorage.getItem('selectedCategory').then((result) => {
        //alert(result)
        this.setState({ selectedCategory: result });
        AsyncStorage.removeItem('selectedCategory');

      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }



  refreshCateogry = (data) => {
    alert(data);
  }
  renderProducts = (scene) => {
    const { back, title, white, transparent, navigation } = this.props;
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}>
          <Block flex style={{ paddingLeft: 30, paddingTop: 15 }}>

            <TouchableOpacity

              onPress={() => this.props.navigation.navigate('TaskCategory')}>
              <Text size={18} bold color={theme.COLORS.BLACK}>Select Category</Text>


            </TouchableOpacity>
            <Text size={14} bold color={theme.COLORS.BLACK} style={{ paddingTop: 10 }}>{'Secure Shredding>Onsite Shredding> Ad hoc request'}</Text>
            <Text size={14} bold color={theme.COLORS.BLACK} style={{ paddingTop: 10 }}>{'Number: 41276'}</Text>
            <Text size={14} bold color={theme.COLORS.BLACK} style={{ paddingTop: 10 }}>{'Status: Completed'}</Text>
            <Text size={14} bold color={theme.COLORS.BLACK} style={{ paddingTop: 10 }}>{'Priority: Cirtical'}</Text>
          </Block>
          <Block flex style={styles.notification}>

            <Block flex={1} center space="between">

              <Block center>

                <Input
                  bgColor='transparent'
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  borderless
                  multiline={true}
                  color="black"
                  value={'Building Permit request for Rack & Sprinkler installation whs 7'}
                  placeholder="Title"
                  autoCapitalize="none"
                  style={[styles.input]}
                  onChangeText={text => this.handleChange('title', text)}
                  onBlur={() => this.toggleActive('title')}
                  onFocus={() => this.toggleActive('title')}
                />
                <Textarea
                  containerStyle={styles.textareaContainer}
                  style={styles.textarea}
                  onChangeText={this.onChange}
                  defaultValue={'Building Permit required for Rack & Sprinkler installation whs 7 Please contact Tom Williams for further information PH:0428194940'}
                  maxLength={500}
                  placeholder={'Description'}
                  placeholderTextColor={'#c7c7c7'}
                  underlineColorAndroid={'transparent'}
                />


                <Input
                  bgColor='transparent'
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  borderless
                  color="back"
                  multiline={true}
                  value={'Sydney'}
                  placeholder="Location"
                  autoCapitalize="none"
                  style={[styles.input]}
                  onChangeText={text => this.handleChange('Desc', text)}
                  onBlur={() => this.toggleActive('Desc')}
                  onFocus={() => this.toggleActive('Desc')}
                />
                <Input
                  bgColor='transparent'
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  borderless
                  color="Black"
                  value={'Ravindra Gautam'}
                  placeholder="Assigned To"
                  autoCapitalize="none"
                  style={[styles.input]}
                  onChangeText={text => this.handleChange('AssignedBy', text)}
                  onBlur={() => this.toggleActive('AssignedBy')}
                  onFocus={() => this.toggleActive('AssignedBy')}
                />
              </Block>
              <Block flex top style={{ marginTop: 20 }}>
                <Button
                  shadowless
                  style={{ height: 48 }}
                  color={materialTheme.COLORS.BUTTON_COLOR}
                >
                  Save Task
                </Button>

              </Block>
            </Block>

          </Block>
        </ScrollView>
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
    fontWeight: 'bold',
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
  searchbutton: {
    paddingLeft: 50,
    position: 'relative',
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
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
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0,
  },
  categoryTitle: {
    textAlign: 'left',
    height: '100%',
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  textareaContainer: {
    height: 180,
    padding: 5,
    backgroundColor: '#ffffff',
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    width: width * 0.9,
    borderRadius: 0,
    paddingLeft: 15,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
    height: 170,
    fontSize: 14,

  },
});
