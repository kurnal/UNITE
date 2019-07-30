import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { Picker, Item, Input, Form, Icon, Button, Header, Left, Right, Body, Title } from 'native-base'
import DatePicker from 'react-native-datepicker'

import moment from 'moment'
import firebase from 'react-native-firebase';


export default class WeeklyMeetingForm extends React.Component {

    static navigationOptions = {};
    constructor() {
        super();

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;
        this.meetingsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meetings')

        this.state = {
            meetingDay: '',
            meetingStartTime: '',
            meetingEndTime: '',
            meetingName: '',
            organizationName: '',
            currentDate: moment(),           
            isEditing: false,
        }
    }

    componentDidMount() {
        this.ref.doc(this.current.uid).get( doc => {
            this.setState({
                organizationName: doc.data().title
            })
        })
    } 

    postMeetings = (meeting) => {

        this.meetingsRef.doc(meeting.id).get()
            .then(doc => {

                let date = moment();
                let twoMonthsFromNow = moment().month() + 3;
                let meetingDay = doc.data().meetingDay;
                let meetingName = doc.data().meetingName;

                let meetingStartTime = doc.data().meetingStartTime
                let meetingEndTime = doc.data().meetingEndTime

                let batch = firebase.firestore().batch();
                let meetsRef = this.ref.doc(this.current.uid).collection('Meets')

                let _organizationName = this.state.organizationName

                while (date.day() != meetingDay) {
                    date = date.add(1, 'day')
                }

                while ((date.month() + 1) < twoMonthsFromNow) {

                    _startDate = moment(date.toString() + ' ' + meetingStartTime.toString(), 'LLLL')

                    batch.set(meetsRef.doc(), {
                        name: meetingName,
                        date: date.format('YYYY-MM-DD'),
                        startTime: meetingStartTime,
                        startDate: _startDate.format('YYYY-MM-DD hh:mm'),
                        endTime: meetingEndTime,
                        headline: '',
                        agenda: '',
                        organizationName: _organizationName
                    });
                    date = date.add(7, 'day');
                }

                batch.commit().then(() => this.setState({
                    meetingDay: '',
                    meetingStartTime: '',
                    meetingEndTime: '',
                    meetingName: '',
                }))
            })

    }


    postMeetingSetting = () => {
        return Promise.resolve(
            this.meetingsRef.add({
                meetingRate: 'weekly',
                meetingDay: this.state.meetingDay,
                meetingStartTime: this.state.meetingStartTime,
                meetingEndTime: this.state.meetingEndTime,
                meetingName: this.state.meetingName,
            }).then(meeting => this.postMeetings(meeting))
        )
    }

    submitButton = () => {
        this.postMeetingSetting().then(() => this.setState({ modalVisible: false }));
    }

    render() {
        return (
                <View style={styles.container}>
                    <Item style={{ flexDirection: 'row' }}>
                        <Icon active name="clipboard" style={[styles.icon, { flex: 1 }]} />
                        <Item picker style={{ borderBottomWidth: 0, flex: 20 }}>
                            <Picker
                                mode="dropdown"
                                placeholder="What day will these meetings occur"
                                placeholderStyle={{ color: '#C0C0C0', fontFamily: 'Avenir' }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.meetingDay}
                                onValueChange={(meetingDay) => this.setState({ meetingDay })}
                            >
                                <Picker.Item label="Sunday" value='0' />
                                <Picker.Item label="Monday" value='1' />
                                <Picker.Item label="Tuesday" value='2' />
                                <Picker.Item label="Wednesday" value='3' />
                                <Picker.Item label="Thursday" value='5' />
                                <Picker.Item label="Friday" value='5' />
                                <Picker.Item label="Saturday" value='6' />
                            </Picker>
                        </Item>
                        <Icon name="arrow-down" style={{ flex: 1 }} />
                    </Item>

                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.meetingStartTime}
                            mode={"time"}
                            placeholder="What time will the meeting start?"
                            format={"LT"}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    width: 0,
                                    height: 0
                                },
                                dateInput: {
                                    fontFamily: 'Avenir',
                                    backgroundColor: 'white',
                                    borderWidth: 0,
                                    alignItems: 'flex-start'
                                },
                                dateText: {
                                    color: 'black',
                                    textAlign: 'left',
                                    fontSize: 16
                                },
                                placeholderText: {
                                    fontSize: 16,
                                    color: '#C0C0C0',
                                },
                                disabled: {
                                    backgroundColor: 'white'
                                }
                            }}
                            onDateChange={meetingStartTime => { this.setState({ meetingStartTime }) }}
                        />
                    </Item>
                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.meetingEndTime}
                            mode={"time"}
                            placeholder="What time will the meeting end?"
                            format={"LT"}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    width: 0,
                                    height: 0
                                },
                                dateInput: {
                                    fontFamily: 'Avenir',
                                    backgroundColor: 'white',
                                    borderWidth: 0,
                                    alignItems: 'flex-start'
                                },
                                dateText: {
                                    color: 'black',
                                    textAlign: 'left',
                                    fontSize: 16
                                },
                                placeholderText: {
                                    fontSize: 16,
                                    color: '#C0C0C0',
                                },
                                disabled: {
                                    backgroundColor: 'white'
                                }
                            }}
                            onDateChange={meetingEndTime => { this.setState({ meetingEndTime }) }}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-arrow-dropright-circle' android="md-arrow-dropright-circle" style={styles.icon} />
                        <Input
                            placeholder='Meeting Name (Ex: General Body Meeting) '
                            placeholderTextColor='#C0C0C0'
                            onChangeText={meetingName => this.setState({ meetingName })}
                        />
                    </Item>

                    <Button full light style={{ backgroundColor: '#FF4136' }} onPress={this.submitButton}>
                        <Text style={{ color: 'white', fontFamily: 'Avenir' }}> Create Meeting </Text>
                    </Button>
                </View>
  
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    formContainer: {
        marginTop: 10,
        marginLeft: -10,
    },
    helpButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    item: {
        borderColor: 'black'
    },
    input: {
        fontFamily: 'Avenir',
    },
    icon: {
        color: '#FF4136'
    },
});