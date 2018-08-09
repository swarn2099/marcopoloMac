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
      <View style={styles.cardContent}>
      <View style={{flexDirection:'row'}}>
        <Text style={styles.cardDescriptionText}>{tagline}</Text>
        </View>
      </View>
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
    marginLeft: 0,
    paddingLeft: 15,
    paddingTop: 8,
    fontWeight: '500',
    backgroundColor: 'white',
    height: 60,
    flexDirection: 'row',
    borderColor: 'white'
  },
});

export default FeaturedCard;
