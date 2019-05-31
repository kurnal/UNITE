import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class ExploreScreen extends React.Component {
  static navigationOptions = {
    title: 'Explore',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text> 
          Where users will be able explore all the events and clubs on campus. This page will be organized
          such that users can easily sift between popular and recommended. The recommended engine must work
          very well. Tabular indexing based on tags, key words, category, etc and must be neat. When clicking
          on events, we must have a different UI for private versus public and how we handle entry. For clubs we
          probably should make something cool to help facilitate communication.
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
