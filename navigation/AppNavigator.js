import React from 'react';

import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';


import AuthLoadingScreen from '../screens/login/AuthLoadingScreen';
import SignUpScreen from '../screens/login/SignUpScreen';
import LoginScreen from '../screens/login/LoginScreen';

import ChooseAccountTypeScreen from '../screens/ChooseAccountTypeScreen';

import StudentTabNavigator from './StudentTabNavigator';
import OrganizationTabNavigator from './OrganizationTabNavigator';


const StudentStack = createStackNavigator({ Student: StudentTabNavigator });
const OrganizationStack = createStackNavigator({ Organization: OrganizationTabNavigator });
const AuthStack = createStackNavigator({ SignUp: SignUpScreen, Login: LoginScreen });


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    ChooseAccountType: ChooseAccountTypeScreen,
    Auth: AuthStack,
    Student: StudentStack,
    Organization: OrganizationStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
));