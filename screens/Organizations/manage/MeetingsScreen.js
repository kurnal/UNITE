import React from 'react';
import { StyleSheet, Button, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements'
import { Container, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body } from 'native-base'
import moment, { updateLocale } from 'moment'

export default class MeetingsScreen extends React.Component {

    static navigationOptions = {
        title: '',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card style={styles.card} >
                <CardItem header style={styles.cardHeader}>
                    <Text style={[styles.captionText, { color: 'white' }]}>{this.props.meeting.meetingName}</Text>
                </CardItem>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '60%' }}>
                        <CardItem>
                            <View style={styles.eventInfoContainer}>
                                <Icon
                                    name='flag'
                                    type='font-awesome'
                                    color='#f50'
                                    size={18}
                                    style={{}}
                                    onPress={() => console.log('time')}
                                />
                                <Text style={[styles.info, { marginLeft: '8%' }]}>{(this.props.meeting.headline == '') ? 'No Headline' : this.props.meeting.headline}</Text>
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
                                <Text style={styles.info}>{this.props.meeting.startTime} - {this.props.meeting.endTime}</Text>
                            </View>
                        </CardItem>
                        <CardItem>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon
                                    raised
                                    name='microphone'
                                    type='font-awesome'
                                    color='#f50'
                                    size={22}
                                    onPress={() => { console.log('Send Members Wide Notification Regarding Event') }}
                                />
                                <Icon
                                    raised
                                    name='pencil'
                                    type='font-awesome'
                                    color='#f50'
                                    size={22}
                                    style={{ width: '5%' }}
                                    onPress={() => this.props.navigation.push('EditMeetings', { meeting: this.props.meeting })}
                                /> 
                            </View>
                        </CardItem>
                    </View>

                    <View style={styles.scanIcon}>
                        <Icon
                            name='ios-qr-scanner'
                            type='ionicon'
                            color='#3ca2c3'
                            size={80}
                            style={{ width: '5%' }}
                            onPress={() => console.log('Scan for Specific Event')}
                        />
                    </View>
                </View>
            </Card>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    eventsFormButton: {
        alignItems: 'flex-end'
    },
    card: {

    },
    cardHeader: {
        backgroundColor: '#5f9ea0',
        marginBottom: 5
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    captionText: {
        fontFamily: 'Avenir',
        fontSize: 18
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
    },
    scanIcon: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%'
    }
});