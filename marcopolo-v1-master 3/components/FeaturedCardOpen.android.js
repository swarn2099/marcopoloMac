import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Card from './Card';
import Button from './Button';

import {
  Entypo,
  Ionicons,
  Feather,
  Octicons,
  MaterialCommunityIcons,
  FontAwesome
} from '@expo/vector-icons';
import {addRandomPost} from './helper';
const buttonProps = {
  size: 20,
  color: 'white',
};

const FeaturedCardOpen = props => {
  let { image, type, name, time, date, interested, link, ...rest } = props;

  return (
    <Card {...rest} backgroundImage={image}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
      <Text style={styles.cardTypeText}>{(type || '').toUpperCase()}</Text>
      </View>
      <Text style={styles.cardNameText}>{name}</Text>
      <View style={styles.cardContent}>
      <View style={{flexDirection:'row'}}>
        </View>
      </View>
    </Card>
  );
};

const textShadow = {
  textShadowOffset: {
    height: 0.1,
  },
  textShadowColor: 'rgba(0, 0, 0, 0.3)',
  textShadowRadius: 5,
};

const styles = StyleSheet.create({
  cardTypeText: {
    ...textShadow,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 10
  },
  cardInterestedText: {
    ...textShadow,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 20,
    paddingRight: 10
  },
  cardNameText: {
    ...textShadow,
    marginTop: 7,
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    paddingLeft: 10
  },
  cardNameText: {
    ...textShadow,
    marginTop: 7,
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    paddingLeft: 10
  },
  cardContent: {
     flex:1,
     flexDirection: 'column',
     justifyContent: 'flex-end',
  },
  cardDescriptionText: {
    fontSize: 16,
    marginLeft: -20,
    paddingTop: 20,
    paddingLeft: 25,
    fontWeight: '700',
    color: 'white',
    height: 60,
    flexDirection: 'row',



  },
  interestedStyle: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',

    borderRadius: 1000,

  },

});

export default FeaturedCardOpen;
