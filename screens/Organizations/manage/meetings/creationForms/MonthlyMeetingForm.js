import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { Picker, Item, Input, Form, Icon, Button } from 'native-base'
import DatePicker from 'react-native-datepicker'

import moment from 'moment'
import firebase from 'react-native-firebase';


export default class MonthlyMeetingForm extends React.Component {


    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;
        this.meetingsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meetings')

        this.state = {
            meetingDay: '',
            meetingStartTime: '',
            meetingEndTime: '',
            meetingName: '',
            currentDate: moment(),
        }

    }

    componentDidMount() {
        console.log(this.itemID);
    }


    addRealMonth = (d) => {
        let fm = moment(d).add(1, 'M');
        let fmEnd = moment(fm).endOf('month');
        return d.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm;
    }

    postMeetings = (meeting) => {

        this.meetingsRef.doc(meeting.id).get()
            .then(doc => {

                let twoMonthsFromNow = moment().month() + 3;
                let meetingDay = moment(doc.data().meetingDay, 'YYYY-MM-DD');
                let meetingName = doc.data().meetingName;
                let meetingStartTime = doc.data().meetingStartTime
                let meetingEndTime = doc.data().meetingEndTime

                let batch = firebase.firestore().batch();
                let meetsRef = this.ref.doc(this.current.uid).collection('Meets')

                while ((meetingDay.month() + 1) < twoMonthsFromNow) {
                    batch.set(meetsRef.doc(), {
                        name: meetingName,
                        date: meetingDay.format('YYYY-MM-DD'),
                        startTime: meetingStartTime,
                        endTime: meetingEndTime,
                        headline: '',
                        agenda: ''
                    });
                    meetingDay = this.addRealMonth(meetingDay);
                }

                batch.commit().then(() => this.setState({
                    meetingRate: '',
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
                meetingRate: 'monthly',
                meetingDay: this.state.meetingDay,
                meetingStartTime: this.state.meetingStartTime,
                meetingEndTime: this.state.meetingEndTime,
                meetingName: this.state.meetingName,
            }).then(meeting => this.postMeetings(meeting))
        );
    }

    submitButton = () => {
        this.postMeetingSetting();
    }

    submitButton = () => {
        this.postMeetingSetting().then(() => this.setState({ modalVisible: false }));
    }

    render() {
        return (

            <View style={styles.container}>

                <Item>
                    <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                    <DatePicker
                        style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                        date={this.state.meetingDay}
                        mode={"date"}
                        placeholder="What day of the month will this meeting occur?"
                        format={"YYYY-MM-DD"}
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
                        onDateChange={meetingDay => { this.setState({ meetingDay }) }}
                    />
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
        padding: 5
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