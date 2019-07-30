import React from 'react';
import { View, StatusBar } from 'react-native'
import { QRCode } from 'react-native-custom-qr-codes'
import { Container, Item, Text, Icon, Header, Left, Body, Right, Title, Button } from 'native-base'

import firebase from 'react-native-firebase'
import jsonpack from 'jsonpack'
import moment from 'moment'



export default class EventTicket extends React.Component {

    static navigationOptions = {
        headerForceInset: { top: 'never', bottom: 'never' },
        header: null,
        headerMode: 'none'
    }

    constructor(props) {
        super(props)
        this.data = this.props.navigation.getParam('data', 'NO-ID');
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#FF4136' }}>
                    <Left>
                        <Button transparent>
                            <Icon style={{ color: 'white' }} onPress={() => this.props.navigation.pop()} name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'white' }}>Ticket</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon style={{ color: 'white' }} name='add' onPress={() => console.log('Add to Calendar or Passport')} />
                        </Button>
                    </Right>
                </Header>
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <QRCode codeStyle='square' size={200} content={jsonpack.pack(this.data.qr_info)} />
                </View>
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <Item style={{ width: '100%', padding: '3%' }}>
                        <Icon
                            name='ios-bonfire'
                            type='Ionicons'
                            size={16}
                            style={{ color: '#FF4136' }}
                        />
                        <Text> {this.data.eventName} </Text>
                    </Item>
                    <Item style={{ width: '100%', padding: '3%' }}>
                        <Icon
                            name='ios-clock'
                            type='Ionicons'
                            size={16}
                            style={{ color: '#FF4136' }}
                        />
                        <Text> {moment(this.data.startDate, 'YYYY-MM-DD h:mm A').format('LLLL')} </Text>
                    </Item>
                    <Item style={{ width: '100%', padding: '3%' }}>
                        <Icon
                            name='ios-clock'
                            type='Ionicons'
                            size={16}
                            style={{ color: '#FF4136' }}
                        />
                        <Text> {moment(this.data.endDate, 'YYYY-MM-DD h:mm A').format('LLLL')} </Text>
                    </Item>
                    <Item style={{ width: '100%', padding: '3%' }}>
                        <Icon
                            name='ios-home'
                            type='Ionicons'
                            size={16}
                            style={{ color: '#FF4136' }}
                        />
                        <Text> {this.data.location} </Text>
                    </Item>
                    <Item style={{ width: '100%', padding: '4%' }}>
                        <Text>{this.data.eventDescription}</Text>
                    </Item>
                </View>
            </Container>
        )
    }
}