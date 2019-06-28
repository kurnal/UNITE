import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker, Item, Form, Icon, Button, Header, Title, Left, Body, Right, Container } from 'native-base'
import DatePicker from 'react-native-datepicker'

import moment from 'moment'
import firebase from 'react-native-firebase';

import WeeklyMeetingForm from './creationForms/WeeklyMeetingForm';
import MonthlyMeetingForm from './creationForms/MonthlyMeetingForm';

export default class MeetingsCreationScreen extends React.Component {

  static navigationOptions = {
    title: 'Create Meeting',
  };

  constructor() {
    super();

    this.ref = firebase.firestore().collection('Users')
    this.current = firebase.auth().currentUser;
    this.meetingsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meetings')

    this.state = {
      meetingRate: '',
      currentDate: moment(),
      formVisible: false,
    }
  }

  renderForm = () => {

    if (this.state.meetingRate == 'weekly') {
      return (
        <WeeklyMeetingForm />
      )
    }

    if (this.state.meetingRate == 'monthly') {
      return (
        <MonthlyMeetingForm />
      )
    }

    return (<View></View>)
  }

  render() {
    return (

      <Form style={styles.formContainer}>
        <Item style={{ flexDirection: 'row' }}>
          <Icon active name="clipboard" style={[styles.icon, { flex: 1 }]} />
          <Item picker style={{ borderBottomWidth: 0, flex: 20 }}>
            <Picker
              renderHeader={backAction =>
                <Header style={{ backgroundColor: "#f44242" }}>
                  <Left>
                    <Button transparent onPress={backAction}>
                      <Icon name="arrow-back" style={{ color: "#fff" }} />
                    </Button>
                  </Left>
                  <Body style={{ flex: 3 }}>
                    <Title style={{ color: "#fff" }}>Meeting Frequency</Title>
                  </Body>
                  <Right />
                </Header>
              }
              mode="dropdown"
              placeholder="Create a new meeting."
              placeholderStyle={{ color: '#C0C0C0', fontFamily: 'Avenir' }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.meetingRate}
              onValueChange={(meetingRate) => this.setState({ meetingRate })}
            >
              <Picker.Item label="Once" value="once" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Bi-Weekly" value="bi-weekly" />
              <Picker.Item label="Monthly" value="monthly" />
              <Picker.Item label="Semesterly" value="semesterly" />
            </Picker>
          </Item>
          <Icon name="arrow-down" style={{ flex: 1 }} />
        </Item>

        {this.renderForm()}

      </Form>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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


