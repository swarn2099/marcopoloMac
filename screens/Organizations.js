import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Linking,
  LayoutAnimation,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { WebBrowser, Permissions, Location, Haptic } from 'expo';
import * as firebase from 'firebase';
require("firebase/firestore");
import MainTabNavigator from '../navigation/MainTabNavigator';
import {StackNavigator} from 'react-navigation';
import ScreenHeader from '../components/ScreenHeader';
import moment from 'moment';
import geodist from 'geodist';
import sleep from 'await-sleep';
import PoolCards from '../components/PoolCards';
import Carousel, { Pagination } from 'react-native-snap-carousel';
const ImpactStyles = {
  'Light': 'light',
  'Medium': 'medium',
  'Heavy': 'heavy',
}
const NotificationTypes = {
  'Success': 'success',
  'Warning': 'warning',
  'Error': 'error',
}


export default class Featured extends React.Component {
    static navigationOptions = {
      header: null,
    };
    constructor(props){
      super();
      this.state = {
        data: [],
        event: -1,
        events: [],
      }
      this._carousel = {};
    }
    async componentWillMount(){

      firebase.firestore().collection('stories').get().then((snap) => {
        items = snap.docs.reduce((res, item) => ({ ...res, [item.id]: item.data()}), {});
        events = Object.keys(items || {})
          .map(id => {
            let event = items[id];
            return {
              ...event,
              id,
              name: event.name,
              interested: event.population,
              featured: event.featured,
              type: event.category,
              image: event.imageURL && event.imageURL.length > 0 && {
                uri: event.imageURL
              },
              tagline: event.tagline,
              interested: event.population,
              date: event.date,
              sponsored: event.sponsored,
              city: event.city,
            }
          })
      });
      await sleep(500);

      this.setState(() => ({
        refreshing: false,
        events,
      }));
      console.log(events);
      this.setState(() => ({ data: events }))

    }



    handleSnapToItem(index){
    }
    _renderItem2 = ( {item,  index} ) => {

      return (

      <PoolCards
      image={item.imageURL}
      name={item.name}
      tagline={item.tagline}
      cardStyle={{ height: 425 }}
      />

      );
    }
    get pagination () {
        const { topLevel, activeSlide = 0,} = this.state;
        return (
            <Pagination
              dotsLength={topLevel.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'white' }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'black'
              }}
              inactiveDotStyle={{
                backgroundColor: 'black'
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.8}
            />
        );
    }
    render = () => {
      const { data } = this.state

      if(!data){
        console.log("no data")
}
      return (
        <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <ScreenHeader title="Pool" location={this.props.screenProps.location}/>

            <View style={styles.cardList}>

              <Carousel
                ref={ (c) => { this._carousel = c; } }
                data={data}
                renderItem={this._renderItem2.bind(this)}
                onSnapToItem={this.handleSnapToItem.bind(this)}
                sliderWidth={360}
                itemWidth={300}
                itemHeight={1000}

                layout={'default'}
                firstItem={0}
                autoplay={true}
                autoplayInterval={2000}
              />


            </View>
          </ScrollView>
        </SafeAreaView>

      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
  },
  cardList: {
    marginLeft: -20,
  },
  cardList2: {
    paddingBottom: 20,
  },

});
