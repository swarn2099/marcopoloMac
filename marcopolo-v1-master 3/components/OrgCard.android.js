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
import {ListItem, Button, Input,  } from 'react-native-elements'

import {
  Entypo,
  Ionicons,
  Feather,
  Octicons,
  MaterialCommunityIcons,
  FontAwesome
} from '@expo/vector-icons';
import {subscribeToOrg} from './helper';
const buttonProps = {
  size: 20,
  color: 'white',
};

const OrgCard = props => {
  let { image, type, name, tagline, date, interested, author, ...rest } = props;

  return (
    <Card {...rest} backgroundImage={image}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
    <Text style={styles.cardNameText}>{name}</Text>
      </View>
      <View style={styles.cardContent}>
      <View style={{flexDirection:'row'}}>
        <View style={{ paddingBottom: 10}}>
        <Button
          ViewComponent={require('expo').LinearGradient}
          linearGradientProps={{
          colors: ['#FF9800', '#F44336'],
          start: [1, 0],
          end: [0.2, 0],
          }}
          buttonStyle={{borderRadius: 10, marginLeft: 250, marginRight: 0, marginTop: 30, height: 40, width: 100 }}
          title="Subscribe"
          onPress={()=>subscribeToOrg(author)}          />
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
  textShadowColor: 'rgba(0, 0, 0, 0.3)',
  textShadowRadius: 5,
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
    paddingLeft: 20
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

export default OrgCard;
