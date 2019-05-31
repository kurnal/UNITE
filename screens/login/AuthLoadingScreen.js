import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'

export default class Loading extends React.Component {

  constructor() {
    super();
    this.db = firebase.firestore().collection('Users');
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.navigation.navigate('Auth');
      } else {
        this.db.doc(firebase.auth().currentUser.uid).get()
        .then(doc => {
          if (!doc.exists) {
            this.props.navigation.navigate('ChooseAccountType');
          } else {
            if (doc.data().StudentOrOrganization === "Student") {
              this.props.navigation.navigate('Student');
            } else if (doc.data().StudentOrOrganization === "Organization") {
              this.props.navigation.navigate('Organization');
            } else {
              this.props.navigation.navigate('ChooseAccountType');
            }
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
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