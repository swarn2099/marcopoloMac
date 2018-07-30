
import React from 'react'
import {  AppRegistry, StyleSheet, TextInput, View, SafeAreaView, ScrollView, ImageBackground, keyboardAppearance, Image } from 'react-native'
import { Card, ListItem, Button, Input, Text } from 'react-native-elements'
import MainTabNavigator from '../navigation/MainTabNavigator';
import {StackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Entypo,
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import * as firebase from 'firebase';
import Login from '../screens/LoginScreen';

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
render() {
    const { currentUser } = this.state
return (
  <ImageBackground source={require("../assets/images/signup.jpeg")} style={styles.container}>
  <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
  <View style={styles.container}>
  <Card title='' borderRadius={15}>
    {this.state.errorMessage &&
      <Text style={{ color: 'red' }}>
        {this.state.errorMessage}
      </Text>}
      <View style={styles.container}>
        <Text h5>
          Hi {currentUser && currentUser.displayName}!
        </Text>
      </View>

    <Button
      ViewComponent={require('expo').LinearGradient}
      linearGradientProps={{
      colors: ['#FF9800', '#F44336'],
      start: [1, 0],
      end: [0.2, 0],
      }}
      buttonStyle={{borderRadius: 10, marginLeft: 30, marginRight: 0, marginTop: 30, height: 40, width: 200 }}
      title="LOGOUT"
      onPress={this.handleLogOut}        />
  </Card>
  </View>

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
