import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { Container, Item, Input, Form, Icon, Button, Textarea } from 'native-base'
import DatePicker from 'react-native-datepicker'

import moment from 'moment'
import firebase from 'react-native-firebase';

export default class EditMeetings extends React.Component {

    static navigationOptions = {
        title: 'Revise Meeting',
    };

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;
        this.meetsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meets')

        this.state = {
            agenda: '',
            date: '',
            endTime: '',
            headline: '',
            startTime: '',
            currentDate: moment(),
        }

        this.meeting = this.props.navigation.getParam('meeting', 'NO-ID');

    }

    componentDidMount() {
        console.log(this.meeting)
        this.setState({
            agenda: this.meeting.agenda,
            date: this.meeting.date,
            endTime: this.meeting.endTime,
            headline: this.meeting.headline,
            startTime: this.meeting.startTime,
        })
    }

    submitButton = () => {
        this.meetsRef.doc(this.meeting.documentID).update({
            agenda: this.state.agenda,
            date: this.state.date,
            endTime: this.state.endTime,
            headline: this.state.headline,
            startTime: this.state.startTime,
        }).then(() => this.props.navigation.pop())
    }


    render() {
        return (
            <Container>
                <Form style={styles.formContainer}>

                    <Item>
                        <Icon active ios='ios-planet' android="md-planet" style={styles.icon} />
                        <Input
                            style={styles.input}
                            placeholder='Meeting Headline'
                            value={this.state.headline}
                            placeholderTextColor='#C0C0C0'
                            onChangeText={headline => this.setState({ headline })}
                        />
                    </Item>

                    <Item>
                        <Textarea
                            rowSpan={5}
                            placeholder="Agenda: Enter something informative. "
                            style={styles.input} placeholderTextColor='#C0C0C0'
                            value={this.state.agenda}
                            onChangeText={agenda => this.setState({ agenda })}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.date}
                            mode="date"
                            placeholder="Starting Time"
                            format='YYYY-MM-DD'
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
                                }
                            }}
                            onDateChange={date => { this.setState({ date }) }}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.startTime}
                            mode="time"
                            placeholder="Starting Time"
                            format='LT'
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
                                }
                            }}
                            onDateChange={startTime => { this.setState({ startTime }) }}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.endTime}
                            mode="time"
                            placeholder="Ending Time"
                            format='LT'
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
                                }
                            }}
                            onDateChange={endTime => { this.setState({ endTime }) }}
                        />
                    </Item>

                </Form>

                <Button full light style={{ backgroundColor: '#FF4136' }} onPress={this.submitButton}>
                    <Text style={{ color: 'white', fontFamily: 'Avenir' }}> Revise Meeting </Text>
                </Button>

            </Container >
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