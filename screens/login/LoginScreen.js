import React from 'react'
import { View, Button, StyleSheet, Text, TextInput } from 'react-native'
import firebase from 'react-native-firebase'


export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  constructor() {
    super();
    this.db = firebase.firestore().collection('Users');
  }

  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(
        user => {
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
      )
      .catch(error => 
        this.setState({ errorMessage: error.message })
        )
  }



  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate('SignUp')}
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
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})



