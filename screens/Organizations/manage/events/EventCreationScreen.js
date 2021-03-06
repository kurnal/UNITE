import React from 'react';
import { StyleSheet, View, TouchableHighlight, Text, StatusBar } from 'react-native';

var NativeElementIcon = require('react-native-elements/src/icons/Icon.js')
import DatePicker from 'react-native-datepicker'

import { Container, Picker, Item, Input, Textarea, Form, Icon, Button, Header, Title, Left, Body, Right } from 'native-base'

import moment from 'moment'
import firebase from 'react-native-firebase';

export default class EventCreationScreen extends React.Component {

    static navigationOptions = {
        title: 'Create Event',
    };

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;

        this.state = {
            eventName: '',
            eventDescription: '',
            startDate: '',
            endDate: '',
            location: '',
            capacity: '',
            privacy: '',
            status: '',
            organizationName: '',
            minDate: new Date(new Date(moment().add(1, 'days')).setHours(24, 0, 0, 0)),
            maxDate: new Date(new Date(moment().add(3, 'month')).setHours(0, 0, 0, 0)),
            oldEventName: '',
            isEditing: false
        };

        this.itemID = this.props.navigation.getParam('documentID', 'NO-ID');
    }

    componentDidMount() {
        if (this.itemID !== 'NO-ID') {
            this.ref.doc(this.current.uid).collection('Events').doc(this.itemID).get().then(
                doc => {
                    this.setState({
                        eventName: doc.data().eventName,
                        oldEventName: doc.data().eventName,
                        eventDescription: doc.data().eventDescription,
                        startDate: moment(doc.data().startDate, 'YYYY-MM-DD hh:mm A').format('LLLL'),
                        endDate: moment(doc.data().endDate, 'YYYY-MM-DD hh:mm A').format('LLLL'),
                        location: doc.data().location,
                        capacity: doc.data().capacity,
                        privacy: doc.data().privacy,
                        status: doc.data().status,
                        isEditing: true
                    })
                }
            )
        }

        this.ref.doc(this.current.uid).get().then(doc => {
            this.setState({
                organizationName: doc.data().title
            })
        }) 

    }

    setEventPrivacy(value) {

        this.setState({
            privacy: value
        })

        if (value === 'private') {
            this.setState({
                status: 'closed',
                capacity: 'unlimited'
            })
        }

        if (value === 'private' && this.state.status === 'closed') {
            this.setState({
                capacity: ''
            })
        }

    }

    setEventStatus = (value) => {
        this.setState({
            status: value
        })

        if (value === 'open') {
            this.setState({
                capacity: 'unlimited'
            })
        }

        if (value === 'closed' && this.state.privacy === 'public') {
            this.setState({
                capacity: ''
            })
        }

    }

    updateEvent = () => {

        let batch = firebase.firestore().batch();

        let orgRef = this.ref.doc(this.current.uid).collection('Events').doc(this.itemID);
        
        batch.update(orgRef, {
            eventName: this.state.eventName,
            eventDescription: this.state.eventDescription,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            location: this.state.location,
            capacity: this.state.capacity,
            privacy: this.state.privacy,
            status: this.state.status,
            happened: false,
            organizationName: this.state.organizationName,
            attending: 0
        }, { merge: true });

        let eventsRef = firebase.firestore().collection('All Events').doc()
        batch.update(eventsRef, {
            eventName: this.state.eventName,
            eventDescription: this.state.eventDescription,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            location: this.state.location,
            capacity: this.state.capacity,
            privacy: this.state.privacy,
            status: this.state.status,
            organizationName: this.state.organizationName,
            happened: false,
            attending: 0
        }, { merge: true });

        batch.commit().then(() => this.props.navigation.pop())
    }

    postEvent = () => {

        let batch = firebase.firestore().batch();
        let orgRef = this.ref.doc(this.current.uid).collection('Events').doc();

        batch.set(orgRef, {
            eventName: this.state.eventName,
            eventDescription: this.state.eventDescription,
            startDate: moment(this.state.startDate, 'LLLL').format('YYYY-MM-DD hh:mm A'),
            endDate: moment(this.state.endDate, 'LLLL').format('YYYY-MM-DD hh:mm A'),
            date: moment(this.state.startDate, 'LLLL').format('YYYY-MM-DD'),
            location: this.state.location,
            capacity: this.state.capacity,
            privacy: this.state.privacy,
            status: this.state.status,
            happened: false,
            attending: 0
        }, { merge: true });

        let sameRef = orgRef._documentPath._parts[3]
        let eventsRef = firebase.firestore().collection('All Events').doc(sameRef)
        batch.set(eventsRef, {
            eventName: this.state.eventName,
            eventDescription: this.state.eventDescription,
            startDate: moment(this.state.startDate, 'LLLL').format('YYYY-MM-DD hh:mm A'),
            endDate: moment(this.state.endDate, 'LLLL').format('YYYY-MM-DD hh:mm A'),
            date: moment(this.state.startDate, 'LLLL').format('YYYY-MM-DD'),
            location: this.state.location,
            capacity: this.state.capacity,
            privacy: this.state.privacy,
            status: this.state.status,
            happened: false,
            attending: 0
        }, { merge: true });

        batch.commit().then(() => this.props.navigation.pop())
    }

    submitButton = () => {
        if(this.state.isEditing) {
            this.updateEvent();
        } else {
            this.postEvent();
        }
    }

    render() {
        return (

            <Container style={styles.container}>
                <View style={styles.helpButtonContainer}>
                    <Text style={{ fontFamily: 'Avenir', flex: 1, marginLeft: 10 }}> Enter the information below.  </Text>
                    <NativeElementIcon.Icon
                        raised
                        name='flag'
                        type='font-awesome'
                        color='#f50'
                        size={24}
                        style={{ flex: 1 }}
                        onPress={() => console.log('help coming soon')}
                    />
                </View>

                <Form style={styles.formContainer}>
                    <Item style={{ flexDirection: 'row' }}>
                        <Icon active name="clipboard" style={[styles.icon, { flex: 1 }]} />
                        <Item picker style={{ borderBottomWidth: 0, flex: 20 }}>
                            <Picker
                                mode="dropdown"
                                placeholder="Select your Event Privacy"
                                placeholderStyle={{ color: '#C0C0C0', fontFamily: 'Avenir' }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.privacy}
                                onValueChange={this.setEventPrivacy.bind(this)}
                            >
                                <Picker.Item label="Public" value="public" />
                                <Picker.Item label="Private" value="private" />
                            </Picker>
                        </Item>
                        <Icon name="arrow-down" style={{ flex: 1 }} />
                    </Item>

                    <Item style={{ flexDirection: 'row' }}>
                        <Icon active ios='ios-key' android="md-key" style={[styles.icon, { flex: 1 }]} />
                        <Item picker style={{ borderBottomWidth: 0, flex: 20 }}>
                            <Picker
                                mode="dropdown"
                                enabled={(this.state.privacy === 'public') ? true : false}
                                placeholder="Select your Event Status"
                                placeholderStyle={{ color: '#C0C0C0', fontFamily: 'Avenir' }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.status}
                                onValueChange={this.setEventStatus.bind(this)}
                            >
                                <Picker.Item label="Open" value="open" />
                                <Picker.Item label="Closed" value="closed" />
                            </Picker>
                        </Item>
                        <Icon name="arrow-down" style={{ flex: 1 }} />
                    </Item>

                    <Item>
                        <Icon active ios='ios-planet' android="md-planet" style={styles.icon} />
                        <Input
                            style={styles.input}
                            placeholder='Event Title'
                            value={this.state.eventName}
                            placeholderTextColor='#C0C0C0'
                            onChangeText={eventName => this.setState({ eventName })}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-arrow-dropright-circle' android="md-arrow-dropright-circle" style={styles.icon} />
                        <Input
                            placeholder='Partners: Will use Tags package soon'
                            placeholderTextColor='#C0C0C0'
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-person' android="md-person" style={styles.icon} />
                        <Input
                            style={styles.input}
                            placeholder='Capacity'
                            disabled={(this.state.status === 'open' || this.state.privacy === 'private') ? true : false}
                            value={this.state.capacity}
                            keyboardType='numeric'
                            placeholderTextColor='#C0C0C0'
                            onChangeText={capacity => this.setState({ capacity })}
                        />
                        <Icon active ios='ios-paper-plane' android="md-paper-plane" style={styles.icon} />
                        <Input
                            style={styles.input}
                            placeholder='Location'
                            value={this.state.location}
                            placeholderTextColor='#C0C0C0'
                            onChangeText={location => this.setState({ location })}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.startDate}
                            mode="datetime"
                            placeholder="Starting Time"
                            format='LLLL'
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
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
                            onDateChange={startDate => { this.setState({ startDate }) }}
                        />
                    </Item>

                    <Item>
                        <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
                        <DatePicker
                            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
                            date={this.state.endDate}
                            mode="datetime"
                            placeholder="Ending Time"
                            format='LLLL'
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
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
                                    fontSize: 16
                                },
                                placeholderText: {
                                    fontSize: 16,
                                    color: '#C0C0C0',
                                }
                            }}
                            onDateChange={endDate => { this.setState({ endDate }) }}
                        />
                    </Item>

                    <Item>
                        <Textarea
                            rowSpan={5}
                            placeholder="Description: Enter something informative and fun to impress your fellow students"
                            style={styles.input} placeholderTextColor='#C0C0C0'
                            value={this.state.eventDescription}
                            onChangeText={eventDescription => this.setState({ eventDescription })}
                        />
                    </Item>
                </Form>

                <Button full light style={{ backgroundColor: '#FF4136' }} onPress={this.submitButton}>
                    <Text style={{ color: 'white', fontFamily: 'Avenir' }}> {(this.state.isEditing) ? 'Revise Event' : 'Post Event'} </Text>
                </Button>

            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    formContainer: {
        marginBottom: 5
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
        padding: 5,
    },
    icon: {
        color: '#FF4136'
    },
});

