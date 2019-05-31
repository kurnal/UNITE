import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class OrgProfileScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Organization Profile',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text> 
          Where organizations will be able to set their description, logo, and
          the general tags associated with them. Super simple and not much going
          on to be honest. make it look sexy though. 
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