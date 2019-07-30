import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Icon } from 'react-native-elements'
import { View, Card, CardItem, Text, Button, Left, Right, Accordion, CardSwiper, Container } from 'native-base'
import { QRCode } from 'react-native-custom-qr-codes'

import update from 'immutability-helper'
import moment from 'moment'
import firebase from 'react-native-firebase';
import jsonpack from 'jsonpack'


export default class VaultScreen extends React.Component {

  static navigationOptions = {
    title: 'Vault',
  };

  constructor(props) {

    super(props);

    this.current = firebase.auth().currentUser;
    this.userRef = firebase.firestore().collection('Users').doc(this.current.uid)

    this.state = {
      eventRefs: [],
      meetingsRef: [],
      treasure: {},
      personal: {},
      currentDate: moment(),
    };

  }

  gatherDates = () => {

    let date = moment()
    let sixMonths = moment().add(6, 'months')
    let holder = {};

    var promise = new Promise(function (resolve, reject) {
      while (date.isBefore(sixMonths)) {
        formattedDate = date.format('YYYY-MM-DD')
        holder[formattedDate] = []
        date = date.add(1, 'day')
      }
      resolve(true)
    })

    return new Promise.resolve(
      promise.then(() => this.setState({ treasure: holder }))
    )

  }

  obtainPersonalInfo = () => {
    return Promise.resolve(
      this.userRef.get().then(doc => {
        this.setState({
          personal: {
            name: doc.data().name,
            uid: doc.data().uid,
            birthday: doc.data().birthday
          }
        })
      })
    )
  }

  obtainEventsAndMeetsRefs = () => {
    return Promise.resolve(
      this.userRef.get().then(
        doc => {
          this.setState(
            {
              eventRefs: doc.data().Events,
              meetingsRef: doc.data().Meets
            }
          )
        }
      )
    )
  }

  obtainEvents = () => {

    var that = this

    return new Promise(async function (resolve, reject) {
      for (i = 0; i < that.state.eventRefs.length; i++) {
        docRef = that.state.eventRefs[i]._documentPath._parts[1];

        await new Promise(resolve => {
          firebase.firestore().collection('All Events').doc(docRef).get().then(
            doc => {
              that.setState(prevState => ({
                markedDates: { ...prevState.markedDates, [doc.data().date]: { marked: true, dotColor: (doc.data().privacy == 'public') ? '#5f9ea0': '#ffa500' }},
                treasure: update(that.state.treasure, {
                  [doc.data().date]: {
                    ...prevState.treasure[doc.data().date],
                    $push: [
                      {
                        type: 'event',
                        eventName: doc.data().eventName,
                        eventDescription: doc.data().eventDescription,
                        startDate: doc.data().startDate,
                        endDate: doc.data().endDate,
                        date: doc.data().date,
                        location: doc.data().location,
                        privacy: doc.data().privacy,
                        status: doc.data().status,
                        organizationName: doc.data().organizationName,
                        attending: doc.data().attending,
                        qr_info: {
                          _id: doc.id,
                          personal: that.state.personal
                        }
                      }
                    ]
                  }
                })
              }))
              resolve()
            }
          )
        })

        if (i == that.state.eventRefs.length - 1) {
          resolve(true)
        }
      }
    })
  }

  obtainMeetings = () => {

    var that = this

    return new Promise(async function (resolve, reject) {

      for (i = 0; i < that.state.meetingsRef.length; i++) {

        userRef = that.state.meetingsRef[i]._documentPath._parts[1];
        meetRef = that.state.meetingsRef[i]._documentPath._parts[3];
        ref = firebase.firestore().collection('Users').doc(userRef)
          .collection('Meets').doc(meetRef)

        await new Promise(resolve => {
          ref.get().then(
            doc => {
              that.setState(prevState => ({
                markedDates: { ...prevState.markedDates, [doc.data().date]: { marked: true, dotColor: '#FF4136' }},
                treasure: update(that.state.treasure, {
                  [doc.data().date]: {
                    ...prevState.treasure[doc.data().date],
                    $push: [
                      {
                        type: 'meeting',
                        _id: doc.id,
                        headline: doc.data().headline,
                        agenda: doc.data().agenda,
                        startTime: doc.data().startTime,
                        endTime: doc.data().endTime,
                        date: doc.data().date,
                        name: doc.data().name,
                        startDate: doc.data().startDate,
                        organizationName: doc.data().organizationName,
                        meetingName: doc.data().name,
                        qr_info: {
                          _id: doc.id
                        }
                      }
                    ]
                  }
                })
              }))
              resolve()
            }
          )
        })
        if (i == that.state.meetingsRef.length - 1) {
          resolve(true)
        }
      }
    })
  }

  componentDidMount() {
    this.gatherDates().then(
      this.obtainPersonalInfo().then(
        this.obtainEventsAndMeetsRefs().then(
          () => this.obtainEvents().then(
            () => this.obtainMeetings()
          )
        )
      )
    )
  }

