import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../components/TabBarIcon';
import HomeScreen from '../../screens/Organizations/HomeScreen';
import ScannerScreen from '../../screens/Organizations/scanner/ScannerScreen'

import ManageScreen from '../../screens/Organizations/manage/ManageScreen'
import EventCreationScreen from '../../screens/Organizations/manage/events/EventCreationScreen';
import MeetingsCreationScreen from '../../screens/Organizations/manage/meetings/MeetingsCreationScreen';
import EditMeetings from '../../screens/Organizations/manage/meetings/creationForms/EditMeetings';

import ProfileScreen from '../../screens/Organizations/profile/OrgProfileScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});


HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const ScannerStack = createStackNavigator({
  Scanner: ScannerScreen,
}, {
  headerMode: 'none'
});

ScannerStack.navigationOptions = {
  tabBarLabel: 'Scanner',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-qr-scanner' : 'md-qr-scanner'}
    />
  ),
};

const ManageStack = createStackNavigator({
  Manage: {
    screen: ManageScreen,
    navigationOptions: {
      header: null
    }
  },
  EventCreation: EventCreationScreen,
  MeetingsCreation: MeetingsCreationScreen,
  EditMeetings: EditMeetings,
},{
});

ManageStack.navigationOptions = {
  tabBarLabel: 'Manage',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-user'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};



export default createBottomTabNavigator({
  HomeStack,
  ScannerStack,
  ManageStack,
  ProfileStack,
  SettingsStack
});