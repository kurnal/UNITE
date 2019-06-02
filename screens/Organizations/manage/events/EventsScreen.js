import React from 'react';
import { ScrollView, StyleSheet, Text, Button, View,
Modal, TouchableHighlight, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

export default class EventsScreen extends React.Component {

  static navigationOptions = {
    title: 'Manage',
  };

  render() {

    return (
      <View>
        <Icon
          raised
          name='thumb-tack'
          type='font-awesome'
          color='#f50'
          onPress={() => 
            {
              console.log(this.props.navigation);
            this.props.navigation.push('EventCreation')
            }  
          }
          containerStyle={styles.eventsFormButton}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  eventsFormButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 15
  },
});