  renderDayLabel = (date) => {
    let day = moment(date, 'YYYY-MM-DD h:mm A').format('YYYY-MM-DD')
    let today = moment().format('YYYY-MM-DD')
    let tomorrow = moment().add(1, 'day').format('YYYY-MM-DD')
    let anyOtherDate = moment(date, 'YYYY-MM-DD h:mm A').format('ll')

    if (day == today) {
      return (<View style={{ width: '100%', margin: '2%' }}><Text style={styles.dayLabelText}>Today</Text></View>)
    } else if (day == tomorrow) {
      return (<View style={{ width: '100%', margin: '2%' }}><Text style={styles.dayLabelText}>Tomorrow</Text></View>)
    } else {
      return (<View style={{ width: '100%', margin: '2%' }}><Text style={styles.dayLabelText}>{anyOtherDate}</Text></View>)
    }
  }

  generateEventQR = (item) => {
    if (item.status == 'closed') {
      return (
        <QRCode codeStyle='square' size={120} content={jsonpack.pack(item.qr_info)} />
      );
    } else {
      return (
        <QRCode codeStyle='square' size={120} />
      );
    }
  }

  renderItem = (item, firstItemInDay) => {

    if (item.type == 'event') {
      startTime = moment(item.startDate, 'YYYY-MM-DD h:mm A').format('h:mm A')
      endTime = moment(item.endDate, 'YYYY-MM-DD h:mm A').format('h:mm A')
      return (
        <View>
          {this.renderDayLabel(item.date)}
          <Card style={{ width: '100%', margin: '5%' }}>
            <CardItem header style={[styles.cardHeader, {backgroundColor: (item.privacy == 'public') ? '#5f9ea0': '#ffa500'}]}>
              <Text style={{ color: 'white' }}>{item.eventName}</Text>
              <Right style={{ marginRight: -40 }}>
                <Icon
                  name={(item.privacy == 'public') ? 'globe' : 'briefcase'}
                  type='font-awesome'
                  color='white'
                  size={18}
                />
              </Right>
            </CardItem>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '60%' }}>
                <CardItem>
                  <View style={styles.eventInfoContainer}>
                    <Icon
                      name='group'
                      type='font-awesome'
                      color='#f50'
                      size={18}
                      onPress={() => console.log('time')}
                      style={{}}
                    />
                    <Text style={styles.info}>{item.organizationName}</Text>
                  </View>
                </CardItem>
                <CardItem>
                  <View style={styles.eventInfoContainer}>
                    <Icon
                      name='calendar'
                      type='font-awesome'
                      color='#f50'
                      size={18}
                      onPress={() => console.log('time')}
                      style={{}}
                    />
                    <Text style={styles.info}>{startTime} - {endTime}</Text>
                  </View>
                </CardItem>
                <CardItem>
                  <View style={styles.eventInfoContainer}>
                    <Icon
                      name='building'
                      type='font-awesome'
                      color='#f50'
                      size={18}
                      style={{}}
                      onPress={() => console.log('time')}
                    />
                    <Text style={[styles.info, { marginLeft: '8%' }]}>{item.location}</Text>
                  </View>
                </CardItem>
                <CardItem>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      raised
                      name='envelope'
                      type='font-awesome'
                      color='#f50'
                      size={22}
                      style={{ width: '5%' }}
                      onPress={() => console.log('Invite Friends')}
                    />
                    <Icon
                      raised
                      name='paper-plane'
                      type='font-awesome'
                      color='#f50'
                      size={22}
                      style={{ width: '5%' }}
                      onPress={() => console.log('Donate to a Friend')}
                    />
                    <Icon
                      raised
                      name='times'
                      type='font-awesome'
                      color='#f50'
                      size={22}
                      style={{ width: '5%' }}
                      onPress={() => console.log('Drop the Event')}
                    />
                  </View>
                </CardItem>
              </View>

              <View style={{ justifyContent: 'center' }} >
                <Button onPress={
                  () => this.props.navigation.push('EventTicket',
                    {
                      data: {
                        eventName: item.eventName,
                        eventDescription: item.eventDescription,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        location: item.location,
                        qr_info: item.qr_info
                      }
                    })
                }>
                  {this.generateEventQR(item)}
                </Button>
              </View>
            </View>

          </Card>
        </View>
      )
    } else {
      // it is a meeting //
      return (
        <View>
          {this.renderDayLabel(item.date)}
          <Card style={{ width: '100%', margin: '5%' }}>
            <CardItem header style={[styles.cardHeader, {backgroundColor: '#FF4136'}]}>
              <Text style={{ color: 'white' }}>{item.organizationName}</Text>
              <Right style={{ marginRight: -40 }}>
                <Icon
                  name={'group'}
                  type='font-awesome'
                  color='white'
                  size={18}
                />
              </Right>
            </CardItem>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '60%' }}>
                <CardItem>
                  <View style={styles.eventInfoContainer}>
                    <Icon
                      name='paperclip'
                      type='font-awesome'
                      color='#f50'
                      size={18}
                      onPress={() => console.log('time')}
                      style={{}}
                    />
                    <Text style={styles.info}>{item.meetingName}</Text>
                  </View>
                </CardItem>
                <CardItem>
                  <View style={styles.eventInfoContainer}>
                    <Icon
                      name='calendar'
                      type='font-awesome'
                      color='#f50'
                      size={18}
                      style={{}}
                      onPress={() => console.log('time')}
                    />
                    <Text style={[styles.info, { marginLeft: '8%' }]}>{item.startTime} - {item.endTime}</Text>
                  </View>
                </CardItem>
                <CardItem>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      raised
                      name='envelope'
                      type='font-awesome'
                      color='#f50'
                      size={22}
                      style={{ width: '5%' }}
                      onPress={() => console.log('Message Organization about Meeting')}
                    />
                    <Icon
                      raised
                      name='times'
                      type='font-awesome'
                      color='#f50'
                      size={22}
                      style={{ width: '5%' }}
                      onPress={() => console.log('Confirm that you cannot attend')}
                    />
                  </View>
                </CardItem>
              </View>

              <View style={{ width: '10%', justifyContent: 'center' }} >
                <Button onPress={() => this.props.navigation.push('MeetingTicket',
                  {
                    data: {
                      headline: item.headline,
                      agenda: item.agenda,
                      startTime: item.startTime,
                      endTime: item.endTime,
                      date: item.date,
                      meetingName: item.name,
                      organizationName: item.organizationName,
                    }
                  })}>
                  <QRCode codeStyle='square' size={120} content={jsonpack.pack(item.qr_info)} />
                </Button>
              </View>
            </View>

          </Card>
        </View>
      )
    }
  }

  renderDay = (date, item) => {
    return (<View />)
  }

  renderEmptyDate = (date) => {

    let dateString = moment.utc(date.toString()).format('YYYY-MM-DD')

    return (
      <View>
        {this.renderDayLabel(dateString)}
        <View style={{ width: '100%', margin: '5%' }}>
          <Text onPress={() => this.props.navigation.navigate('Explore')} style={{ fontFamily: 'Avenir', color: '#3ca2c3', fontStyle: 'italic' }}> Tap to Find an Event </Text>
        </View>
      </View>
    )
  }

  renderEmptyData = (date) => {

    console.log(date)

    return (
      <View><Text>Click on Some Shit to Do Lit Shit</Text></View>
    );
  }


  render() {
    return (
      <ScrollView style={styles.container}>
        <Container style={{ paddingBottom: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Icon
              raised
              name='bell'
              type='font-awesome'
              color='#f50'
              size={24}
              onPress={() => console.log('notifications coming soon')}
            />
          </View>
          <Agenda
            // the list of items that have to be displayed in agenda. If you want to render item as empty date
            // the value of date key kas to be an empty array []. If there exists no value for date key it is
            // considered that the date in question is not yet loaded
            items={this.state.treasure}
            // callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={(month) => { console.log('trigger items loading') }}
            // callback that fires when the calendar is opened or closed
            onCalendarToggled={(calendarOpened) => { console.log(calendarOpened) }}
            // callback that gets called on day press
            onDayPress={(day) => { console.log('day pressed') }}
            // callback that gets called when day changes while scrolling agenda list
            onDayChange={(day) => { console.log('day changed') }}
            // initially selected day
            selected={this.currentDate}
            minDate={moment(this.currentDate).format('YYYY-MM-DD')}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={0}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={6}
            // specify how each item should be rendered in agenda
            renderItem={(date, item, firstItemInDay) => this.renderItem(date, item, firstItemInDay)}
            // // specify how each date should be rendered. day can be undefined if the item is not first in that day.
            renderDay={(date, item) => this.renderDay(date, item)}
            // specify how empty date content with no items should be rendered
            renderEmptyDate={(date) => this.renderEmptyDate(date)}
            // specify how agenda knob should look like
            // renderKnob={() => { return (<View />); }}
            // specify what should be rendered instead of ActivityIndicator
            renderEmptyData={(date) => this.renderEmptyData(date)}
            // specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
            // Hide knob button. Default = false
            hideKnob={false}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            markedDates={this.state.markedDates}

            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
            // onRefresh={() => console.log('refreshing...')}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
            refreshControl={null}
            // agenda theme
            theme={{
              agendaDayTextColor: 'yellow',
              agendaDayNumColor: 'green',
              agendaTodayColor: 'red',
              agendaKnobColor: '#C0C0C0',
              backgroundColor: 'white',
              calendarBackground: '#ffffff',
            }}
            style={{ height: 400, backgroundColor: 'white' }}
          />
        </Container>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  dayLabelText: {
    fontFamily: 'Avenir',
    fontSize: 16
  },
  cardHeader: {
    marginBottom: 5,
    width: '100%',
    flexDirection: 'row'
  },
  eventInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  info: {
    marginLeft: '5%',
    fontFamily: 'Avenir',
    fontSize: 18,
  }

});