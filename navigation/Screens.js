import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {  Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Images } from "../constants/";

// screens

// import GroupsScreen from "../screens/Groups";
// import GroupFilterScreen from "../screens/GroupFilter";

// import MyMessagesScreen from "../screens/MyMessages";
// import MyMessageGroupScreen from "../screens/MyMessageGroups";
// import AssetsScreen from "../screens/Assets";

// import TaskCategoryScreen from "../screens/TaskCategory";

// import TasksScreen from "../screens/Tasks";

import SignInScreen from "../screens/SignIn";
//import OrganisationScreen from "../screens/Organisation";
// import TaskDetailScreen from "../screens/TaskTabDetail";
// import TaskMessagesScreen from "../screens/TaskMessages";
// import AddTaskScreen from "../screens/AddTask";
// import EditTaskScreen from "../screens/EditTask";
// import TaskMessageDetailScreen from "../screens/TaskMessageDetail";

// import SettingsScreen from "../screens/Settings";
// import NotificationScreen from "../screens/SendNotification";
// import ScannerScreen from "../screens/Scanner";
// import CommonDataManager from "../core/CommonDataManager";
// import { udatabase } from "../OfflineData/UserAyncDetail";

// import { tabs } from "../constants/";

const { width } = Dimensions.get("screen");
// import ActionBarImage from "../components/ActionBarImage";
// import AddQuotes from "../screens/quotes/AddQuotes";
// import AddQuoteValue from "../screens/quotes/AddQuoteValue";
// import ScannerResult from "../screens/ScannerResult";

const Stack = createStackNavigator();

//const Tab = createBottomTabNavigator();

const profile = {
  avatar: Images.Profile,
  name: "Rachel Brown",
  type: "Seller",
  plan: "Pro",
  rating: 4.8,
};

// const SettingsStack = (props) => {
//   return (
//     <Stack.Navigator initialRouteName="Menus" mode="card" headerMode="screen">
//       <Stack.Screen
//         name="Menus"
//         component={SettingsScreen}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header title="Menus" scene={scene} navigation={navigation} />
//           ),
//         }}
//       />
//       <Stack.Screen
//         name="Notification"
//         component={NotificationScreen}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

// const OrgStack = (props) => {
//   return (
//     <Stack.Navigator initialRouteName="Org" mode="card" headerMode="screen">
//       <Stack.Screen
//         name="test"
//         component={OrganisationScreen}
//         option={{
//           headerTransparent: true,
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

export default function SignInStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Login"
        component={SignInScreen}
        option={{
          headerTransparent: true,
        }}
      />
      {/* <Stack.Screen
        name="Organisation"
        component={OrganisationScreen}
        option={{
          headerTransparent: true,
        }}
      /> */}
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
const AppStack = (props) => {
  return (
    <Navigator
      initialRouteName={SignInStack}
      tabBarOptions={{
        activeTintColor: "#17a2b8",
        backgroundColor: "gray",
      }}
    >
      {/* <Tab.Screen
          name="MyMessagesStack"
          component={MyMessagesStack}
          options={{
            tabBarLabel: 'My Messages',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        /> */}

      {/* <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="menu" color={color} size={size} />
          ),
        }}
      /> */}
    </Navigator>
  );
};
// const HomeStack = (props) => {
//   //alert(props.pageData);
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="Tasks"
//         initialParams={{ pageData: props.pageData, ismsg: props.ismsg }}
//         options={{ headerShown: false }}
//       >
//         {(props) => <TasksScreen {...props} />}
//       </Stack.Screen>
//       <Stack.Screen
//         name="Scanner"
//         component={ScannerScreen}
//         options={{ headerShown: true }}
//       />
//       <Stack.Screen
//         name="ScannerResult"
//         component={ScannerResult}
//         options={{ headerShown: true }}
//       />
//       <Stack.Screen
//         name="Groups"
//         component={GroupsScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="GroupFilter"
//         component={GroupFilterScreen}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="AddTask"
//         component={AddTaskScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TaskDetail"
//         component={TaskDetailScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TaskMessageDetail"
//         component={TaskMessageDetailScreen}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="TaskMessages"
//         component={TaskMessagesScreen}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="EditTask"
//         component={EditTaskScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TaskCategory"
//         component={TaskCategoryScreen}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="AddQuotes"
//         component={AddQuotes}
//         options={{ headerShown: false }}
//       />

//       <Stack.Screen
//         name="AddQuoteValue"
//         component={AddQuoteValue}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

