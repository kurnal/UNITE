import React from 'react';
import { View, StatusBar } from 'react-native'
import { QRCode } from 'react-native-custom-qr-codes'
import { Container, Item, Text, Icon, Header, Left, Body, Right, Title, Button } from 'native-base'

import firebase from 'react-native-firebase'
import jsonpack from 'jsonpack'
import moment from 'moment'

export default class MeetingTicket extends React.Component {

    static navigationOptions = {
        headerForceInset: { top: 'never', bottom: 'never' },
        header: null,
        headerMode: 'none'
    }

    constructor(props) {
        super(props)
        this.data = this.props.navigation.getParam('data', 'NO-ID');
    }

    componentDidMount() { console.log(this.data) }

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
                        <Text> {this.data.organizationName} </Text>
                    </Item>
                    <Item style={{ width: '100%', padding: '3%' }}>
                        <Icon
                            name='ios-arrow-forward'
                            type='Ionicons'
                            size={16}
                            style={{ color: '#FF4136' }}
                        />
                        <Text> {this.data.meetingName} </Text>
                    </Item>

                    <Item style={{ width: '100%', flexDirection: 'row', padding: '3%' }}>
                        <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center'}}>
                            <Icon
                                name='ios-calendar'
                                type='Ionicons'
                                size={16}
                                style={{ color: '#FF4136' }}
                            />
                            <Text> {this.data.date} </Text>
                        </View>
                        <View style={{ width: '60%', flexDirection: 'row', marginLeft: '5%', alignItems: 'center' }}>
                            <Icon
                                name='ios-clock'
                                type='Ionicons'
                                size={16}
                                style={{ color: '#FF4136' }}
                            />
                            <Text> {this.data.startTime} - {this.data.endTime} </Text>
                        </View>
                    </Item> 

                    <Item style={{ width: '100%', padding: '4%' }}>
                        <Text>{(this.data.headline == '')? 'No Headline Has Been Added':this.data.headline}</Text>
                    </Item>
                    <Item style={{ width: '100%', padding: '4%' }}>
                        <Text>{(this.data.agenda === '')? 'No Agenda Has Been Identified Yet':this.data.agenda}</Text>
                    </Item>
                </View>
            </Container>
        )
    }
}