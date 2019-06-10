import React from 'react';
import { ScrollView, View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { Avatar, Icon, withTheme } from 'react-native-elements';
import { ImagePicker } from 'react-native-image-picker'
import DatePicker from 'react-native-datepicker'
import { SegmentedControls } from 'react-native-radio-buttons'


import moment from 'moment'
import firebase from 'react-native-firebase';

export default class EventCreationScreen extends React.Component {

    static navigationOptions = {
        title: 'Create Event',
    };

    constructor() {
        super();

        this.ref = firebase.firestore().collection('Users')
        this.current = firebase.auth().currentUser;

        this.state = {
            eventPhoto: '',
            eventName: '',
            eventDescription: '',
            startDate: '',
            endDate: '',
            capacity: '',
            public: false,
            open: true,

            componentVisibility: {
                publicComponent: false,
                closedComponent: true,
            },
            minDate: new Date(moment().add(1, 'days').calendar()),
            maxDate: new Date(moment().add(3, 'month').calendar()),
            focusedInput: {
                borderBottomWidth: 3
            }
        };

    }

    privacyOptions = [
        "Public",
        "Private",
    ]

    eventTypeOptions = [
        "Open",
        "Closed",
    ]

    onFocus = () => {
        this.setState({

        })
    }

    onBlur = () => {
        this.setState({

        })
    }

    getEventPicture = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
        });
    }

    setEventPrivacy = (data) => {

        if (data === 'Public') {
            this.setState(
                {
                    public: true,
                    componentVisibility: {
                        publicComponent: true
                    }
                }
            )
        }

        if (data === 'Private') {
            this.setState(
                {
                    public: false,
                    componentVisibility: {
                        publicComponent: false,
                        closedComponent: true,
                    }
                }
            )
        }
    }

    setEventType = (data) => {

        if (data === 'Open') {
            this.setState(
                {
                    open: true,
                    componentVisibility: {
                        publicComponent: true,
                        closedComponent: false
                    },
                    capacity: ''
                }
            )
        }

        if (data === 'Closed') {
            this.setState(
                {
                    open: false,
                    componentVisibility: {
                        publicComponent: true,
                        closedComponent: true
                    }
                }
            )
        }
    }

    renderPublicComponent() {
        if (this.state.componentVisibility.publicComponent) {
            return (
                <View style={styles.segContainerBot}>
                    <SegmentedControls
                        optionStyle={styles.segmentedControls}
                        containerBorderRadius={0}
                        containerBorderWidth={1}
                        tint={'#FF4136'}
                        selectedTint={'white'}
                        backTint={'white'}
                        options={this.eventTypeOptions}
                        onSelection={this.setEventType.bind(this)}
                        selectedOption={(this.state.open) ? 'Open' : 'Closed'}
                    />
                </View>
            )
        }
    }

    renderClosedComponent() {
        if (this.state.componentVisibility.closedComponent) {
            return (
                <View style={styles.inputContainer}>
                    <Icon
                        style={styles.inputIcon}
                        name='people'
                        size={24}
                        color='black'
                        underlayColor='gold'>
                    </Icon>
                    <TextInput placeholder='Event Capacity'
                        style={styles.input}
                        value={this.state.capacity}
                        onChangeText={capacity => this.setState({ capacity })}
                        keyboardType='numeric' />
                </View>
            )
        }
    }

    submitEvent = () => {
        this.ref.doc(this.current.uid).collection('Events').doc(this.state.eventName).set({
            eventPhoto: this.state.eventPhoto,
            eventDescription: this.state.eventDescription,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            capacity: this.state.capacity,
            public: this.state.public,
            open: this.state.open,
            qr_encode: this.current.uid + "" + this.state.eventName,
            happened: false,
        }).then(() => this.props.navigation.navigate('Manage'))
    }

    render() {
        return (
            <View styles={styles.MainContainer}>
                <View>
                    <View style={styles.segContainer}>
                        <SegmentedControls
                            optionStyle={styles.segmentedControls}
                            containerBorderRadius={0}
                            containerBorderWidth={1}
                            tint={'#FF4136'}
                            selectedTint={'white'}
                            backTint={'white'}
                            options={this.privacyOptions}
                            onSelection={this.setEventPrivacy.bind(this)}
                            selectedOption={(this.state.public) ? 'Public' : 'Private'}
                        />
                    </View>
                    {this.renderPublicComponent()}
                </View>

                <View styles={styles.bodyContainer}>
                    <View style={styles.inputContainer}>
                        <Icon
                            style={styles.inputIcon}
                            name='event'
                            size={24}
                            color='black'
                            underlayColor='gold'>
                        </Icon>
                        <TextInput
                            style={styles.input}
                            placeholder='Event Name'
                            value={this.state.eventName}
                            onFocus={() => this.onFocus()}
                            onBlur={() => this.onBlur()}
                            onChangeText={eventName =>
                                this.setState({ eventName })
                            } />
                    </View>
                    {this.renderClosedComponent()}
                    <View style={styles.dateContainer}>
                        <View>
                            <DatePicker
                                style={{ width: 200, padding: 5 }}
                                date={this.state.startDate}
                                mode="datetime"
                                placeholder="Start Time"
                                format='lll'
                                minDate={this.state.minDate}
                                maxDate={this.state.maxDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        fontFamily: 'Avenir',
                                        marginLeft: 40,
                                        marginRight: 0,
                                        borderWidth: 0,
                                        borderBottomWidth: 1,
                                        borderColor: 'black',
                                        borderRadius: 5,
                                        backgroundColor: 'white',
                                        shadowColor: '#000',
                                        shadowRadius: 2,
                                        shadowOpacity: 1.5,
                                        shadowOffset: { width: 0, height: 2 },
                                    },
                                    dateText: {
                                        color: 'black'
                                    }
                                }}
                                onDateChange={startDate => { this.setState({ startDate }) }}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                            />
                        </View>
                        <View>
                            <DatePicker
                                style={{ width: 200, padding: 5 }}
                                date={this.state.endDate}
                                mode="datetime"
                                placeholder="End Time"
                                format='lll'
                                minDate={this.state.minDate}
                                maxDate={this.state.maxDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        fontFamily: 'Avenir',
                                        marginLeft: 40,
                                        marginRight: 0,
                                        borderWidth: 0,
                                        borderBottomWidth: 1,
                                        borderColor: 'black',
                                        borderRadius: 5,
                                        backgroundColor: 'white',
                                        shadowColor: '#000',
                                        shadowRadius: 2,
                                        shadowOpacity: 1.5,
                                        shadowOffset: { width: 0, height: 2 },
                                    },
                                    dateText: {
                                        color: 'black'
                                    }
                                }}
                                onDateChange={endDate => { this.setState({ endDate }) }}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                            />
                        </View>
                    </View>
                    <View style={styles.textAreaContainer}>
                        <TextInput
                            style={[styles.textArea, (this.props.isFocused) ? this.state.focusedInput : {}]}
                            autoCorrect={false}
                            placeholder='Event Description'
                            multiline={true}
                            numberOfLines={4}
                            size={24}
                            onChangeText={eventDescription => this.setState({ eventDescription })}
                            value={this.state.eventDescription}
                            onFocus={() => console.log(this.props.isFocused)}
                            onBlur={() => this.onBlur()} />
                    </View>
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={this.submitEvent}>
                        <Text style={styles.buttonText}> Post </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'blue',
    },
    topContainer: {
        padding: 15,
        flexDirection: 'row',
    },
    formsContainer: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    avatarContainer: {

    },
    bodyContainer: {
        flexDirection: 'column',
        justifyContent: "flex-start"
    },
    textAreaContainer: {
        borderColor: '#D3D3D3',
        margin: 5,
        marginBottom: 20
    },
    textArea: {
        height: 150,
        backgroundColor: 'white',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1.5,
        shadowRadius: 2,
        fontFamily: "Avenir",
        fontSize: 15,
        padding: 10,
        color: 'black',
    },
    segContainer: {
        margin: 10,
        shadowColor: '#000',
        shadowRadius: 2,
        shadowOpacity: 1.5,
        shadowOffset: { width: 0, height: 2 },
    },
    segContainerBot: {
        margin: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowRadius: 2,
        shadowOpacity: 1.5,
        shadowOffset: { width: 0, height: 2 },
    },
    segmentedControls: {
        padding: 5,
        fontFamily: "DINCondensed-Bold",
        fontSize: 18

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 5,
        margin: 5,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1.5,
        shadowRadius: 2,
    },
    inputIcon: {},
    input: {
        fontFamily: "Avenir",
        fontSize: 15,
        margin: 0,
        padding: 10,
        color: 'black',
    },
    dateContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    submitButton: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#FF4136',
        elevation: 2, // Android
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontFamily: "DINCondensed-Bold",
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

