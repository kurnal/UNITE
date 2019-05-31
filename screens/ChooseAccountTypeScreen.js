import React from 'react';
import {View, Button, StyleSheet} from 'react-native'
import firebase from 'react-native-firebase'

export default class ChooseAccountTypeScreen extends React.Component {

constructor() {
    super();
    this.current = firebase.auth().currentUser;
    this.ref = firebase.firestore().collection('Users');
}

  static navigationOptions = {
    title: 'Settings',
  };

  accountForStudent = () => {
    this.ref.doc(this.current.uid).set({
        email: this.current.email,
        StudentOrOrganization: "Student"
      }).then(user => this.props.navigation.navigate('Student'));
  }    
  
  accountForOrg = () => {
    this.ref.doc(this.current.uid).set({
        email: this.current.email,
        StudentOrOrganization: "Organization"
      }).then(user => this.props.navigation.navigate('Organization'));
  }  
 
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Student" onPress={this.accountForStudent}
        />
        <Button
          title="Organization" onPress={this.accountForOrg}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})