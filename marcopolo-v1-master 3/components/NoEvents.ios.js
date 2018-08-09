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
import {Button} from 'native-base';

import {
  Entypo,
  Ionicons,
  Feather,
  Octicons,
  MaterialCommunityIcons,
  FontAwesome
} from '@expo/vector-icons';
import {addOrgLike} from './helper';
const buttonProps = {
  size: 20,
  color: 'white',
  padding: 5
};

const FeaturedCard=props=>{
  let {image,type,name,time, date, tagline, initial,interested,...rest}=props;

  return (
    <Card {...rest} backgroundImage={image}>
      <Text style={styles.cardNameText}>{name}</Text>

    </Card>
  );
};

const textShadow = {
  textShadowOffset: {
    height: 0.1,
  },
  textShadowColor:'rgba(0,0,0,0.3)',
  textShadowRadius:5,
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
    paddingTop: 10,
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
  cardContent: {
     flex:1,
     flexDirection: 'column',
     justifyContent: 'flex-end',
  },
  cardDescriptionText: {
    fontSize: 14,
    marginLeft: -10,
    paddingLeft: 25,
    fontWeight: '700',
    backgroundColor: 'white',
    height: 60,
    width: 500,
    flexDirection: 'row',
    borderColor: 'white'
  },
  interestedStyle: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 1000,
  },
});

export default FeaturedCard;