// const MyMessagesStack = (props) => {
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="MyMessages"
//         component={MyMessagesScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="MyMessageGroup"
//         component={MyMessageGroupScreen}
//         options={{ headerShown: false }}
//       />
//       {/* <Stack.Screen
//         name="AddTask"
//         component={AddTaskScreen}
//         options={{headerShown: false}}
//       />
//        <Stack.Screen
//         name="EditTask"
//         component={EditTaskScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="TaskCategory"
//         component={TaskCategoryScreen}
//         options={{headerShown: false}}
//       />
//        <Stack.Screen
//         name="Tasks"
//         component={TasksScreen}
//         options={{headerShown: false}}
//       /> */}
//     </Stack.Navigator>
//   );
// };

// function AssetsStack(props) {
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="Assets"
//         initialParams={{ pageData: props.pageData }}
//         options={{ headerShown: false }}
//       >
//         {(props) => <AssetsScreen {...props} />}
//       </Stack.Screen>
//       {/* <Stack.Screen
//         name="Groups"
//         component={GroupsScreen}
//         options={{headerShown: false}}
//       /> */}
//       {/* <Stack.Screen
//         name="AddTask"
//         component={AddTaskScreen}
//         options={{headerShown: false}}
//       />
//        <Stack.Screen
//         name="EditTask"
//         component={EditTaskScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="TaskCategory"
//         component={TaskCategoryScreen}
//         options={{headerShown: false}}
//       />
//        <Stack.Screen
//         name="Tasks"
//         component={TasksScreen}
//         options={{headerShown: false}}
//       /> */}
//     </Stack.Navigator>
//   );
// }

// const AppStack = (props) => {
//   // alert(JSON.stringify(props.route.params.clientAppData));
//   let clientAppData = props.route.params.clientAppData
//     ? props.route.params.clientAppData.filter(
//         (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
//       )
//     : null;

//   if (clientAppData == null) {
//     // let commonData = CommonDataManager.getInstance();
//     // let clientApps = commonData.getClientAppData();
//     //  alert(JSON.stringify(clientApps));
//     try {
//       clientAppData = udatabase.getUserDatAsync("clientApps");

//       clientAppData = JSON.parse(clientAppData.userData);
//       clientAppData = clientAppData.filter(
//         (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
//       );
//     } catch (e) {
//       clientAppData = null;
//     }
//   }

//   let clientAppName1 = "";
//   let clientAppName2 = "";
//   let clientAppName3 = "";

//   if (clientAppData != null && clientAppData.length > 0)
//     clientAppName1 = clientAppData[0].ReportMenuLabel;

//   if (clientAppData != null && clientAppData.length >= 2)
//     clientAppName2 = clientAppData[1].ReportMenuLabel;

//   if (clientAppData != null && clientAppData.length >= 3)
//     clientAppName3 = clientAppData[2].ReportMenuLabel;

//   let initialRouteName =
//     clientAppName1 == "My Messages" ? "MyMessagesStack" : "HomeStack";
//   let ismsg = clientAppName1 == "My Messages" ? true : false;

//   return (
//     <Tab.Navigator
//       initialRouteName={initialRouteName}
//       tabBarOptions={{
//         activeTintColor: "#17a2b8",
//         backgroundColor: "gray",
//       }}
//     >
//       {/* <Tab.Screen
//           name="MyMessagesStack"
//           component={MyMessagesStack}
//           options={{
//             tabBarLabel: 'My Messages',
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons name="home" color={color} size={size} />
//             ),
//           }}
//         /> */}

//       {clientAppData.length > 0 ? (
//         <Tab.Screen
//           name="HomeStack1"
//           children={() => (
//             <HomeStack pageData={clientAppData[0]} ismsg={true} />
//           )}
//           options={{
//             tabBarLabel: clientAppName1,
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons
//                 name="message"
//                 color={color}
//                 size={size}
//               />
//             ),
//           }}
//         />
//       ) : null}
//       {clientAppData.length >= 2 ? (
//         <Tab.Screen
//           name="HomeStack2"
//           children={() => (
//             <HomeStack pageData={clientAppData[1]} ismsg={false} />
//           )}
//           options={{
//             tabBarLabel: clientAppName2,
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons
//                 name="folder-open"
//                 color={color}
//                 size={size}
//               />
//             ),
//           }}
//         />
//       ) : null}
//       {clientAppData.length >= 3 ? (
//         <Tab.Screen
//           name="HomeStack3"
//           children={() => (
//             <HomeStack pageData={clientAppData[2]} ismsg={false} />
//           )}
//           options={{
//             tabBarLabel: clientAppName3,
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons
//                 name="folder-open"
//                 color={color}
//                 size={size}
//               />
//             ),
//           }}
//         />
//       ) : null}
//       <Tab.Screen
//         name="SettingsStack"
//         component={SettingsStack}
//         options={{
//           tabBarLabel: "Menu",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="menu" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };