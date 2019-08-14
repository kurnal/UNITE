import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button, RefreshControl } from 'react-native';
import { Icon, withTheme } from 'react-native-elements'
import { Container } from 'native-base';
import { Agenda } from 'react-native-calendars';

import MeetingScreen from './MeetingsScreen'
import EventScreen from './EventsScreen'

import update from 'immutability-helper'
import moment, { updateLocale } from 'moment'
import firebase from 'react-native-firebase';


export default class MeetingsScreen extends React.Component {

    static navigationOptions = {
        title: ''
    };

    constructor() {
        super();

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;
        this.userRef = firebase.firestore().collection('Users').doc(this.current.uid)

        this.state = {
            currentDate: moment(),
            startOfLastMonth: moment().subtract(1, 'months').startOf('month'),
            markedDates: {},
            items: {},
            refreshing: false
        };
    }

    componentDidMount() {
        this.gatherDates().then(
            () => this.gatherEvents().then(
                () => this.gatherMeetings()
            )
        )
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
            promise.then(() => this.setState({ items: holder }))
        )

    }

    gatherEvents = () => {
        return new Promise.resolve(
            this.userRef.collection('Events').get().then(
                snapshot => {
                    snapshot.forEach(doc => {
                        let date = moment(doc.data().date).format('YYYY-MM-DD')
                        let today = moment().format('YYYY-MM-DD')
                        if (moment(date).isAfter(moment(today))) {
                            this.setState(prevState => ({
                                markedDates: { ...prevState.markedDates, [doc.data().date]: { marked: true, dotColor: '#ffa500' } },
                                items: update(this.state.items, {
                                    [doc.data().date]: {
                                        ...prevState.items[doc.data().date],
                                        $push: [
                                            {
                                                type: 'event',
                                                _id: doc.id,
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
                                            }
                                        ]
                                    }
                                })
                            }))
                        } else {
                            this.moveEventToPast(doc.data(), doc.id);
                        }
                    });
                }
            )
        )
    }

    moveEventToPast = (event, eventID) => {

        let batch = firebase.firestore().batch();
        let eventRef = this.userRef.collection('Events').doc(eventID)
        let pastEventsRef = this.userRef.collection('Past Events').doc();

        return new Promise(function (resolve, reject) {
            batch.delete(eventRef)
            batch.set(pastEventsRef, event)
            batch.commit().then(resolve())
        });

    }

    gatherMeetings = () => {

        return new Promise.resolve(
            this.userRef.collection('Meets').get().then(
                snapshot => {
                    snapshot.forEach(doc => {
                        let date = moment(doc.data().date).format('YYYY-MM-DD')
                        let today = moment().format('YYYY-MM-DD')
                        if (moment(date).isAfter(moment(today))) {
                            this.setState(prevState => ({
                                markedDates: { ...prevState.markedDates, [doc.data().date]: { marked: true, dotColor: '#5f9ea0' } },
                                items: update(this.state.items, {
                                    [doc.data().date]: {
                                        ...prevState.items[doc.data().date],
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
                                            }
                                        ]
                                    }
                                })
                            }))
                        } else {
                            this.moveMeetingToPast(doc.data(), doc.id)
                        }
                    })
                }
            )
        )
    }

    moveMeetingToPast = (meeting, meetingID) => {

        let batch = firebase.firestore().batch();
        let meetingRef = this.userRef.collection('Meets').doc(meetingID)
        let pastMeetingsRef = this.userRef.collection('Past Meets').doc();

        return new Promise(function (resolve, reject) {
            batch.delete(meetingRef)
            batch.set(pastMeetingsRef, meeting)
            batch.commit().then(resolve())
        });

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

    renderItem = (item, firstItemInDay) => {

        if (item.type == 'meeting') {
            return (
                <View>
                    {this.renderDayLabel(item.date)}
                    <MeetingScreen navigation={this.props.navigation} meeting={item} />
                </View>

            )
        } else {
            return (
                <View>
                    {this.renderDayLabel(item.date)}
                    <EventScreen navigation={this.props.navigation} event={item} />
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
                    <Text onPress={() => this.props.navigation.navigate('Event')} style={{ fontFamily: 'Avenir', color: '#3ca2c3', fontStyle: 'italic' }}> Plan an Event </Text>
                </View>
            </View>
        )
    }

    renderEmptyData = (date) => {
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
                        name='magic'
                        type='font-awesome'
                        color='#f50'
                        size={24}
                        onPress={() => this.props.navigation.push('EventCreation')}
                    />
                    <Icon
                        raised
                        name='users'
                        type='font-awesome'
                        color='#f50'
                        size={24}
                        onPress={() => this.props.navigation.push('MeetingCreation')}
                    />
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
                    items={this.state.items}
                    // callback that gets called when items for a certain month should be loaded (month became visible)
                    loadItemsForMonth={(month) => { console.log('') }}
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
