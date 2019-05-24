import React from 'react';
import { ScrollView, StyleSheet, Text} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class VaultScreen extends React.Component {
  static navigationOptions = {
    title: 'Treasure',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text> 
          Where users can see the private and public events they are committed to and when they are occurring. 
          These events will also have a corresponding QR code with them to allow the user to gain entry. The times
          of club meetings and such will be included as well. In addition, this page will have a notifcation board
          of messages that club presidents and event organizers send out or we can use the functionality of another
          API to do this. Finally, the vault will send the user notifcations of timings and such.
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