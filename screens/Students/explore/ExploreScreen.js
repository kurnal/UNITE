import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SearchBar} from 'react-native-elements';

export default class ExploreScreen extends React.Component {
  state = {
    search: '',
  };
  
  updateSearch = (search) => {
    this.setState({ search });
  };
  static navigationOptions = {
    title: 'Explore',
  };

  render() {
    const { search } = this.state;
    return (
      <SearchBar
        placeholder='Type Here...'
        platform='ios'
        onChangeText={query => { this.setState({ search: query }); }}
        value={search}
      />
      
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





