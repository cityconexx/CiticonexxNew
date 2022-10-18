import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,

  ActivityIndicator,
} from "react-native";
import { Button, Block, NavBar, Text, Input, theme } from "galio-framework";
const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);
import { Icon } from "../../components/";

import materialTheme from "../../constants/Theme";
import { Appearance } from 'react-native';
import Toast from "react-native-toast-message";
import RNPickerSelect from "react-native-picker-select";
import { saveTaskQuoteItemAsync } from "../../Data/GetQuoteAsync";

export default class AddQuoteValue extends React.Component {
  constructor(props) {
    super(props);
    //testing 123
    this.state = {
      data: props.route.params.data,
      rowId: props.route.params.rowId,
      selectedItem: props.route.params.selectedItem,
      rateList: [],
      taxTypeList: [],
      selectTaxTypeId: null,
      selectRateListId: null,

      description: "",
      rateValue: "0",
      unit: "0",
      amount: "0",
      amountTax: "0",
      amountTotal: "0",
      taxRateValue: "0",
      loading: false,
    };
  }

  componentDidMount() {
    console.log("selectedItem: " + JSON.stringify(this.state.selectedItem));
    let array = [];
    let array1 = [];
    this.state.data.ApplicableRatesList.map((item) => {
      let data = {
        label: item.RateTypeName,
        value: item.RateCardRateID,
        RateValue: item.RateValue,
        RateCardRateID: item.RateCardRateID,
        RateCardRateVersionID: item.RateCardRateVersionID,
        RateName: item.RateName,
        TaxTypeID: item.TaxTypeID,
        RateTypeID: item.RateTypeID,
      };
      array.push(data);
    });

    this.state.data.TaxTypesList.map((item) => {
      let data = {
        label: item.TaxName,
        value: item.TaxTypeID,
        taxRate: item.TaxRate,
      };
      array1.push(data);
    });

    this.setState({
      rateList: array,
      taxTypeList: array1,
      selectTaxTypeId: array[0].TaxTypeID,
      selectRateListId: array[0].value,
    });

    //handle edit

    setTimeout(() => {
      const { selectedItem } = this.state;
      if (selectedItem) {
        this.setState({
          selectTaxTypeId: selectedItem.TaxTypeID,
          selectRateListId: selectedItem.RateCardRateID,
        });

        setTimeout(() => {
          this.setState({
            rateValue: "" + selectedItem.RateValue,
            unit: "" + selectedItem.Units,
            amount: selectedItem.Amount,
          });

          this.calculateTotalWithTax();
        }, 10);
      }
    }, 10);
  }

  handleLeftPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  renderNavigation = () => {
    const { title, white, transparent } = this.props;

    const { selectedItem } = this.state;

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
                  paddingRight: 0,
                  paddingTop: 5,
                  color: scheme === "dark" ? "white" : "black",
                }}
              >
                {" "}
                {(selectedItem ? "Edit" : "Add") + " Quote Value"}
              </Text>
            </Block>
          }
          leftStyle={{ paddingTop: 2, flex: 0.2, fontSize: 18 }}
          left={
            <Block flex row>
              <TouchableOpacity onPress={() => this.handleLeftPress()}>
                <Icon
                  size={20}
                  style={{ paddingRight: 20, paddingTop: 20 }}
                  family="entypo"
                  name="chevron-left"
                  color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                />
              </TouchableOpacity>
            </Block>
          }
          // leftIconFamily="font-awesome"
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? "WHITE" : "ICON"] },
          ]}
          style={styles.navbar}
        />
      </Block>
    );
  };

  onRateTypeSelect = (value) => {
    if (value === null) {
      return;
    }

    this.setState({ selectRateListId: value });
    let data = null;
    this.state.rateList.map((item) => {
      console.log("item: " + item.value + " = " + value);
      if (item.value === value) {
        data = item;
      }
    });

    if (data != null) {
      let taxRate = 0;
      this.state.taxTypeList.map((item) => {
        if (item.value === this.state.selectTaxTypeId) {
          taxRate = parseFloat(item.taxRate);
        }
      });
      this.setState({
        rateValue: "" + data.RateValue,
        description: data.label,
        taxRateValue: "" + taxRate,
      });
    }

    this.calculateTotalWithTax();
  };

  onChangeUnit = async (value) => {
    try {
      this.setState({ unit: value }, () => {
        this.calculateTotalWithTax();
      });
    } catch (error) {}
  };

  onChangeRateType = async (value) => {
    try {
      this.setState({ rateValue: value }, () => {
        this.calculateTotalWithTax();
      });
    } catch (error) {}
  };
  onChangeDescription = async (value) => {
    try {
      this.setState({ description: value });
    } catch (error) {}
  };

  calculateTotalWithTax = () => {
    try {
      if (this.state.rateValue && this.state.unit) {
        let rateFloat = parseFloat(this.state.rateValue);
        let amount = parseInt(this.state.unit) * rateFloat;
        let tax = parseFloat((rateFloat * this.state.taxRateValue) / 100);
        let amountTotal = amount + tax;
        this.setState({
          amount: "" + amount.toFixed(2),
          amountTax: "" + tax.toFixed(2),
          amountTotal: "" + amountTotal.toFixed(2),
        });
      } else {
        this.setState({ amount: "0", amountTax: "0", amountTotal: "0" });
      }
    } catch (error) {
      this.setState({ amount: "0", amountTax: "0", amountTotal: "0" });
    }
  };

  onTaxTypeSelect = (value) => {
    if (value === null) {
      return;
    }
    this.setState({ selectTaxTypeId: value });
    this.calculateTotalWithTax();
  };

  saveTaskQuoteItem = () => {
    let {
      selectTaxTypeId,
      description,
      rateValue,
      unit,
      amount,
      amountTax,
      amountTotal,
      data,
      selectedItem,
    } = this.state;

    let rateData = null;
    this.state.rateList.map((item) => {
      if (item.value === this.state.selectRateListId) {
        rateData = item;
      }
    });

    let dataParams = {
      ActivityQuoteItemID: selectedItem ? selectedItem.ActivityQuoteItemID : 0,
      RateCardRateID: rateData.RateCardRateID,
      ActualAmount: amount,
      ActualAmountTax: amountTax,
      ActualAmountTotal: amountTotal,
      ActionType: "I",
      Amount: amount,
      AmountTax: amountTax,
      AmountTotal: amountTotal,
      TaxTypeID: "" + selectTaxTypeId,
      RateTypeID: "" + rateData.RateTypeID,
      RateCardRateVersionID: "" + rateData.RateCardRateVersionID,
      ItemDescription: description,
      ActualRateValue: rateValue,
      ActualUnits: "" + unit,
      TaskID: this.state.rowId,
      IsError: false,
      IsExpandDesc: false,
      RateTypeName: rateData.label,
      RateValue: rateValue,
      Units: unit,
      RateName: rateData.label,
      UpdatedDate: new Date(),
      LastUpdatedDate: null,
    };
    this.setState({ loading: true });
    saveTaskQuoteItemAsync(
      dataParams,
      (result) => {
        this.setState({ loading: false });
        const { back, navigation } = this.props;
        navigation.goBack();
      },
      (error) => {
        this.setState({ loading: false });
      }
    );
  };

  render() {
    const {
      rateList,
      taxTypeList,
      selectRateListId,
      selectTaxTypeId,
      description,
      unit,
      amount,
      amountTax,
      amountTotal,
      rateValue,
      loading,
    } = this.state;

    return (
      <Block flex center style={styles.home}>
        <View>
          <Block style={styles.shadow}>{this.renderNavigation()}</Block>
          <Toast></Toast>
          <ScrollView contentContainerStyle={styles.products}>
            <Block flex style={styles.notification}>
              <Block flex={1} center space="between">
                <Block>
                  <RNPickerSelect
                    style={pickerSelectStyles}
                    placeholder={{
                      label: "Rate Type",
                      value: null,
                      color: "#9e9d98",
                    }}
                    value={selectRateListId}
                    placeholderTextColor="red"
                    items={rateList}
                    onValueChange={this.onRateTypeSelect}
                  />
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Description
                    </Text>
                  </View>

                  <Input
                    bgColor="transparent"
                    placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                    borderless
                    color={scheme === "dark" ? "white" : "black"}
                    placeholder="Description"
                    autoCapitalize="none"
                    style={[styles.inputDescription]}
                    value={description}
                    onChangeText={(text) => {
                      this.onChangeDescription(text);
                    }}
                    //pointerEvents="none"
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      width: "85%",
                      alignSelf: "center",
                    }}
                  >
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Rate Value</Text>
                      <Input
                        bgColor="transparent"
                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                        borderless
                        color={scheme === "dark" ? "white" : "black"}
                        placeholder="Rate Value"
                        autoCapitalize="none"
                        value={rateValue}
                        onChangeText={(text) => {
                          this.onChangeRateType(text);
                        }}
                        style={styles.inputTextHorizontalStyle}
                        //pointerEvents="none"
                      />
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Units</Text>

                      <Input
                        type={"numeric"}
                        bgColor="transparent"
                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                        borderless
                        color={scheme === "dark" ? "white" : "black"}
                        placeholder="Units"
                        value={unit}
                        autoCapitalize="none"
                        style={styles.inputTextHorizontalStyle}
                        //pointerEvents="none"
                        onChangeText={(text) => {
                          this.onChangeUnit(text);
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "85%",
                      alignSelf: "center",
                    }}
                  >
                    <RNPickerSelect
                      style={pickerSelectStyles}
                      placeholder={{
                        label: "Tax Type",
                        value: null,
                        color: "#9e9d98",
                      }}
                      placeholderTextColor="red"
                      items={taxTypeList}
                      value={selectTaxTypeId}
                      onValueChange={() => {}}
                    />

                    <Input
                      bgColor="transparent"
                      placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                      borderless
                      color={scheme === "dark" ? "white" : "black"}
                      placeholder="Amount"
                      value={amount}
                      autoCapitalize="none"
                      style={styles.inputTextHorizontalStyle}
                      //pointerEvents="none"
                      editable={false}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "85%",
                      alignSelf: "center",
                      marginTop: 10,
                    }}
                  >
                    <View>
                      <Text style={{ fontWeight: "bold" }}>Amount Tax</Text>

                      <Input
                        bgColor="transparent"
                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                        borderless
                        color={scheme === "dark" ? "white" : "black"}
                        placeholder="Amount Tax"
                        autoCapitalize="none"
                        style={styles.inputTextHorizontalStyle}
                        //pointerEvents="none"
                        value={amountTax}
                        editable={false}
                      />
                    </View>

                    <View>
                      <Text style={{ fontWeight: "bold" }}>Amount Total</Text>

                      <Input
                        bgColor="transparent"
                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                        borderless
                        color={scheme === "dark" ? "white" : "black"}
                        placeholder="Amount Total"
                        autoCapitalize="none"
                        style={styles.inputTextHorizontalStyle}
                        //pointerEvents="none"
                        value={amountTotal}
                        editable={false}
                      />
                    </View>
                  </View>

                  {loading ? (
                    <ActivityIndicator
                      style={{ margin: 50 }}
                      size="large"
                      color="#000000"
                    />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    >
                      <Button
                        shadowless
                        style={{ height: 48, fontWeight: "bold" }}
                        color={materialTheme.COLORS.BUTTON_COLOR}
                        onPress={() => {
                          this.saveTaskQuoteItem();
                        }}
                      >
                        {"  Save  "}
                      </Button>

                      <Button
                        shadowless
                        style={{ height: 48, fontWeight: "bold" }}
                        color={materialTheme.COLORS.BUTTON_COLOR}
                        onPress={() => {}}
                      >
                        {"  Cancel  "}
                      </Button>
                    </View>
                  )}
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </View>
      </Block>
    );
  }
}
const scheme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  navbar: {
    backgroundColor: scheme === "dark" ? "#181818" : "white",
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4.5 : theme.SIZES.BASE,
    zIndex: 5,
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
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  inputDescription: {
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  inputTextHorizontalStyle: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    textShadowColor: "#f0f",
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
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: scheme === "dark" ? "white" : "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  viewContainer: {
    flex: 1,
  },
});
