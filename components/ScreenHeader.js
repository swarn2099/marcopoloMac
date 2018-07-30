import React from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import moment from 'moment';

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
          <View style={{flex: 1,flexDirection: 'row',}}>
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
            <View style={{flex:1, flexDirection: 'row', left: 15}}>
            <Image style={styles.brand1} resizeMode="contain" source={require('../assets/images/brand.png')}/>
            <Image style={styles.brand2} resizeMode="contain" source={require('../assets/images/icon.png')}/>
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
    height: 65,
    bottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },

  headerText: {
    fontSize: 35,
    fontWeight: '800',
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
