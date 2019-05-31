import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class ProfileScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Student Profile',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text> 
          Where users will be able to design their profile and their preferences such that our explore module
          can properly recommend clubs and events to them. We might also want to develop a friend system of sorts
          so we can recommend events based on their friends and their interests. Also we need a creative way to 
          gather information on their interests and desires.
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
});