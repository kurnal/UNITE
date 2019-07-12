import React from 'react';
import { ScrollView, StyleSheet, Text, View, Butto, RefreshControl } from 'react-native';
import { Icon, withTheme } from 'react-native-elements'
import { Tab, Tabs, TabHeading } from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import MeetingsCreationScreen from './MeetingsCreationScreen';
import AgendaMeetingDash from './AgendaMeetingsDash'

import update from 'immutability-helper'
import moment, { updateLocale } from 'moment'
import firebase from 'react-native-firebase';


export default class MeetingsScreen extends React.Component {

  static navigationOptions = {
    title: 'Meetings'
  };

  constructor() {
    super();

    this.ref = firebase.firestore().collection('Users')
    this.current = firebase.auth().currentUser;
    this.meetsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meets')

    this.state = {
      currentDate: moment(),
      startOfLastMonth: moment().subtract(1, 'months').startOf('month'),
      sixMonthsFromNow: moment().add(6, 'months'),
      markedDates: {},
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      agendaItemsJSON: {},
      refreshing: false
    };

  }

  componentDidMount() {
    this.gatherDates().then(() => this.obtainAgendaItems()).then(() => console.log(this.state.agendaItemsJSON))
  }

  _onRefresh = () => {

    this.setState({ refreshing: false })

  }

  obtainAgendaItems = () => {
    return Promise.resolve(
      this.meetsRef.get().then(querySnapshot => {

        if (querySnapshot.empty) {
          return;
        }

        querySnapshot.forEach(doc => {
          
          this.setState(prevState => ({
            markedDates: { ...prevState.markedDates, [doc.data().date]: { marked: true } },
            agendaItemsJSON: update(this.state.agendaItemsJSON, {
              [doc.data().date]: {
                $push: [
                  ...prevState.agendaItemsJSON[doc.data().date],
                  {
                    documentID: doc.id,
                    name: doc.data().name,
                    headline: doc.data().headline,
                    agenda: doc.data().agenda,
                    date: doc.data().date,
                    startTime: doc.data().startTime,
                    endTime: doc.data().endTime,
                  }
                ]
              }
            })
          }))

        })
      })
    )
  }

  gatherDates = () => {

    let date = this.state.startOfLastMonth
    let sixMonths = this.state.sixMonthsFromNow
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
      promise.then(() => this.setState({ agendaItemsJSON: holder }))
    )

  }


  renderDay = (date, item) => {

    if (typeof date !== "undefined") {
      return (
        <View style={styles.agendaRenderDayContainer}>
          <Text style={styles.agendaDay}> {date.day} </Text>
          <Text style={styles.agendaDayName}> {this.state.days[new Date(date.dateString).getDay()]} </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyRenderDayContainer}> </View>
      );
    }

  }

  renderItem = (item, firstItemInDay) => {
    return (
      <AgendaMeetingDash navigation={this.props.navigation} meeting={item} />
    )
  }

  renderEmptyDate = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 50 }}>
        <Text style={{ fontFamily: 'Avenir' }}> No Meetings Planned </Text>
      </View>
    )
  }

  render() {
    return (

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>

        <View style={styles.meetingsFormButton}>
          <Icon
            raised
            name='thumb-tack'
            type='font-awesome'
            color='#f50'
            onPress={() => { this.props.navigation.push('MeetingsCreation') }}
          />
        </View>



        <View style={{ paddingBottom: 5 }}>

          <Agenda
            // the list of items that have to be displayed in agenda. If you want to render item as empty date
            // the value of date key kas to be an empty array []. If there exists no value for date key it is
            // considered that the date in question is not yet loaded
            items={this.state.agendaItemsJSON}
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
            pastScrollRange={1}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={6}
            // specify how each item should be rendered in agenda
            renderItem={(item, firstItemInDay) => this.renderItem(item, firstItemInDay)}
            // // specify how each date should be rendered. day can be undefined if the item is not first in that day.
            renderDay={(date, item) => this.renderDay(date, item)}
            // specify how empty date content with no items should be rendered
            renderEmptyDate={() => this.renderEmptyDate()}
            // specify how agenda knob should look like
            // renderKnob={() => { return (<View />); }}
            // specify what should be rendered instead of ActivityIndicator
            renderEmptyData={() => { return (<View><Text>Click on Some Shit to Do Lit Shit</Text></View>); }}
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
              agendaKnobColor: '#C0C0C0'
            }}
            // agenda container style
            style={{ height: 400, backgroundColor: 'white' }}
          />
        </View>

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
  meetingsFormButton: {
    alignItems: 'flex-end'
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
    fontFamily: 'Futura',
    fontSize: 36,
    textAlign: 'center',
    color: '#C0C0C0'
  },
  agendaDayName: {
    fontFamily: 'Futura',
    fontSize: 24,
    textAlign: 'center',
    color: '#C0C0C0'
  },
  tabs: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#C0C0C0',
  }
});