import React from 'react';
import { Platform } from 'react-native';
import { createMaterialTopTabNavigator, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation';

import ManageScreen from '../../../screens/Organizations/manage/ManageScreen';

import EventsScreen from '../../../screens/Organizations/manage/events/EventsScreen';
import EventCreationScreen from '../../../screens/Organizations/manage/events/EventCreationScreen';

import MeetingsScreen from '../../../screens/Organizations/manage/meetings/MeetingsScreen';
import MeetingsCreationScreen from '../../../screens/Organizations/manage/meetings/MeetingsCreationScreen';
import EditMeetings from '../../../screens/Organizations/manage/meetings/creationForms/EditMeetings';

import MessagesScreen from '../../../screens/Organizations/manage/MessagesScreen';

const ManageStack = createSwitchNavigator({
  Manage: ManageScreen,
});

ManageStack.navigationOptions = {
  tabBarLabel: 'Manage'
};

const EventStack = createStackNavigator({
  Events: {
    screen: EventsScreen,
    navigationOptions: {
      header: null
    }
  },
  EventCreation: {
    screen: EventCreationScreen,
  }
}, {
    mode: 'modal',
    headerMode: 'screen',
  });

EventStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Events',
  };
};

const MeetingsStack = createStackNavigator({
  Meetings: {
    screen: MeetingsScreen,
    navigationOptions: {
      header: null
    }
  },
  MeetingsCreation: {
    screen: MeetingsCreationScreen
  },
  EditMeetings: {
    screen: EditMeetings
  }
}, {
    mode: 'modal',
    headerMode: 'screen',
  });

MeetingsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  
  return {
    tabBarVisible,
    tabBarLabel: 'Meetings'
  };
};

const MessagesStack = createSwitchNavigator({
  Messages: MessagesScreen,
});

MessagesStack.navigationOptions = {
  tabBarLabel: 'Messages'
};

export default createMaterialTopTabNavigator({
  ManageStack,
  Events: EventStack,
  MeetingsStack,
  MessagesStack,
});
