
import React from 'react'
import {  AppRegistry, StyleSheet, TextInput, View, SafeAreaView, ScrollView, ImageBackground, keyboardAppearance, Image } from 'react-native'
import ScreenHeader from '../components/ScreenHeader';
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

export default class SignUp extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null }
handleSignUp = () => {

  firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
  firebase
    .auth()
    .onAuthStateChanged(user => {
        console.log(user);
        user.updateProfile({ displayName: this.state.name })
      })


}
render() {
    return (
      <ImageBackground source={require("../assets/images/signup.jpeg")} style={styles.container}>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>

      <View style={styles.container}>
    <Text style={styles.headerText}>Sign Up</Text>
    {this.props.subtitle && (
      <Text style={styles.subHeaderText}>{this.props.subtitle}</Text>
    )}
      <Card title='' borderRadius={15}>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <Input
          placeholder='Name'
        containerStyle={styles.signUp}
        autoCapitalize="none"

        InputProps={{ disableUnderline: true }}
        inputStyle={{color: 'black'}}
        shake={true}
        leftIcon={<Icon name='user' size={24} color='black'/>}
        keyboardAppearance={'dark'}
        onChangeText={name => this.setState({ name })}
        value={this.state.name}
        />
        <Input
          placeholder='Email'
        containerStyle={styles.signUp}
        autoCapitalize="none"
        InputProps={{ disableUnderline: true }}
        inputStyle={{color: 'black'}}
        shake={true}
        leftIcon={<Octicons name="mail" size={24} color='black'/>}
        onChangeText={email => this.setState({ email })}
        value={this.state.email}
        keyboardAppearance={'dark'}
        />
        <Input
          placeholder='Password'
        containerStyle={styles.signUp}
        autoCapitalize="none"
        secureTextEntry={true}
        InputProps={{ disableUnderline: true }}
        inputStyle={{color: 'black'}}
        shake={true}
        leftIcon={<Icon name='key' size={24} color='black'/>}
        onChangeText={password => this.setState({ password })}
        value={this.state.password}
        keyboardAppearance={'dark'}
        />

        <Button
          ViewComponent={require('expo').LinearGradient}
          linearGradientProps={{
          colors: ['#FF9800', '#F44336'],
          start: [1, 0],
          end: [0.2, 0],
          }}
          buttonStyle={{borderRadius: 10, marginLeft: 50, marginRight: 0, marginTop: 30, height: 40, width: 200 }}
          title="SIGN UP"
          onPress={this.handleSignUp}        />
          <Button
            buttonStyle={{ marginLeft: 0, marginRight: 0, marginTop: 30, height: 50, backgroundColor: '#fff'}}
            title="Already have an account? Login Here."
            titleStyle={{color: 'black'}}
            onPress={() => this.props.navigation.navigate('Login')}
    />

      </Card>
      </View>
      </SafeAreaView>
      </ImageBackground>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
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
    marginTop: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    // borderWidth: 0.2,
    // borderRadius: 25,
  },

});
