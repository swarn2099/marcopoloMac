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
import {addOrgLike, addRandomPost} from './helper';
const buttonProps = {
  size: 20,
  color: 'white',
  padding: 5
};

const FeaturedCard=props=>{
  let {image,type,name,time,date,initial,kind,tagline,interested,...rest}=props;

  return (
    <Card {...rest} backgroundImage={image}>
    <View style={{flexDirection:'row',justifyContent:'space-between',}}>
      <Text style={styles.cardTypeText}>{(type || '').toUpperCase()}</Text>
       </View>
      <Text style={styles.cardNameText}>{name}</Text>
      <View style={styles.cardContent}>
      <View style={{flexDirection:'row'}}>
        <Text style={styles.cardDescriptionText}>{tagline}</Text>
        <View style={{backgroundColor:'white',width:200,width: 200, paddingLeft: 50, paddingTop: 6}}>

        <Button rounded style={{padding:25}}onPress={()=>addOrgLike(kind, initial)}><Feather name="thumbs-up"{...buttonProps}/></Button>

        </View>
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
  },
  cardNameText: {
    ...textShadow,
    marginTop: 7,
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
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
    backgroundColor: 'white',
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

export default FeaturedCard;
