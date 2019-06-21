import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Picker, Item, Input, Form, Icon, Button } from 'native-base'
import DatePicker from 'react-native-datepicker'

import moment from 'moment'
import firebase from 'react-native-firebase';


export default class MeetingsCreationScreen extends React.Component {

  static navigationOptions = {
    title: 'Manage',
  };

  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('Users')
    this.current = firebase.auth().currentUser;
    this.meetingsRef = firebase.firestore().collection('Users').doc(this.current.uid).collection('Meetings')

    this.state = {
      meetingRate: '',
      meetingDay: '',
      meetingTime: '',
      meetingName: '',
      currentDate: moment()
    }

  }

  addRealMonth = (d) => {
    let fm = moment(d).add(1, 'M');
    let fmEnd = moment(fm).endOf('month');
    return d.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm;
  }

  postMeetings = (meeting) => {

    this.meetingsRef.doc(meeting.id).get()
      .then(doc => {

        let date = moment();
        let twoMonthsFromNow = moment().month() + 3;
        let meetingDay = doc.data().meetingDay;
        let meetingRate = doc.data().meetingRate;
        let meetingName = doc.data().meetingName;
        let meetingTime = moment(doc.data().meetingTime, 'LLLL')
        let batch = firebase.firestore().batch();
        let meetsRef = this.ref.doc(this.current.uid).collection('Meets')

        if (meetingRate == 'weekly') {
          while (date.day() != meetingDay) {
            date = date.add(1, 'day')
          }
          
          while ((date.month() + 1) < twoMonthsFromNow) {
            batch.set(meetsRef.doc(), {
              name: meetingName,
              date: date.format('YY-MM-DD'),
              headline: '',
              agenda: ''
            });
            date = date.add(7, 'day');
          }
        }

        if (meetingRate == 'monthly') {
          while ((meetingTime.month() + 1) < twoMonthsFromNow) {
            batch.set(meetsRef.doc(), {
              meetingName: doc.data().meetingName,
              eventDate: meetingTime.format('YY-MM-DD'),
              headline: '',
              agenda: ''
            });
            meetingTime = this.addRealMonth(meetingTime);
          }
        }

        batch.commit().then(() => this.setState({
          meetingRate: '',
          meetingDay: '',
          meetingTime: '',
          meetingName: '',
        }))
      })
  }


  postMeetingSetting = () => {

    this.meetingsRef.add({
      meetingRate: this.state.meetingRate,
      meetingDay: this.state.meetingDay,
      meetingTime: this.state.meetingTime,
      meetingName: this.state.meetingName,
    }).then(meeting => this.postMeetings(meeting));

  }

  submitButton = () => {
    this.postMeetingSetting();
  }


  render() {
    return (

      <Form style={styles.formContainer}>
        <Item style={{ flexDirection: 'row' }}>
          <Icon active name="clipboard" style={[styles.icon, { flex: 1 }]} />
          <Item picker style={{ borderBottomWidth: 0, flex: 20 }}>
            <Picker
              mode="dropdown"
              placeholder="How often shall this meeting occur?"
              placeholderStyle={{ color: '#C0C0C0', fontFamily: 'Avenir' }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.meetingRate}
              onValueChange={(meetingRate) => this.setState({ meetingRate, meetingTime: '' })}
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

        <Item style={{ flexDirection: 'row' }}>
          <Icon active name="clipboard" style={[styles.icon, { flex: 1 }]} />
          <Item picker style={{ borderBottomWidth: 0, flex: 20 }}>
            <Picker
              mode="dropdown"
              placeholder="What day will these meetings occur"
              placeholderStyle={{ color: '#C0C0C0', fontFamily: 'Avenir' }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.meetingDay}
              onValueChange={(meetingDay) => this.setState({ meetingDay })}
            >
              <Picker.Item label="Sunday" value='0' />
              <Picker.Item label="Monday" value='1' />
              <Picker.Item label="Tuesday" value='2' />
              <Picker.Item label="Wednesday" value='3' />
              <Picker.Item label="Thursday" value='5' />
              <Picker.Item label="Friday" value='5' />
              <Picker.Item label="Saturday" value='6' />
            </Picker>
          </Item>
          <Icon name="arrow-down" style={{ flex: 1 }} />
        </Item>

        <Item>
          <Icon active ios='ios-calendar' android="md-calendar" style={styles.icon} />
          <DatePicker
            style={{ flex: 1, padding: 3, paddingLeft: 0 }}
            disabled={(this.state.meetingRate === '') ? true : false}
            date={this.state.meetingTime}
            mode={(this.state.meetingRate === 'once' || this.state.meetingRate === 'monthly')  ? "datetime" : "time"}
            placeholder="What time will these meetings occur?"
            format={(this.state.meetingRate === 'once' || this.state.meetingRate === 'monthly')  ? "LLLL" : "LT"}
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
            onDateChange={meetingTime => { this.setState({ meetingTime }) }}
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


