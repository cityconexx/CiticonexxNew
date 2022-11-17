import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignInScreen from "../screens/SignIn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OrganisationScreen from "../screens/Organisation";
import TaskScreen from "../screens/Tasks";
import SettingsScreen from "../screens/Settings";
import NotificationScreen from "../screens/SendNotification";
import { Header } from "../components/";
import GroupsScreen from "../screens/Groups";
import GroupFilterScreen from "../screens/GroupFilter";
import AddTaskScreen from "../screens/AddTask"; //having some error on this file
import TaskDetailScreen from "../screens/TaskTabDetail";
import TaskMessagesScreen from "../screens/TaskMessages";
import TaskMessageDetailScreen from "../screens/TaskMessageDetail";
// import EditTaskScreen from "../screens/EditTask";
import TaskCategoryScreen from "../screens/TaskCategory";
import AddQuotes from "../screens/quotes/AddQuotes";
import AddQuoteValue from "../screens/quotes/AddQuoteValue";
import ScannerResult from "../screens/ScannerResult";
import ScannerScreen from "../screens/Scanner";
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const SettingsStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Menus"
      mode="card"
      headerMode="screen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Menus"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Menus" scene={scene} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default function SignInStack(props) {
  return (
    <Stack.Navigator
      mode="card"
      headerMode="screen"
      screenOptions={{
        contentStyle: { backgroundColor: "#ffffff" },
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={SignInScreen}
        option={{
          headerTransparent: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Organisation"
        component={OrganisationScreen}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
const AppStack = (props) => {
  let clientAppData = props.route.params.clientAppData
    ? props.route.params.clientAppData.filter(
        (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
      )
    : null;
  if (clientAppData == null) {
    try {
      clientAppData = udatabase.getUserDatAsync("clientApps");

      clientAppData = JSON.parse(clientAppData.userData);
      clientAppData = clientAppData.filter(
        (e) => e.AddToAlwaysShow > 0 && e.DisableOnMobileApp == 0
      );
    } catch (e) {
      clientAppData = null;
    }
  }

  let clientAppName1 = "";
  let clientAppName2 = "";
  let clientAppName3 = "";

  if (clientAppData != null && clientAppData.length > 0)
    clientAppName1 = clientAppData[0].ReportMenuLabel;

  if (clientAppData != null && clientAppData.length >= 2)
    clientAppName2 = clientAppData[1].ReportMenuLabel;

  if (clientAppData != null && clientAppData.length >= 3)
    clientAppName3 = clientAppData[2].ReportMenuLabel;

  let initialRouteName =
    clientAppName1 == "My Messages" ? "MyMessagesStack" : "HomeStack";
  let ismsg = clientAppName1 == "My Messages" ? true : false;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        activeTintColor: "#17a2b8",
        backgroundColor: "gray",
        headerShown: false,
      }}
    >
      {clientAppData.length > 0 ? (
        <Tab.Screen
          name="HomeStack1"
          children={() => (
            <HomeStack pageData={clientAppData[0]} ismsg={true} />
          )}
          options={{
            tabBarLabel: clientAppName1,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="message"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : null}
      {clientAppData.length >= 2 ? (
        <Tab.Screen
          name="HomeStack2"
          children={() => (
            <HomeStack pageData={clientAppData[1]} ismsg={false} />
          )}
          options={{
            tabBarLabel: clientAppName2,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="folder-open"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : null}
      {clientAppData.length >= 3 ? (
        <Tab.Screen
          name="HomeStack3"
          children={() => (
            <HomeStack pageData={clientAppData[2]} ismsg={false} />
          )}
          options={{
            tabBarLabel: clientAppName3,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="folder-open"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : null}

      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="menu" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const HomeStack = (props) => {
  //alert(props.pageData);
  return (
    <Stack.Navigator
      mode="card"
      headerMode="screen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Tasks"
        initialParams={{ pageData: props.pageData, ismsg: props.ismsg }}
        options={{ headerShown: false }}
      >
        {(props) => <TaskScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ScannerResult"
        component={ScannerResult}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Groups"
        component={GroupsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupFilter"
        component={GroupFilterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskMessageDetail"
        component={TaskMessageDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TaskMessages"
        component={TaskMessagesScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="TaskCategory"
        component={TaskCategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddQuotes"
        component={AddQuotes}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddQuoteValue"
        component={AddQuoteValue}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
