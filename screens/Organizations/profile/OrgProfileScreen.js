import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import firebase from 'react-native-firebase';
import { Input, Icon} from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';

// const Form = t.form.Form;

// const User = t.struct({
//   title: t.String,
//   Description : t.String,
//   terms: t.Boolean
// });

// const formStyles = {
//   ...Form.stylesheet,
//   formGroup: {
//     normal: {
//       marginBottom: 10
//     },
//   },
//   controlLabel: {
//     normal: {
//       color: 'blue',
//       fontSize: 18,
//       marginBottom: 7,
//       fontWeight: '600'
//     },
//     // the style applied when a validation error occours
//     error: {
//       color: 'red',
//       fontSize: 18,
//       marginBottom: 7,
//       fontWeight: '600'
//     }
//   }
// }

// const options = {
//   fields: {
//     title: {
//       error: 'Without a club name how do you expect anyone to know you?!'
//     },
//     Description : {
//       error: 'Make it flamboyent'
//     },
//     terms: {
//       label: 'Agree to Terms, or else',
//     },
//   },
//   stylesheet: formStyles,
// };

export default class OrgProfileScreen extends React.Component {

  constructor() {
    super();
    this.title = '',
    this.description = '', 
    this.ref = firebase.firestore().collection('Organization'),
    this.currrent = firebase.auth().currentUser;
  }
  static navigationOptions = {
    title: 'Organization Form',
  };
  
  ///DOESNT WORK //////////////////////////////////////////////////
  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  ///DOESNT WORKKKKK ////////////////////////////////////////
  handleSubmit = (e) => {
      this.ref.doc(this.state).update({
          title: this.title, 
          description: this.description
      });
    
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Input placeholder = 'Organization Name'
               leftIcon={
                 <Icon 
                  name = 'people'
                  size={24}
                  color='black'
                  underlayColor='gold'></Icon>
               }
                onChange = {this.updateInput}>
      </Input>
       <Input placeholder = 'Description'
               leftIcon={
                 <Icon 
                  name = 'description'
                  size={24}
                  color='black'
                  underlayColor='gold'></Icon>
               }
              onChange = {this.updateInput}>
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
  
