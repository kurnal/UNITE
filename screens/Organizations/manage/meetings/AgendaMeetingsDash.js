import React from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';
import { Icon } from 'react-native-elements'

import {View, Card, CardItem, Text, Body } from 'native-base'

import moment, { updateLocale } from 'moment'
import firebase from 'react-native-firebase';


export default class AgendaMeetingsDash extends React.Component {

    static navigationOptions = {
        title: 'Manage',
    };

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;
        this.meetsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meets')

        this.state = {
            currentDate: moment(),
            markedDates: {},
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            agendaItemsJSON: {},
            markedDates: {}
        };

    }

    componentDidMount() {
        console.log(this.props.navigation)
    }

    render() {
        return (
            <View style={{margin: 10}}>
                <Card style={styles.card}>

                    <View style={{ alignSelf: 'flex-start', justifyContent: 'center' }}>
                        <CardItem header style={styles.cardHeader}>
                            <Text style={[styles.captionText, { color: 'black' }]}>{this.props.meeting.name}</Text>
                        </CardItem>

                        <CardItem style={styles.cardHeader}>
                            <Text>{this.props.meeting.startTime} - {this.props.meeting.endTime}</Text>
                        </CardItem>
                    </View>

                    <View style={styles.cardBody}>

                        <Body>
                            <Icon
                                raised
                                name='microphone'
                                type='font-awesome'
                                color='#FF4136'
                                size={40}
                          
                            />
                        </Body>

                        <Body>
                            <Icon
                                raised
                                name='pencil'
                                type='font-awesome'
                                color='#FF4136'
                                size={40}
                                onPress= { () => this.props.navigation.push('EditMeetings', { meeting: this.props.meeting })}
                            />
                        </Body>
                    </View>

                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
    },
    card: {
        padding: 5
    },
    cardHeader: {
        backgroundColor: 'white',

    },
    captionText: {
        fontFamily: 'Avenir',
        fontSize: 18
    },
    cardBody: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    }

});