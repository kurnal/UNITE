import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Autocomplete from 'react-native-autocomplete-input'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import { SUGGESTIONS } from '../../../tags'



export default class ExploreScreen extends React.Component {

  static navigationOptions = {
    title: 'Explore',
  };

  state = {
    search: '',
    events: [],
    noEvents: false,
    info: (SUGGESTIONS.ACADEMIC, SUGGESTIONS.TAGS),
    query: '',
    radio_props: [
      {label: 'tags', value: 0 },
      {label: 'academics', value: 1 }
    ]
  };

  constructor() {
    super();

    this.current = firebase.auth().currentUser;
    this.eventsRef = firebase.firestore().collection('Tags').doc('Academic')

  }


  componentDidMount = () => {
    console.log(SUGGESTIONS.TAGS);
    console.log(SUGGESTIONS.ACADEMIC);
  }

  obtainEventsInfo = () => {
    return Promise.resolve(
      this.eventsRef.get()
        .then(snapshot => {

          if (snapshot.empty) {
            this.setState({ noEvents: true })
            return;
          }

        })
        .catch(err => {
          console.log('Error getting documents', err);
        })
    );
  }
  
  updateSearch = (search) => {
    this.setState({ search });
    this.setState({value:value})
  };

  _filterData = (query) => {

    if (query === '') {
      return [];
    }
    
    const info = SUGGESTIONS.ACADEMIC; // NEED TO PASS INTO HERE
    
    const regex = new RegExp(`${query.trim()}`, 'i');
    return info.filter(info => info.search(regex) >= 0);

  }
  
  render() {

    const data = this._filterData(this.state.query);

    return (

      <View>
        <Autocomplete
          data={data}
          defaultValue={this.state.query}
          onChangeText={text => this.setState({ query: text })}
          renderItem={({ item, i }) => (
            <TouchableOpacity onPress={() => this.setState({ query: item })}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <RadioForm
          radio_props={this.state.radio_props}
          initial={0}
          formHorizontal={false}
          labelHorizontal={true}
          buttonColor={'#2196f3'}
          animation={true}
          onPress={(value) => {this.setState({value:value})}}
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
});





