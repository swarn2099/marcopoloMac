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

import DiscoverCard from '../components/DiscoverCard';
import Carousel, {Pagination} from 'react-native-snap-carousel';
const ImpactStyles={
  'Light':'light',
  'Medium':'medium',
  'Heavy':'heavy',
}
const NotificationTypes={
  'Success':'success',
  'Warning':'warning',
  'Error':'error',
}


export default class Featured extends React.Component{
    static navigationOptions={
      header:null,
    };
    constructor(props){
      super();
      this.state={
      errors:[],
      }
      this._carousel={};
      this.init();
    }




    init(){

        this.state={

        topLevel:[
          {
           tagline:"Subscribe to Organizations here",
           thumbnail: require ('../assets/images/organization.jpg'),
           title:"Organizations",
           next:"Organizations"
         },{
            tagline:"Check events you've been invited too",
            thumbnail: "https://media.giphy.com/media/nPIwhYMeBkis0/giphy.gif",
            title:" Private Events",
            next:'PrivateScreen',
          },
          {
            tagline:"Best food, tech, and fashion deal of the day - Coming Soon",
            thumbnail: require ('../assets/images/deals.gif'),
            title:"Deal of the Day",
            next:"http://swarn2099.github.io/Pool"
          },
        ],
        bottomLevel:[

        {
         tagline:"Click here to find the free item of the week",
         thumbnail: require ('../assets/images/entertainment.gif'),
         title:"Entertainment",
         next:"CategoryScreen"
       },
       {
        tagline:"Click here to find the free item of the week",
        thumbnail: require ('../assets/images/party.gif'),
        title:"Parties",
        next:"CategoryScreen"
      },
       {
        tagline:"Click here to find the free item of the week",
        thumbnail: require ('../assets/images/free.gif'),
        title:"Free",
        next:"CategoryScreen"
      },
       {
        tagline:"Click here to find the free item of the week",
        thumbnail: require ('../assets/images/sports.gif'),
        title:"Sports",
        next:"CategoryScreen"
      },
      {
       tagline:"Click here to find the free item of the week",
       thumbnail: require ('../assets/images/food.gif'),
       title:"Food",
       next:"CategoryScreen"
     },

        ]
      };
    }
    handleSnapToItem(index){}
    _renderItem=({item,index})=>{
      return(

      <DiscoverCard
      image={item.thumbnail}
      name={item.title}
      tagline={item.tagline}
      cardStyle={{height:250}}
      onPress={()=>this.props.navigation.navigate(item.next, {filter: item.title})}
      />
      );
    }
    _renderItem2=({item,index})=>{

      return(

      <DiscoverCard
      image={item.thumbnail}

      name={item.title}
      tagline={item.tagline}
      cardStyle={{height:320}}
      onPress={()=>this.props.navigation.navigate(item.next, {filter: item.title})}
      />
      );
    }
    get pagination(){
        const{topLevel,activeSlide=0,}=this.state;
        return(
            <Pagination
              dotsLength={topLevel.length}
              activeDotIndex={activeSlide}
              containerStyle={{backgroundColor:'white'}}
              dotStyle={{
                  width:10,
                  height:10,
                  borderRadius:5,
                  marginHorizontal:8,
                  backgroundColor:'black'
              }}
              inactiveDotStyle={{
                backgroundColor:'black'
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.8}
            />
        );
    }
    render=()=>{


      return(
        <SafeAreaView style={styles.container} forceInset={{top:'always'}}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ScreenHeader title="Discover" location={this.props.screenProps.location}/>
            <View style={styles.cardList}>
              <View style={styles.cardList2}>
                <Carousel
                  ref={(c)=>{this._carousel=c;}}
                  data={this.state.topLevel}
                  renderItem={this._renderItem.bind(this)}
                  onSnapToItem={(index)=>this.setState({activeSlide:index})}
                  sliderWidth={360}
                  itemWidth={300}
                  layout={'stack'}
                  layoutCardOffset={18}
                  firstItem={0}
                  autoplay={true}
                  autoplayInterval={4000}
                  loop={true}
                />{this.pagination}
              </View>

              <Carousel
                ref={(c)=>{this._carousel=c;}}
                data={this.state.bottomLevel}
                renderItem={this._renderItem2.bind(this)}
                onSnapToItem={this.handleSnapToItem.bind(this)}
                sliderWidth={360}
                itemWidth={300}
                layout={'default'}
                firstItem={1}
                autoplay={true}
                autoplayInterval={3000}
                loop={false}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
  },
  contentContainer:{
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
