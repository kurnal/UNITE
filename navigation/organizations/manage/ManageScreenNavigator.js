import React from 'react';
import { Platform } from 'react-native';
import { createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import ManageScreen from '../../../screens/Organizations/manage/ManageScreen';

import EventsScreen from '../../../screens/Organizations/manage/events/EventsScreen';
import EventCreationScreen from '../../../screens/Organizations/manage/events/EventCreationScreen';

import MeetingsScreen from '../../../screens/Organizations/manage/MeetingsScreen';
import MessagesScreen from '../../../screens/Organizations/manage/MessagesScreen';

const ManageStack = createSwitchNavigator({
  Manage: ManageScreen,
});

ManageStack.navigationOptions = {
  tabBarLabel: 'Manage'
};

const EventStack = createStackNavigator({
  Events: EventsScreen,
  EventCreation: EventCreationScreen,
},{
  headerMode: 'none'
});

EventStack.navigationOptions = {
  tabBarLabel: 'Events',
};

const MeetingsStack = createSwitchNavigator({
  Meetings: MeetingsScreen,
});

MeetingsStack.navigationOptions = {
  tabBarLabel: 'Meetings'
};

const MessagesStack = createSwitchNavigator({
  Messages: MessagesScreen,
});

MessagesStack.navigationOptions = {
  tabBarLabel: 'Messages'
};

export default createMaterialTopTabNavigator({
  ManageStack,
  EventStack,
  MeetingsStack,
  MessagesStack
});