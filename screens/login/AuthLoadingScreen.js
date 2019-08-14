import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import BackgroundTimer from 'react-native-background-timer'

export default class Loading extends React.Component {

  constructor() {
    super();
    this.current = firebase.auth().currentUser;
    this.db = firebase.firestore().collection('Users');
  }

  dataCleanStudents = () => {
    this.db.doc(this.current.uid).collection('Events').get().then(
      snapshot => {
        snapshot.forEach(doc => {
          let date = moment(doc.data().date).format('YYYY-MM-DD')
          let today = moment().format('YYYY-MM-DD')
          if (moment(date).isBefore(moment(today))) {
            this.moveStudentEventToPast(doc.data(), doc.id)
          }
        })
      }
    )

    this.db.doc(this.current.uid).collection('Meetings').get().then(
      snapshot => {
        snapshot.forEach(doc => {
          let date = moment(doc.data().date).format('YYYY-MM-DD')
          let today = moment().format('YYYY-MM-DD')
          if (moment(date).isBefore(moment(today))) {
            this.moveStudentMeetingToPast(doc.data(), doc.id)
          }
        })
      }
    )
  }

  moveStudentEventToPast = (event, eventID) => {

    let batch = firebase.firestore().batch();
    let eventRef = this.userRef.collection('Events').doc(eventID)
    let pastEventsRef = this.userRef.collection('Past Events').doc();

    return new Promise(function (resolve, reject) {
      batch.delete(eventRef)
      batch.set(pastEventsRef, event)
      batch.commit().then(resolve())
    });

  }

  moveStudentMeetingToPast = (meeting, meetingID) => {

    let batch = firebase.firestore().batch();
    let meetingRef = this.userRef.collection('Meetings').doc(meetingID)
    let pastMeetingsRef = this.userRef.collection('Past Meetings').doc();

    return new Promise(function (resolve, reject) {
      batch.delete(meetingRef)
      batch.set(pastMeetingsRef, meeting)
      batch.commit().then(resolve())
    });

  }

  dataCleanOrganizations = () => {

  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        this.props.navigation.navigate('Auth');
      } else {
        this.db.doc(firebase.auth().currentUser.uid).get()
          .then(doc => {
            if (!doc.exists) {
              this.props.navigation.navigate('ChooseAccountType');
            } else {
              if (doc.data().StudentOrOrganization === "Student") {
                BackgroundTimer.runBackgroundTimer(() => {
                  this.dataCleanStudents()
                },
                  60000);
                this.props.navigation.navigate('Student');
              } else if (doc.data().StudentOrOrganization === "Organization") {
                this.props.navigation.navigate('Organization');
              } else {
                this.props.navigation.navigate('ChooseAccountType');
              }
            }
          })
          .catch(err => {
            console.log('Error getting document', err);
          });
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})