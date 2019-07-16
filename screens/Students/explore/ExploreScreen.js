import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Autocomplete from 'react-native-autocomplete-input'

import { SUGGESTIONS } from '../../../tags'


export default class ExploreScreen extends React.Component {

  static navigationOptions = {
    title: 'Explore',
  };

  state = {
    search: '',
    events: [],
    noEvents: false,
    info: SUGGESTIONS.TAGS,
    query: ''
  };

  constructor() {
    super();

    this.current = firebase.auth().currentUser;
    this.eventsRef = firebase.firestore().collection('Tags').doc('Academic')


  }

  componentDidMount = () => {
    console.log(SUGGESTIONS.TAGS);
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
  };

  _filterData = (query) => {

    if (query === '') {
      return [];
    }

    const { info } = this.state;
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





