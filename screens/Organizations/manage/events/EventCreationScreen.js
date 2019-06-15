import React from 'react';
// import { ScrollView, View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
// import { ImagePicker } from 'react-native-image-picker'

var NativeElementIcon = require('react-native-elements/src/icons/Icon.js')
import DatePicker from 'react-native-datepicker'
import { SegmentedControls } from 'react-native-radio-buttons'

import { Container, Header, Content, Picker, Item, Input, Textarea, Form, Icon, Button } from 'native-base'

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

            minDate: new Date (new Date(moment().add(1, 'days')).setHours(24,0,0,0)),
            maxDate: new Date(new Date(moment().add(3, 'month')).setHours(0,0,0,0)),
            oldEventName: '',
            isEditing: false
        };

        this.itemID = this.props.navigation.getParam('eventName', 'NO-ID');
    }

    componentDidMount() {

        if (this.itemID !== 'NO-ID') {
            this.ref.doc(this.current.uid).collection('Events').doc(this.itemID).get().then(
                doc => {
                    this.setState({
                        eventName: doc.id,
                        oldEventName: doc.id,
                        eventDescription: doc.data().eventDescription,
                        startDate: doc.data().startDate,
                        endDate: doc.data().endDate,
                        location: doc.data().location,
                        capacity: doc.data().capacity,
                        privacy: doc.data().privacy,
                        status: doc.data().status,
                        isEditing: true
                    })
                }
            )
        }
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

    postEvent = () => {
        this.ref.doc(this.current.uid).collection('Events').doc(this.state.eventName).set({
            eventDescription: this.state.eventDescription,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            location: this.state.location,
            capacity: this.state.capacity,
            privacy: this.state.privacy,
            status: this.state.status,
            qr_encode: this.current.uid + " " + this.state.eventName,
            happened: false,
            attending: 0
        }, { merge: true }).then(() => this.props.navigation.pop())
    }

    submitButton = () => {

        if (this.state.isEditing && this.state.oldEventName !== this.state.eventName) {
                this.ref.doc(this.current.uid).collection('Events').doc(this.state.oldEventName).delete()
                    .then(this.postEvent())
        } else {
            this.postEvent()
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
                            style={{ flex: 1, padding: 5, paddingLeft: 0 }}
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

