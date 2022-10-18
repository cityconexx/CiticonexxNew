import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button, Block, NavBar, Text, Input, theme } from "galio-framework";
const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);
import { Icon } from "../../components/";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import materialTheme from "../../constants/Theme";
import { Appearance } from 'react-native';
import moment from "moment";
import {
  deleteQuoteItem,
  getJobQuotes,
  saveTaskQuoteAsync,
} from "../../Data/GetQuoteAsync";

export default class AddQuotes extends React.Component {
  constructor(props) {
    super(props);
    // testing here 123
    this.state = {
      loading: false,
      isEdit: false,
      notes: "",
      showStartDate: false,
      showEndDate: false,
      startDate: "",
      endDate: "",
      taskQuoteList: [],
      totalSummaryAmount: 0,
      taxTypesList: [],
      allDataObject: "",
      loadingSaving: false,
      loadingDelete: false,
      taskId: props.route.params.taskData.RowID, //props.route.params.taskId,
      isJobReadOnly: props.route.params.taskData.StatusID === 10290,
      rowId: 0,
    };
  }

  async componentDidMount() {
    this.props.route.params.taskId = this.props.route.params.taskData.RowID;
    this.props.route.params.StatusID =
      this.props.route.params.taskData.StatusID;

    this.getQuote();
    this.focusListener = this.props.navigation.addListener("focus", (e) => {
      this.getQuote();
    });
  }

  componentWillUnmount() {
    try {
      focusListener.remove();
    } catch (error) {}
  }

  getQuote() {
    this.setState({ loading: true });
    let currentDate = moment().format("YYYY/MM/DD");

    getJobQuotes(
      this.state.taskId,
      (data) => {
        let result = data.Result;
        let taskNote = result && result.TaskNote;
        if (taskNote) {
          let startDateFor = moment(taskNote.ActualStartDate).format(
            "YYYY/MM/DD"
          );
          let endDateFor = moment(taskNote.ActualEndDate).format("YYYY/MM/DD");
          this.setState(
            {
              notes: taskNote.Notes || "",
              startDate:
                startDateFor.indexOf("000") > -1 ? currentDate : startDateFor,
              endDate:
                endDateFor.indexOf("000") > -1 ? currentDate : endDateFor,
              taxTypesList: result.TaxTypesList || [],
              allDataObject: result,
              taskQuoteList: result.TaskQuoteList || [],
              rowId: this.state.taskId,
            },
            () => {
              this.getTotal();
            }
          );
        }
        this.setState({ loading: false });
      },
      (error) => {
        this.setState({ loading: false });
      }
    );
  }

  getTotal() {
    const { taskQuoteList } = this.state;
    let total = taskQuoteList.reduce(function (p, n) {
      return parseFloat(p) + parseFloat(n.AmountTotal);
    }, 0);

    this.setState({ totalSummaryAmount: total });
  }
  handleLeftPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  handleConfirm = (date) => {
    const { showStartDate } = this.state;

    let dateFormat = moment(date).format("YYYY/MM/DD");
    if (showStartDate === true) {
      this.setState({ startDate: dateFormat });
    } else {
      this.setState({ endDate: dateFormat });
    }
    this.setState({ showStartDate: false, showEndDate: false });
  };

  hideDatePicker = () => {
    this.setState({ showStartDate: false });
  };

