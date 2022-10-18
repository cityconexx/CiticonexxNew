import React from "react";
import {
  StyleSheet,
  
  FlatList,
  
  View,
 
} from "react-native";
import {  Text} from "galio-framework";


export default class ScannerResult extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [
        { name: "Water Spill" },
        { name: "Hot Water!" },
        { name: "Broken Microwave" },
        { name: "Garbage Full" },
        { name: "Task" },
        { name: "Other Task" },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.kitchenText}>Kitchen on Floor 2</Text>
        </View>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 2 }}>
              <Text style={styles.item}>{item.name}</Text>
            </View>
          )}
          numColumns={2}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  item: {
    fontSize: 14,
    paddingTop: 30,
    paddingBottom: 30,
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#3cb371",
  },
  kitchenText: {
    fontSize: 18,
    padding: 10,
    textAlign: "center",
    color: "#000000",
    fontWeight: "bold",
  },
});
