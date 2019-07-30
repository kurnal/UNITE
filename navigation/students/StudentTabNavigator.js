import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../components/TabBarIcon';
import HomeScreen from '../../screens/Students/HomeScreen';
import ExploreScreen from '../../screens/Students/explore/ExploreScreen';
import ProfileScreen from '../../screens/Students/profile/StudentProfileScreen';

import VaultScreen from '../../screens/Students/vault/VaultScreen';
import EventTicketScreen from '../../screens/Students/vault/EventTicket'
import MeetingTicketScreen from '../../screens/Students/vault/MeetingTicket'

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

const ExploreStack = createStackNavigator({
  Explore: ExploreScreen,
});

ExploreStack.navigationOptions = {
  tabBarLabel: 'Explore',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
    />
  ),
};

const VaultStack = createStackNavigator({
  Vault: VaultScreen,
  EventTicket: {
    screen: EventTicketScreen,
  },
  MeetingTicket: {
    screen: MeetingTicketScreen
  }
}, {
    mode: 'modal',
    headerMode: 'none',
  });

VaultStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

VaultStack.navigationOptions = {
  tabBarLabel: 'Vault',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-aperture' : 'md-dungeon'}
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
  ExploreStack,
  VaultStack,
  ProfileStack,
  SettingsStack
});
