import React from 'react';
import { StyleSheet, Button, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements'
import { Container, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body } from 'native-base'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Modal from "react-native-modal";

import firebase from 'react-native-firebase';
import update from 'immutability-helper';

export default class EventsScreen extends React.Component {


  static navigationOptions = {
    title: 'Events',
  };

  state = {
    events: [],
    activeSlide: 0,
    isModalVisible: false
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  constructor() {
    super();

    this.current = firebase.auth().currentUser;
    this.eventsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Events');

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
  }


  componentDidMount() {

    this.eventsRef.where('happened', '==', false).get()
      .then(snapshot => {

        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          holder = this.state.events.concat({
            eventName: doc.id,
            eventDescription: doc.data().eventDescription,
            startDate: doc.data().startDate,
            endDate: doc.data().endDate,
            capacity: doc.data().capacity,
            public: doc.data().public,
            open: doc.data().open,
            qr_encode: doc.data().qr_encode,
            happened: doc.data().happened,
            attending: doc.data().attending
          });

          this.setState({
            events: holder
          });

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  componentDidUpdate() {



    this.eventsRef.where('happened', '==', false)
      .onSnapshot(querySnapshot => {

        if (querySnapshot.empty) {
          console.log('Empty Documents');
          return;
        }

        querySnapshot.docChanges.forEach(change => {

          if (change.type === 'modified') {
            console.log('New Dude: ', change.doc.data());
            this.setState({ events: update(this.state.events, { 0: { attending: { $set: change.doc.data().attending } } }) })
          }

        });
      });
  }

  _renderItem({ item, index }) {
    return (
      <Card style={styles.card}>
        <CardItem header style={styles.cardHeader}>
          <Text style={[styles.captionText, { color: 'white' }]}>{item.eventName}</Text>
          <View style={styles.absolute}>
            <Icon
              name='user'
              type='font-awesome'
              color='white'
              iconStyle={{ marginRight: 10 }}
            />
            <Text style={[styles.captionText, { color: 'white' }]}>{item.attending}</Text>
          </View>
        </CardItem>
        <View style={styles.cardBody}>
          <Body>
            <Icon
              raised
              name='dashboard'
              type='font-awesome'
              color='#f50'
              size={40}
              onPress={() => { this.props.navigation.push('EventCreation') }}
            />
            <Text style={styles.captionText}> Analytics </Text>
          </Body>
          <Body>
            <Icon
              raised
              name='user'
              type='font-awesome'
              color='#f50'
              size={40}
              onPress={() => { this.props.navigation.push('EventCreation') }}
              size={40}
            />
            <Text style={styles.captionText}> Guest List </Text>
          </Body>
          <Body>
            <Icon
              raised
              name='pencil'
              type='font-awesome'
              color='#f50'
              size={40}
              onPress={() => { this.props.navigation.push('EventCreation') }}
            />
            <Text style={styles.captionText}> Revise </Text>
          </Body>
        </View>
      </Card>
    );
  }

  get pagination() {
    const { events, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={events.length}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'black'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {

    return (
      <Container>
        <View style={styles.eventsFormButton}>
          <Icon
            raised
            name='thumb-tack'
            type='font-awesome'
            color='#f50'
            onPress={() => {
              this.props.navigation.push('EventCreation')
            }
            }
          />
        </View>

        <View>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={this.state.events}
            renderItem={this._renderItem}
            sliderWidth={this.width}
            itemWidth={this.width}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
            layout='tinder'
          />
          {this.pagination}
        </View>

        <View style={{ flex: 1 }}>
          <Button title="Show modal" onPress={this.toggleModal} />
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{ flex: 1 }}>
              <Text>Hello!</Text>
              <Button title="Hide modal" onPress={this.toggleModal} />
            </View>
          </Modal>
        </View>
        {/* <Button title="gay" onPress={() => console.log(this.state.events[0].attending)} /> */}

      </Container>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  eventsFormButton: {
    alignItems: 'flex-end'
  },
  absolute: {
    position: 'absolute',
    top: 15,
    right: 10,
    flexDirection: 'row',
  },
  card: {
    padding: 10
  },
  cardHeader: {
    backgroundColor: '#FF4136',
    marginBottom: 5
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  captionText: {
    fontFamily: 'Avenir',
    fontSize: 18
  }
});