import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements'

import { Tab, Tabs, TabHeading } from 'native-base';
import moment from 'moment'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class MeetingsScreen extends React.Component {

  static navigationOptions = {
    title: 'Manage',
  };

  constructor() {
    super();

    this.state = {

      currentDate: new Date(moment()),
      // minDate: new Date(moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD')),
      // maxDate: new Date(moment().add(3,'months').startOf('month').format('YYYY-MM-DD')),

    };

  }
  
  render() {
    return (

      <ScrollView style={styles.container}>

        <View style={styles.meetingsFormButton}>
          <Icon
            raised
            name='cog'
            type='font-awesome'
            color='#f50'
            onPress={() => { this.props.navigation.push('EventCreation') }}
          />
        </View>

        <View style={{ paddingBottom: 5 }}>
          <Calendar
            // Initially visible month. Default = Date()
            current={this.state.currentDate}

            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => { console.log('selected day', day) }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => { console.log('selected day', day) }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'MMMM yyyy'}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => { console.log('month changed', month) }}
            // Hide month navigation arrows. Default = false
            hideArrows={false}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            // renderArrow={(direction) => (<Arrow />)}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={false}
            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Show week numbers to the left. Default = false
            showWeekNumbers={false}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={substractMonth => substractMonth()}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
            onPressArrowRight={addMonth => addMonth()}
          />
        </View>

        <Tabs>
          <Tab
            heading={
              <TabHeading style={[styles.tabs,{borderLeftWidth: 1}]}>
                <Icon
                  name='filter'
                  type='font-awesome'
                  color='#f50'
                />
              </TabHeading>
            }>
            <Text> Hello </Text>
          </Tab>
          <Tab
            heading={
              <TabHeading style={[styles.tabs,{borderRightWidth: 1}]}>
                <Icon
                  name='clipboard'
                  type='font-awesome'
                  color='#f50'
                />
              </TabHeading>
            }>
            <Text> Bye Bye </Text>
          </Tab>
        </Tabs>

      </ScrollView>



    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  meetingsFormButton: {
    alignItems: 'flex-end'
  },
  tabs: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#C0C0C0'
  }
});