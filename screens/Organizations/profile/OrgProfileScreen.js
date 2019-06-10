import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, Button, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import firebase from 'react-native-firebase';
import { Input, Icon, Avatar, ListItem, Left, Right, Body } from 'react-native-elements';



export default class OrgProfileScreen extends React.Component {

  state = {
    name: '',
    tagline: '',
    members: 1,
    approval: 1,
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
      tagline: this.state.tagline,
      description: this.state.description

    });

  }

  render() {
    return (
      <View style={styles.container}>
        <Avatar
          size="xlarge"
          rounded
          icon={{ name: 'home', type: 'font-awesome' }}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
          containerStyle={{ marginLeft: 110 }}
        />
        <ListItem
          leftAvatar={
            <Icon
              name='group'
              size={24}
              color='black'
              underlayColor='gold'></Icon>
          }
          title={<Text>{this.state.members}</Text>}>

        </ListItem>
        <ListItem
          leftAvatar={
            <Icon
              name='check'
              size={24}
              color='black'
              underlayColor='gold'></Icon>
          }
          title={<Text>{this.state.approval}</Text>}>

        </ListItem>

        <Input placeholder='Organization Name'
          leftIcon={
            <Icon
              name='bookmark'
              size={24}
              color='black'
              underlayColor='gold'></Icon>
          }
          value={this.state.name}
          onChangeText={name => this.setState({ name })}>
        </Input>
        <Input placeholder='TagLine'
          leftIcon={
            <Icon
              name='description'
              size={24}
              color='black'
              underlayColor='gold'></Icon>
          }
          value={this.state.tagline}
          onChangeText={tagline => this.setState({ tagline })}>
        </Input>
        <TextInput
          placeholder='Event Description'
          multiline={true}
          numberOfLines={4}
          size={24}
          onChangeText={(description) => this.setState({ description })}
          value={this.state.description} />

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

