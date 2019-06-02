import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import firebase from 'react-native-firebase';
import { Input, Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';

export default class OrgProfileScreen extends React.Component {

  state = {
    name: '',
    description: '',
  }

  constructor() {
    super();
    this.ref = firebase.firestore().collection('Users'),
    this.current = firebase.auth().currentUser;
  }
  static navigationOptions = {
    title: 'Organization Form',
  };

  handleSubmit = () => {
    this.ref.doc(this.current.uid).update({
      title: this.state.name,
      description: this.state.description
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <Input placeholder='Organization Name'
          leftIcon={
            <Icon
              name='people'
              size={24}
              color='black'
              underlayColor='gold'></Icon>
          }
          value={this.state.name}
          onChangeText={name => this.setState({name})}>
        </Input>
        <Input placeholder='Description'
          leftIcon={
            <Icon
              name='description'
              size={24}
              color='black'
              underlayColor='gold'></Icon>
          }
          value={this.state.description}
          onChangeText={description => this.setState({description})}>
        </Input>
      
        <Button
          icon={
            <Icon
              name="arrow-right"
              size={15}
              color="white"
            />
          }
          title="Sign Up"
          onPress={this.handleSubmit}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },

});