  renderNavigation = () => {
    debugger;
    const { title, white, transparent } = this.props;

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
                {"Add Quote"}
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

  gotoAddQuotesValue = (item) => {
    this.props.navigation.navigate("AddQuoteValue", {
      data: this.state.allDataObject,
      rowId: this.state.rowId,
      selectedItem: item,
    });
  };

  getListItem = ({ item, index }) => {
    let textTypeFilterArray = this.state.taxTypesList.filter(
      (data) => data.TaxTypeID === item.TaxTypeID
    );
    const { isJobReadOnly } = this.state;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isJobReadOnly === false) {
            console.log("quote data" + JSON.stringify(item));
            this.gotoAddQuotesValue(item);
          }
        }}
      >
        <View style={styles.listItemWrapper}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.textSubHeading}>{"Rate Type"}</Text>
              <Text style={styles.listTextValue}>{item.RateTypeName}</Text>
            </View>
            <Block>
              <Text style={styles.textSubHeading}>{"Rate Value"}</Text>
              <Text style={styles.listTextValue}>{item.RateValue}</Text>
            </Block>
            <View>
              <Text style={styles.textSubHeading}>{"Unit"}</Text>
              <Text style={styles.listTextValue}>{item.Units}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 7,
            }}
          >
            <View>
              <Text style={styles.textSubHeading}>{"Tax Type"}</Text>
              <Text style={styles.listTextValue}>
                {textTypeFilterArray[0].TaxName}
              </Text>
            </View>
            <View>
              <Text style={styles.textSubHeading}>{"Amount"}</Text>
              <Text style={styles.listTextValue}>{item.Amount}</Text>
            </View>
            <View>
              <Text style={styles.textSubHeading}>{"Amount Tax"}</Text>
              <Text style={styles.listTextValue}>{item.AmountTax}</Text>
            </View>
            <View>
              <Text style={styles.textSubHeading}>{"Amount Total"}</Text>
              <Text style={styles.listTextValue}>{item.AmountTotal}</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 7,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.textSubHeading}>{"Description"}</Text>
              <Text style={styles.listTextValue}>{item.ItemDescription}</Text>
            </View>
            {isJobReadOnly ? null : (
              <View style={{ marginEnd: 5, marginStart: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(null, "You are about to delete.", [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed!"),
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          this.setState({ loadingDelete: true });

                          let data = { ...item, DeleteItem: 1 };

                          deleteQuoteItem(
                            data,
                            (data) => {
                              this.setState({ loadingDelete: false });
                              this.getQuote();
                            },
                            (error) => {
                              this.setState({ loadingDelete: false });
                            }
                          );
                        },
                      },
                    ]);
                  }}
                >
                  <Icon
                    size={22}
                    style={{ padding: 10 }}
                    family="entypo"
                    name="trash"
                    color={scheme === "dark" ? "white" : theme.COLORS["ICON"]}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  saveTaskQuote = () => {
    const { startDate, endDate, notes, allDataObject, taskId } = this.state;

    const setTaskQuoteModel = {
      TaskID: taskId,
      EstimatedStartDate: startDate,
      EstimatedEndDate: endDate,
      Notes: notes,
      LastUpdatedDate: null,
      UpdatedDate: allDataObject.TaskNote.UpdatedDate,
      ActualsConfirmed: 0,
      SaveDraft: 0,
    };

    this.setState({ loadingSaving: true });

    try {
      saveTaskQuoteAsync(
        setTaskQuoteModel,
        (data) => {
          this.setState({ loadingSaving: false });
        },
        (err) => {
          this.setState({ loadingSaving: false });
        }
      );
    } catch (error) {
      this.setState({ loadingSaving: false });
    }
  };

  render() {
    const {
      startDate,
      endDate,
      notes,
      taskQuoteList,
      totalSummaryAmount,
      loading,
      loadingDelete,
      isJobReadOnly,
    } = this.state;
    return (
      <Block flex center style={styles.home}>
        <View>
          {/* <Block style={styles.shadow}>
                        {this.renderNavigation()}
                    </Block> */}

          <ScrollView contentContainerStyle={styles.products}>
            {loading || loadingDelete ? (
              <Block flex style={styles.notification}>
                <ActivityIndicator
                  style={{ margin: 50 }}
                  size="large"
                  color="#000000"
                />
              </Block>
            ) : (
              <Block flex style={styles.notification}>
                <Block flex={1} center space="between">
                  <Block center>
                    {this.state.isEdit === false ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          width: width * 0.9,
                          alignSelf: "center",
                          marginTop: 15,
                        }}
                      >
                        {notes.length === 0 ? null : (
                          <Text style={{ flex: 1 }}>{this.state.notes}</Text>
                        )}

                        {isJobReadOnly ? null : (
                          <Button
                            onPress={() => {
                              this.setState({ isEdit: true });
                            }}
                            shadowless
                            style={{ width: 100, height: 35 }}
                            color={materialTheme.COLORS.BUTTON_COLOR}
                          >
                            {notes.length === 0 ? "Add Notes" : "Edit"}
                          </Button>
                        )}
                      </View>
                    ) : (
                      <View>
                        <Input
                          bgColor="transparent"
                          placeholderTextColor={
                            materialTheme.COLORS.PLACEHOLDER
                          }
                          borderless
                          color={scheme === "dark" ? "white" : "black"}
                          placeholder="Notes"
                          autoCapitalize="none"
                          style={[styles.input]}
                          value={notes}
                          onChangeText={(text) => {
                            this.setState({ notes: text });
                          }}
                          // pointerEvents="none"
                        />

                        <View
                          style={{
                            flexDirection: "row",
                            alignSelf: "flex-end",
                          }}
                        >
                          <Button
                            onPress={() => {
                              this.setState({ isEdit: false });
                            }}
                            shadowless
                            style={{ width: 100, height: 35 }}
                            color={materialTheme.COLORS.BUTTON_COLOR}
                          >
                            {"Cancel"}
                          </Button>

                          <Button
                            onPress={() => {
                              this.setState({ isEdit: false });
                            }}
                            shadowless
                            style={{ width: 100, height: 35 }}
                            color={materialTheme.COLORS.BUTTON_COLOR}
                          >
                            {"Save"}
                          </Button>
                        </View>
                      </View>
                    )}

                    <View
                      style={{
                        flexDirection: "row",
                        width: "85%",
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: "#acacac", flex: 1 }}>
                        {"Actual Start Date"}
                      </Text>
                      <Text
                        style={{ color: "#acacac", flex: 1, paddingStart: 15 }}
                      >
                        {"Actual End Date"}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        width: "85%",
                        alignSelf: "center",
                        marginTop: -15,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ showStartDate: true });
                        }}
                      >
                        <Input
                          bgColor="transparent"
                          placeholderTextColor={
                            materialTheme.COLORS.PLACEHOLDER
                          }
                          borderless
                          color={scheme === "dark" ? "white" : "black"}
                          placeholder="Start Date"
                          autoCapitalize="none"
                          editable={false}
                          value={startDate}
                          onChangeText={(text) => {
                            this.setState({ startDate: text });
                          }}
                          style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
                          }}
                          pointerEvents="none"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ showEndDate: true });
                        }}
                      >
                        <Input
                          bgColor="transparent"
                          editable={false}
                          placeholderTextColor={
                            materialTheme.COLORS.PLACEHOLDER
                          }
                          borderless
                          color={scheme === "dark" ? "white" : "black"}
                          placeholder="End Date"
                          value={endDate}
                          autoCapitalize="none"
                          onChangeText={(text) => {
                            this.setState({ endDate: text });
                          }}
                          style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
                          }}
                          pointerEvents="none"
                        />
                      </TouchableOpacity>
                    </View>

                    {this.state.loadingSaving ? (
                      <ActivityIndicator
                        style={{ margin: 50 }}
                        size="large"
                        color="#000000"
                      />
                    ) : isJobReadOnly ? (
                      <View style={{ height: 50 }} />
                    ) : (
                      <Button
                        shadowless
                        style={{ height: 42, fontWeight: "bold" }}
                        color={materialTheme.COLORS.BUTTON_COLOR}
                        onPress={() => {
                          this.saveTaskQuote();
                        }}
                      >
                        {"Submit Quote"}
                      </Button>
                    )}
                  </Block>

                  <View
                    style={{
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "90%",
                      borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
                      borderTopColor: materialTheme.COLORS.PLACEHOLDER,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ flex: 1, fontWeight: "bold" }}>
                      {"Quote Values"}
                    </Text>
                    {isJobReadOnly ? (
                      <View style={{ height: 28, width: 20 }} />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.gotoAddQuotesValue();
                        }}
                      >
                        <Icon
                          size={20}
                          style={{ padding: 10 }}
                          family="entypo"
                          name="plus"
                          color={
                            scheme === "dark" ? "white" : theme.COLORS["ICON"]
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={{ marginTop: 10, width: width - 40 }}>
                    {taskQuoteList.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "flex-end",
                          marginBottom: 10,
                        }}
                      >
                        <Text style={styles.listTextValue}>{"Summary:"}</Text>
                        <Text
                          style={[
                            styles.listTextValue,
                            {
                              marginStart: 10,
                              fontWeight: "bold",
                              marginEnd: 5,
                            },
                          ]}
                        >
                          {totalSummaryAmount.toFixed(2)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={{ color: "#acacac", alignSelf: "center" }}>
                        {"No quote found"}
                      </Text>
                    )}

                    <FlatList
                      data={taskQuoteList}
                      keyExtractor={({ item, index }) => index}
                      renderItem={this.getListItem}
                    />
                  </View>
                </Block>
              </Block>
            )}
          </ScrollView>

          <DateTimePickerModal
            isVisible={this.state.showStartDate || this.state.showEndDate}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />
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

  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
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
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0,
  },
  textarea: {
    textAlignVertical: "top", // hack android
    height: 150,
    fontSize: 14,
    color: scheme === "dark" ? "white" : "#333",
    paddingLeft: 18,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
    backgroundColor: scheme === "dark" ? "#181818" : "white",
  },
  datePicker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  listItemWrapper: {
    elevation: 0,
    borderRadius: 7,
    padding: 7,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  textSubHeading: {
    fontSize: 10,
    color: "gray",
  },
  listTextValue: {
    fontSize: 15,
    color: "black",
  },
});
