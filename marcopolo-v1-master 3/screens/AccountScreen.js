import React from 'react'
import {    Linking,AppRegistry, StyleSheet, TextInput, View, SafeAreaView, ScrollView, ImageBackground, keyboardAppearance, Image } from 'react-native'
import { Card, ListItem, Button, Input, Text } from 'react-native-elements'
import MainTabNavigator from '../navigation/MainTabNavigator';
import {StackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {
  Entypo,
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import * as firebase from 'firebase';
require("firebase/firestore");
const firstName='';

export default class Main extends React.Component {
  state = { currentUser: null }
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })


}
handleLogOut = () =>{
    firebase
    .auth()
    .signOut()
    .then(() => this.props.navigation.navigate('Loading'))
    .catch(error => this.setState({ errorMessage: error.message }))
}


onSwipeRight(gestureState) {
  this.props.navigation.navigate('AddEvent')
}

render() {
    const { currentUser } = this.state
    const config = {
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 70
        };
return (
  <ImageBackground source={require("../assets/images/signup.jpeg")} style={styles.container}>
  <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
  <GestureRecognizer
    onSwipeLeft={(state) => this.onSwipeLeft(state)}
    onSwipeRight={(state) => this.onSwipeRight(state)}
    config={config}>
  <View style={styles.container}>
  <Card  borderRadius={15}   title='Account' containerStyle={{elevation: 10}}>
    {this.state.errorMessage &&
      <Text style={{ color: 'red' }}>
        {this.state.errorMessage}
      </Text>}
      <View style={styles.container}>
        <Text >
          Hi {currentUser && currentUser.email}!
        </Text>
      </View>

      <Button
        buttonStyle={{borderRadius: 10, marginLeft: 40, marginRight: 0, marginTop: 30, height: 40, width: 200, backgroundColor: '#051937'}}
        title="Manage Subscriptions"
        onPress={() => Linking.openURL("https://swarn2099.github.io/Pool")} />
        <Button
          buttonStyle={{borderRadius: 10, marginLeft: 40, marginRight: 0, marginTop: 30, height: 40, width: 200, backgroundColor: '#004d7a' }}
          title="Manage Account"
          onPress={() => Linking.openURL("https://swarn2099.github.io/Pool")} />
          <Button
            buttonStyle={{borderRadius: 10, marginLeft: 40, marginRight: 0, marginTop: 30, height: 40, width: 200, backgroundColor: '#008793' }}
            title="Contact Us"
            onPress={() => Linking.openURL("https://swarn2099.github.io/Pool")} />
        <Button
          ViewComponent={require('expo').LinearGradient}
          linearGradientProps={{
          colors: ['#FF9800', '#F44336'],
          start: [1, 0],
          end: [0.2, 0],
          }}
          buttonStyle={{borderRadius: 10, marginLeft: 40, marginRight: 0, marginTop: 30, height: 40, width: 200 }}
          title="LOGOUT"
          onPress={this.handleLogOut}       />
  </Card>
  </View>
  </GestureRecognizer>
  </ScrollView>
  </SafeAreaView>
  </ImageBackground>


    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  cardList: {
    marginTop: 10,
  },
  whiteTitle: {
    color: '#fff'
  },
  animatedCard: {
    marginBottom: 35,
  },
});
