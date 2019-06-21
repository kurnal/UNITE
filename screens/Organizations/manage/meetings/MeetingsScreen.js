import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements'
import { Tab, Tabs, TabHeading } from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import MeetingsCreationScreen from './MeetingsCreationScreen';

import update from 'immutability-helper'
import moment, { updateLocale } from 'moment'
import firebase from 'react-native-firebase';

export default class MeetingsScreen extends React.Component {

  static navigationOptions = {
    title: 'Manage',
  };

  constructor() {
    super();

    this.ref = firebase.firestore().collection('Users')
    this.current = firebase.auth().currentUser;
    this.meetsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meets')

    this.state = {
      currentDate: new Date(moment()),
      markedDates: {},
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      agendaItems: {}
    };

  }

  componentDidMount() {
    this.meetsRef.get().then(querySnapshot => {

      if (querySnapshot.empty) {
        return;
      }

      // querySnapshot.forEach(doc => {

      //   this.setState({
      //     agendaItems: update(this.state.agendaItems, {
      //       $push: {
      //         [doc.data().date]: {
      //           name: doc.data().name,
      //           headline: doc.data().headline,
      //           agenda: doc.data().agenda,
      //         } 
      //       }
      //     })
      //   })

      // });

    })
  }


  renderDay = (date, item) => {
    console.log(date)
    if (typeof date !== "undefined") {
      return (
        <View style={styles.agendaRenderDayContainer}>
          <Text style={styles.agendaDay}> {date.day} </Text>
          <Text style={styles.agendaDayName}> {this.state.days[new Date(date.dateString).getDay()]} </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyRenderDayContainer}>

        </View>
      );
    }

  }

  renderItem = (item, firstItemInDay) => {

    return (
      <View>
        <Text> {item.text} </Text>
      </View>
    )
  }


  render() {
    return (

      <ScrollView style={styles.container}>

        <View style={{ paddingBottom: 5 }}>

          <Agenda
            // the list of items that have to be displayed in agenda. If you want to render item as empty date
            // the value of date key kas to be an empty array []. If there exists no value for date key it is
            // considered that the date in question is not yet loaded
            items={{
              '2019-06-16': [{ text: 'item 1 - any js object' }],
              '2019-06-19': [{ text: 'item 3 - any js object' }, { text: 'any js object' }]
            }}
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
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // specify how each item should be rendered in agenda
            renderItem={(item, firstItemInDay) => this.renderItem(item, firstItemInDay)}
            // // specify how each date should be rendered. day can be undefined if the item is not first in that day.
            renderDay={(date, item) => this.renderDay(date, item)}
            // specify how empty date content with no items should be rendered
            // renderEmptyDate={() => { return (<View />); }}
            // specify how agenda knob should look like
            // renderKnob={() => { return (<View />); }}
            // specify what should be rendered instead of ActivityIndicator
            renderEmptyData={() => { return (<View><Text>Click on Some Shit to Do Lit Shit</Text></View>); }}
            // specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
            // Hide knob button. Default = false
            hideKnob={false}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            markedDates={{
              '2019-06-16': { selected: true, marked: true },
              '2019-06-19': { marked: true },
            }}
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
              agendaKnobColor: 'blue'
            }}
            // agenda container style
            style={{ height: 400, backgroundColor: 'white' }}
          />
        </View>
        <Tabs>
          <Tab
            heading={
              <TabHeading style={[styles.tabs, { borderLeftWidth: 1 }]}>
                <Icon
                  name='filter'
                  type='font-awesome'
                  color='#f50'
                />
              </TabHeading>
            }>
            <MeetingsCreationScreen />
          </Tab>
          <Tab
            heading={
              <TabHeading style={[styles.tabs, { borderRightWidth: 1 }]}>
                <Icon
                  name='clipboard'
                  type='font-awesome'
                  color='#f50'
                />
              </TabHeading>
            }>
            <Text> Bye Bye </Text>
          </Tab>
        </Tabs>
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
  agendaRenderDayContainer: {
    borderTopColor: '#C0C0C0',
    borderTopWidth: 1,
    padding: 10,
    width: '25%',
    height: 100,

  },
  emptyRenderDayContainer: {
    width: '25%',
    height: 50,
  },
  agendaDay: {
    fontFamily: 'Avenir',
    fontSize: 36,
    textAlign: 'center'
  },
  agendaDayName: {
    fontFamily: 'Avenir',
    fontSize: 18,
    textAlign: 'center',
  },
  tabs: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#C0C0C0',
  }
});