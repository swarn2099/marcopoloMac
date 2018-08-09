import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Share,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import {  showLocation } from 'react-native-map-link';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import FeaturedCardOpen from './FeaturedCardOpen';
import {Button} from 'native-base';
import {addRandomPost} from './helper';
import { Notifications, Haptic, Constants, Permissions,} from 'expo';

import {
  Entypo,
  Ionicons,
  Feather,
  Octicons,
  MaterialCommunityIcons,
  FontAwesome
} from '@expo/vector-icons';
const buttonProps = {
  size: 25,
  color: 'white',
  padding: 5

};
const localNotification={};
const title={};
const body={};
const schedulingOptions={};
const time={};

multipleFunction =() =>{
  Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
  Alert.alert(
    'Notification Set',
    'You will get a notifcation when this event starts',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
}
const EventDescription=props=>(
  title=props.event.name,
  body=props.event.name,
  data=props.event.name,

  time = new Date(props.event.date + ' ' +props.event.startTime),

localNotification={title,body,data},
console.log(time),
schedulingOptions={time},
  <View style={[styles.container,!props.isAnimating && props.open && {backgroundColor:'#fff'},]}>
    <ScrollView contentContainerStyle={props.isAnimating && styles.content} scrollEnabled={!props.isAnimating}>
      <FeaturedCardOpen
        name={props.event.name}
        type={props.event.type}
        image={props.event.image}
        interested={props.event.interested}
        cardStyle={[
          props.open &&
            ifIphoneX({
              paddingTop: 50,
            }),
          Platform.OS === 'android' && {
            paddingTop: 35,
          },
          props.open
            ? styles.header
            : {
                position: 'absolute',
                top: props.dimensions.pageY,
                left: props.dimensions.pageX,
                width: props.dimensions.width,
                height: props.dimensions.height,
              },
          { height: props.height || props.dimensions.height },
        ]}
      />

      <View
        style={[
          styles.description,
          !props.open && {
            position: 'absolute',
            top: props.dimensions.pageY + props.dimensions.height,
            left: props.dimensions.pageX,
            width: props.dimensions.width,
            height: 0,
            padding: 0,
            paddingBottom: 0,
          },
          ]}
      >
        <View style={styles.buttons}>
        <Button rounded
        style={{ backgroundColor: '#27AEA6', borderRadius: 50, padding: 10 }}
        textStyle={{ color: '#fff' }}
        onPress={() =>showLocation({latitude: props.event.latCoord, longitude: props.event.longCoord})}>
        <Entypo name="map" {...buttonProps} />
        </Button>
        <Button rounded
        style={{ backgroundColor: '#2F80ED', borderRadius: 100, padding: 10}}
        textStyle={{ color: '#fff' }}
        onPress={() => Linking.openURL(props.event.link)}
        >
        <Feather name="info" {...buttonProps} />
        </Button>
        <Button rounded
        style={{ backgroundColor: '#e23d50', borderRadius: 50, padding: 10 }}
        textStyle={{ color: '#fff' }}
        onPress={() => multipleFunction()}>
        <FontAwesome name="bell" {...buttonProps} />
        </Button>
        <Button rounded
        style={{ borderRadius: 50, padding: 10 }}
        textStyle={{ color: '#fff' }}
        onPress={() => addRandomPost(props.event.name)}
        >
        <Feather name="thumbs-up" {...buttonProps} />
        </Button>
          <Button rounded
          style={{ backgroundColor: '#383838', borderRadius: 100, padding: 10 }}
          textStyle={{ color: '#fff' }}
          onPress={() =>
            Share.share({
              title: 'Check out this Event',
              message: `Check out this event on marco/polo! "${props.event.name}"`,
              url: 'http://getmarcopolo.co/',
            })
          }
          >
          <Feather name="share" {...buttonProps} />
          </Button>
      </View>
      <View style={{flex: 1, flexDirection: 'column'}}>
      <Text style={{fontSize: 30, fontWeight: '800', paddingBottom: 15}}>About the Event</Text>
      <Text style={styles.logistics}>{props.event.time}</Text>
      <Text style={styles.logistics}>{props.event.date}</Text>
      <Text style={styles.logistics}>{props.event.location}</Text>

        <Markdown style={markdownStyles}>
          {`\n\n\n${props.event.description}`}
        </Markdown>
        </View>
      </View>
    </ScrollView>
    <TouchableWithoutFeedback onPress={props.close}>
      <View
        style={[
          styles.closeButton,
          !props.open && { opacity: 0 },
          ifIphoneX({
            right: 30,
          }),
          Platform.OS === 'android' && {
            top: 35,
          },
        ]}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
);

const markdownStyles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  strong: {
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    flex: 0,
    borderRadius: 0,
  },
  logistics:{
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    justifyContent: 'flex-end'
  },
  description: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    padding: 20,
    paddingBottom: 40,
  },
  closeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    borderRadius: 12,
    position: 'absolute',
    top: 15,
    right: 15,
    opacity: 0.85,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 10,
    fontWeight: '900',
  },
  buttons: {
    marginBottom: 20,
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOffset: {width: 1}
  },
});

export default EventDescription;
