import React from 'react';
import {View, Button} from 'react-native'
import firebase from 'react-native-firebase'


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  handleSignOut = () => {
    firebase.auth().signOut()
    .then(user => this.props.navigation.navigate('Auth'))
    .catch(error => this.setState({ errorMessage: error.message }))
  }
  
  render() {
    return (
      <View>
        <Button
          title="Logout" onPress={this.handleSignOut}
        />
      </View>
    )
  }
}
