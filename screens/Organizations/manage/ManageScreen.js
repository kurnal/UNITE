import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class ManageScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Manage',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text> 
          Where organizations will be able to post messages on their message board
          so that there subscribers can see new updates. They can post events in in which
          people can attend using a QR code as a ticket. If they are a club they can also
          post meeting times for people who are members of their club.

          There will be a top navigation bar -> Events, Meetings, Messages

          On Events you can post events and then see how many people are who are signing
          up for it as time goes on.

          Meetings will show who is a member of a your club and will let you post meeting 
          times along with the agenda.

          Messages is like a board and you can send messages that update your subscribers
          with new information.

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