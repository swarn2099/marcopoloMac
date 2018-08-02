import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
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
        errors: [],
      }
      this._carousel = {};
      this.init();
    }
    init(){
      this.state = {
        topLevel: [
          {
            tagline: "Read Stories written by Students",
            thumbnail: "https://wallpaper.wiki/wp-content/uploads/2017/05/wallpaper.wiki-Download-HD-Resolution-Desktop-Photos-PIC-WPE004120.png",
            title: "Stories",
            next: 'OrginalStory',
          }, {
            tagline: "News and Tips from around campus",
            thumbnail: "https://media.giphy.com/media/d2Z3DHCDq68eUNHO/giphy.gif",
            title: "Breaking News",
            next: 'OrginalStory',

          }, {
            tagline: "Choose the events you would like to go to",
            thumbnail:' ../assets/images/icon.png',
            title: "Coming Up",
            next: 'OrginalStory',
          }
        ],
        bottomLevel: [
          {
            tagline: "Add your own events to marcopolo",
            thumbnail: "https://media0.giphy.com/media/kvtv0fjxtw93O/giphy.gif",
            title: "Add Events",
            next: "http://swarn2099.github.io/Pool"
          }, {
            tagline: "See what your favorite organizations are up to",
            thumbnail: "https://i.imgur.com/CEJPaGl.jpg",
            title: "Organizations",
            next: 'Organizations'
          }, {
            tagline: "Deals of the Week",
            thumbnail: "https://i.pinimg.com/originals/5a/15/55/5a155500a5dab6ddc6c04f4f983cddf9.gif",
            title: "Deals"
          }
        ]
      };
    }

    handleSnapToItem(index){}

    _renderItem = ( {item, index} ) => {

      return (

      <PoolCards
      image={item.thumbnail}
      name={item.title}
      tagline={item.tagline}
      cardStyle={{ height: 300 }}
      onPress={() => this.props.navigation.navigate(item.next)}
      />

      );
    }
    _renderItem2 = ( {item, index} ) => {

      return (

      <PoolCards
      image={item.thumbnail}
      name={item.title}
      tagline={item.tagline}
      cardStyle={{ height: 425 }}
      onPress={() => this.props.navigation.navigate(item.next)}
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


      return (
        <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ScreenHeader title="Pool" location={this.props.screenProps.location}/>
            <View style={styles.cardList}>
              <View style={styles.cardList2}>
                <Carousel
                  ref={ (c) => { this._carousel = c; } }
                  data={this.state.topLevel}
                  renderItem={this._renderItem.bind(this)}
                  onSnapToItem={(index) => this.setState({ activeSlide: index })}
                  sliderWidth={360}
                  itemWidth={300}
                  layout={'stack'}
                  layoutCardOffset={18}
                  firstItem={0}
                  autoplay={true}
                  autoplayInterval={4000}
                  loop={true}
                />  { this.pagination }
              </View>

              <Carousel
                ref={ (c) => { this._carousel = c; } }
                data={this.state.bottomLevel}
                renderItem={this._renderItem2.bind(this)}
                onSnapToItem={this.handleSnapToItem.bind(this)}
                sliderWidth={360}
                itemWidth={300}
                layout={'default'}
                firstItem={0}
                autoplay={true}
                autoplayInterval={2000}
                loop={true}
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
