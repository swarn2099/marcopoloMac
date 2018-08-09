import React from 'react';
import { View, Text, Image, Button, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import moment from 'moment';
import MainTabNavigator from '../navigation/MainTabNavigator';
import {StackNavigator} from 'react-navigation';
import AccountScreen from '../screens/AccountScreen';

import {
  Entypo,
  Ionicons,
  Octicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
const props = {
  size: 40,
};

export default class ScreenHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format('MMM Do'),
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    };
  }
  componentDidMount() {
      Animated.timing(                  // Animate over time
        this.state.fadeAnim,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 1000,              // Make it take a while
        }
      ).start();                        // Starts the animation
    }
  render() {
    let { city, region } = this.props.location || {};
    let { fadeAnim } = this.state;
    let strLocation = `${city}, ${region}`;
    let strDate = this.state.date;
    let dateLocation = `${strDate} in ${strLocation}`;



    return (

      <View style={styles.container}>
        <View style={styles.dataLogoContainer}>
          <Text style={styles.locationText}>{city ? dateLocation : strDate}</Text>
          </View>
          <View style={{flex: 1,flexDirection: 'row', paddingBottom: 10}}>
          <Text style={styles.headerText}>{this.props.title}</Text>
          {this.props.subtitle && (
            <Text style={styles.subHeaderText}>{this.props.subtitle}</Text>
          )}
          <View style={{flex:1, flexDirection:'row', justifyContent: 'flex-end'}}>
          <Animated.View                 // Special animatable View
            style={{
              ...this.props.style,
              opacity: fadeAnim,         // Bind opacity to animated value
            }}
          >
            {this.props.children}
            <View style={{flex:1, flexDirection: 'row', bottom: 3}} onPress={() => this.props.navigation.navigate('Login')}>
            <MaterialIcons name="account-circle" {...props}
            />
          </View>
          </Animated.View>

          </View>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  dataLogoContainer: {
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777777',
  },
  brand1: {
    width: 90,
    height: 40,
    backgroundColor: '#fff',
  },
  brand2: {
    width: 60,
    height: 40,
    bottom: 10,
    paddingTop: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },

  headerText: {
    fontSize: 30,
    fontWeight: '800',
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
