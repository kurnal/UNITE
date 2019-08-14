import React from 'react';
import { StyleSheet, Button, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements'
import { Container, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body } from 'native-base'
import moment, { updateLocale } from 'moment'

export default class EventsScreen extends React.Component {

    static navigationOptions = {
        title: '',
    };

    constructor(props) {
        super(props);
    }

    render() {
        startTime = moment(this.props.event.startDate, 'YYYY-MM-DD h:mm A').format('h:mm A')
        endTime = moment(this.props.event.endDate, 'YYYY-MM-DD h:mm A').format('h:mm A')
        return (
            <Card style={styles.card} >
                <CardItem header style={styles.cardHeader}>
                    <Text style={[styles.captionText, { color: 'white' }]}>{this.props.event.eventName}</Text>
                    <View style={styles.absolute}>
                        <Icon
                            name='user'
                            type='font-awesome'
                            color='white'
                            iconStyle={{ marginRight: 10 }}
                        />
                        <Text style={[styles.captionText, { color: 'white' }]}>{this.props.event.attending}</Text>
                    </View>
                </CardItem>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '60%' }}>
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
                                <Text style={styles.info}>{startTime} - {endTime}</Text>
                            </View>
                        </CardItem>
                        <CardItem>
                            <View style={styles.eventInfoContainer}>
                                <Icon
                                    name='building'
                                    type='font-awesome'
                                    color='#f50'
                                    size={18}
                                    style={{}}
                                    onPress={() => console.log('time')}
                                />
                                <Text style={[styles.info, { marginLeft: '8%' }]}>{this.props.event.location}</Text>
                            </View>
                        </CardItem>
                        <CardItem>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon
                                    raised
                                    name='dashboard'
                                    type='font-awesome'
                                    color='#f50'
                                    size={22}
                                    onPress={() => { console.log('analytics') }}
                                />
                                <Icon
                                    raised
                                    name='user'
                                    type='font-awesome'
                                    color='#f50'
                                    size={22}
                                    style={{ width: '5%' }}
                                    onPress={() => console.log('guest list')}
                                />
                                <Icon
                                    raised
                                    name='pencil'
                                    type='font-awesome'
                                    color='#f50'
                                    size={22}
                                    style={{ width: '5%' }}
                                    onPress={() => this.props.navigation.push('EventCreation')}
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
    absolute: {
        position: 'absolute',
        top: 15,
        right: 10,
        flexDirection: 'row',
    },
    card: {

    },
    cardHeader: {
        backgroundColor: '#ffa500',
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