
import React from 'react'
import {Linking, Elevation, Alert, AppRegistry, StyleSheet, TextInput, View, SafeAreaView, ScrollView,Text, ImageBackground, keyboardAppearance, Image } from 'react-native'
import ScreenHeader from '../components/ScreenHeader';
import { Card, ListItem, Button, Input,  } from 'react-native-elements'
import MainTabNavigator from '../navigation/MainTabNavigator';
import {StackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Entypo,
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker'
import * as firebase from 'firebase';
require("firebase/firestore");

import Login from '../screens/LoginScreen';
const userArray = [];

export default class SignUp extends React.Component {
  state = { eventName: '', imageLink: '', descriptionValue: '', userEmail:'', datePicker: '', starttime: '', endtime: '', users: [], location: ''}
addPrivateEvent = () => {

      firebase.firestore().collection('privateEvents').doc(this.state.eventName).set({
        name: this.state.eventName,
        imageURL: 'https://source.unsplash.com/collection/190727/1600x900',
        description: this.state.descriptionValue,
        date: this.state.datePicker,
        startTime: this.state.starttime,
        endTime: this.state.endtime,
        users: userArray,
        population: 0,
        location: this.state.location,
      })
.then(function() {
  Alert.alert(
    'Event Added',
    'If you need to edit your event, go to Account and click Manage your Event',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
})
.catch(function(error) {
  Alert.alert(
    'Event Not Added',
    'Something went wrong, please try again',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
});


}
addUsers = () => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(re.test(this.state.userEmail)){
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
    console.log(currentUser)
    userArray.push(currentUser.email);
    userArray.push(this.state.userEmail);
    Alert.alert(
      'User Added',
      'The User was added to the Private Event',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }
  else
  {
    Alert.alert(
      'Inavlid User Email',
      'The user was not added, please try again',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }
}
render() {
    return (
      <SafeAreaView style={styles.container} forceInset={{top:'always'}}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <ScreenHeader title="Add Event" location={this.props.screenProps.location}/>

          <Card borderRadius={15} title='Event Info' containerStyle={{elevation: 10}}>
            <Input
              placeholder='Event Name'
            containerStyle={styles.signUp}
            InputProps={{ disableUnderline: true }}
            inputStyle={{color: 'black'}}
            shake={true}
            keyboardAppearance={'dark'}
            onChangeText={eventName => this.setState({ eventName })}
            value={this.state.eventName}
            />
            <Input
              placeholder='Enter Location'
            containerStyle={styles.signUp}
            InputProps={{ disableUnderline: true }}
            inputStyle={{color: 'black'}}
            shake={true}
            keyboardAppearance={'dark'}
            onChangeText={location => this.setState({ location })}
            value={this.state.location}
            />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,}}>
              <Input
              placeholder='Email of User to Add'
              containerStyle={styles.signUp2}
              autoCapitalize="none"
              InputProps={{ disableUnderline: true }}
              inputStyle={{color: 'black'}}
              shake={true}
              onChangeText={userEmail => this.setState({ userEmail })}
              value={this.state.userEmail}
              keyboardAppearance={'dark'}
              />

              <Button
                style={{paddingLeft: 20}}
                icon={ <Icon name='plus' size={15} color='white' style={{padding: 10}}/>}
                title=''
                onPress={this.addUsers}
              />
              </View>
              </Card>
              <Card borderRadius={15} containerStyle={{elevation: 10}} title='Description'>
              <TextInput
              style={{height: 80, borderColor: 'gray', borderWidth: 0, paddingTop: 20}}
              multiline={true}
              numberOfLines={4}
               underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Enter Description Here"
              keyboardAppearance={'dark'}
              onChangeText={(text) => this.setState({descriptionValue: text})}
              />
              </Card>
              <Card borderRadius={15} containerStyle={{elevation: 10}} title='Final Step'>
              <DatePicker
              style={styles.dateTimePickers}
            date={this.state.datePicker}
            mode="date"
            placeholder="Select Date"
            format="MMM Do YYYY"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              borderWidth: 0,
            }}
            onDateChange={(date) => {this.setState({datePicker: date})}}
          />
          <DatePicker
          style={styles.dateTimePickers}
            date={this.state.starttime}
            mode="time"
            placeholder="Select Start Time"
            format="LT"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {this.setState({starttime: date})}}
          />
          <DatePicker
            style={styles.dateTimePickers}
            date={this.state.endtime}
            mode="time"
            placeholder="Select End Time"
            format="LT"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              borderWidth: 0,
            }}
            onDateChange={(date) => {this.setState({endtime: date})}}
            />
            <Button
              buttonStyle={{borderRadius: 10, marginLeft: 50, marginRight: 0, marginTop: 30, height: 40, width: 200 }}
              title="Add Private Event"
              onPress={this.addPrivateEvent}/>
            </Card>
            <Card borderRadius={15} containerStyle={{elevation: 10}} title='Public Event'>
              <Button
                buttonStyle={{borderRadius: 10, marginLeft: 50, marginRight: 0, marginTop: 30, height: 40, width: 200 }}
                title="Add Public Event"
                onPress={() => Linking.openURL("https://swarn2099.github.io/Pool")}/>
              </Card>

        </ScrollView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer:{
    paddingTop: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  dateTimePickers:{
     width: 300,
     paddingTop: 20,
     borderColor: 'rgba(0,0,0,0)',
  },
  brand: {
    width: 100,
    height: 21.5,
  },
  headerText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff'
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: '500',
  },
  signUp: {
    height: 40,
    marginTop: 20,
    paddingBottom: 30,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  signUp2: {
    width: 200,
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
  },
})
