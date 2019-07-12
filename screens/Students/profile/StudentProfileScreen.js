import React, {Component} from 'react';
import { ScrollView, Text, View, Image, StyleSheet, Button, Alert} from 'react-native';
// import { ExpoLinksView } from '@expo/samples';
// import SearchBar from 'react-native-search-bar'

export default class ProfileScreen extends React.Component {

  // _onPress() {
  //   Alert.alert('on Press!');
  //  }
  
  // static navigationOptions = {
  //   title: 'Student Profile',
  // };


  render() {
    return (

//       <Image style={styles.headerBackground} source={require('../screens/stock-photo].jpg')}>

//       <View style={styles.header}>

//         <View style={styles.profpicWrap}>
//           <Image style={styles.profpic} source={require('../screens/stock-photo-2.jpg')} />
//         </View>

//         <View style={styles.container}>
//         <View style={styles.buttonContainer}>
//           <Button onPress={this._onPress} title="Save" color="#FFFFFF" accessibilityLabel="Tap on Me"/>
//         </View>
//       </View>


//         <Text style = {styles.members}> 104 members</Text>
//         <Text style = {styles.approval}> 1064 members</Text>

//         <Text style={styles.name}>Arko Mazumder</Text>
//           <Text style={styles.tag}>Sample Tagline</Text>

//       <ScrollView style={styles.container}>
//         <Text> 
//           Where users will be able to design their profile and their preferences such that our explore module
//           can properly recommend clubs and events to them. We might also want to develop a friend system of sorts
//           so we can recommend events based on their friends and their interests. Also we need a creative way to 
//           gather information on their interests and desires.
//         </Text>
//       </ScrollView>

      

//       <ScrollView style={styles.tagbase}>
//         <Text> 
//           SGA 
//           Terrapin Hackers
//           Bitcamp 
//           XR Club 
//         </Text>
//       </ScrollView>

//       </View>

// </Image>

<View> </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
    buttonContainer: {
      backgroundColor: '#2E9298',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 10,
      shadowOpacity: 0.25
    },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  tagbase: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  profpicWrap: {
    width: 100, 
    height: 100,
    borderRadius: 100,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 10
  },
  profpic: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2
  },
  members: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2
  },
  approval: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2
  },
  name: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 2
  },
  tag: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '300',
    fontStyle: 'italic'
  }
});