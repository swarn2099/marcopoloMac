import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  LayoutAnimation,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { WebBrowser, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
require("firebase/firestore");
import {FormLabel, FormInput, ButtonGroup} from 'react-native-elements';

import moment from 'moment';
import geodist from 'geodist';
import sleep from 'await-sleep';

import ScreenHeader from '../components/ScreenHeader';
import FeaturedCard from '../components/FeaturedCard';
import EventDescription from '../components/EventDescription';

const spring = LayoutAnimation.Presets.spring;
const animConfig = {
  ...spring,
  update: {
    ...spring.update,
    springDamping: 0.725,
  },
};

export default class Featured extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 5,
      loading: true,
      refreshing: false,
      events: [],
      event: -1,
      eventScale: new Animated.Value(1),
      prepare: false,
      open: false,
      isAnimating: false,
      dimensions: {},
    };
    this.updateIndex = this.updateIndex.bind(this);
    this._eventRefs = [];
    this.refresh = this.refresh.bind(this);
    this.refreshPull = this.refreshPull.bind(this);

    this.fetchTodayEvents = this.fetchTodayEvents.bind(this);
    this.onCardPressIn = this.onCardPressIn.bind(this);
    this.onCardPressOut = this.onCardPressOut.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    let { index, location, locationLoaded } = nextProps.screenProps;
this.state.index === 5;
    if (index) {
      await this.updateIndex(index);

      this.setState(() => ({
        loading: false,
      }));
    }
  }
  refreshPull() {
    let { location, locationLoaded } = this.props.screenProps;
    if (locationLoaded) {
      this.fetchTodayEvents(location);
    }
  }
  refresh(index) {
    let { locationLoaded } = this.props.screenProps;

    if (locationLoaded) {
      this.updateIndex(index);
    }
  }

  async fetchTodayEvents(location = null) {
    this.setState(() => ({
      refreshing: true,
    }));

    let allCities = true;
    let allowedCities = [];
    let coords;

    if (location) {
      allCities = false;
      coords = location.coords;
    }

    if (!allCities) {
      let citiesData = await firebase
        .database()
        .ref('Cities')
        .once('value');

      let cities = citiesData.val();
      allowedCities = Object.keys(cities)
        .map(id => {
          let city = cities[id];
          return {
            id,
            ...city,
          };
        })
        .filter(c =>
          geodist(
            {
              latitude: c.latitude,
              longitude: c.longitude,
            },
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            { exact: true, limit: 60 }
          )
        )
        .map(c => c.name);

      allCities = allCities || allowedCities.length === 0;
    }

    firebase.firestore().collection('approvedEvents').get().then((snap) => {
      itemsToday = snap.docs.reduce((resToday, itemToday) => ({ ...resToday,
        [itemToday.id]: itemToday.data()
      }), {});
      this.setState({itemsToday})
      console.log(itemsToday);
      events = Object.keys(itemsToday || {})
        .map(id => {
          let event = itemsToday[id];
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
            tagline: event.startTime + ' | ' + event.endTime,
            interested: event.population,
            date: event.date,
            sponsored: event.sponsored,
            city: event.city,
          }
        })
        .filter(e => moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day') && (allCities || !e.city || allowedCities.includes(e.city)));

    });
    await sleep(500);

    this.setState(() => ({
      refreshing: false,
      events,
    }));
  }

  onCardPressIn(id) {
    let animation = Animated.spring(this.state.eventScale, {
      toValue: 0.95,
    });

    this.setState(
      () => ({
        event: id,
      }),
      () => animation.start()
    );
  }

  onCardPressOut(id) {
    let animation = Animated.spring(this.state.eventScale, {
      toValue: 1,
    });

    this.setState(
      () => ({
        event: id,
      }),
      () => {
        animation.start();
      }
    );
  }

  onCardPress(id) {
    this._eventRefs[id]
      .getNode()
      .measure((sX, sY, width, height, pageX, pageY) => {
        this.setState(
          () => ({
            event: id,
            prepare: true,
            dimensions: {
              pageX,
              pageY,
              width,
              height,
            },
          }),
          () => {
            setTimeout(() => {
              LayoutAnimation.configureNext(animConfig, () =>
                this.setState(() => ({
                  isAnimating: false,
                }))
              );
              this.props.screenProps.setStatusBarVisibility(false);
              this.props.screenProps.setTabsVisibility(false);

              this.setState(() => ({
                open: true,
                isAnimating: true,
              }));
            }, 0);
          }
        );
      });
  }

  closeCard() {
    this._eventRefs[this.state.event]
      .getNode()
      .measure((x, y, width, height, pageX, pageY) => {
        LayoutAnimation.configureNext(animConfig, () => {
          this.setState(() => ({
            event: -1,
            prepare: false,
            isAnimating: false,
          }));
        });
        this.props.screenProps.setStatusBarVisibility(true);
        this.props.screenProps.setTabsVisibility(true);

        this.setState(() => ({
          open: false,
          isAnimating: true,
          dimensions: {
            pageX,
            pageY,
            width,
            height,
          },
        }));
      });
      this.updateIndex(this.state.index);
  }

  eventRef(i, ref) {
    this._eventRefs[i] = ref;
  }

  updateIndex(index){
     this.setState({index})
     if(index === 0){
       firebase.firestore().collection('approvedEvents').get().then((snap) => {
             itemsFree = snap.docs.reduce((resFree, itemFree) => ({ ...resFree,
               [itemFree.id]: itemFree.data()
             }), {});
             this.setState({
               itemsFree
             })
             events = Object.keys(itemsFree)
               .map(id => {
                 let event = itemsFree[id];
                 return {
                   ...event,
                   id,
                   name: event.name,
                   type: event.category,
                   image: event.imageURL && event.imageURL.length > 0 && {
                     uri: event.imageURL
                   },
                   interested: event.population,

                   tagline: event.startTime + ' | ' + event.endTime,
                   date: event.date,
                   sponsored: event.sponsored,
                   city: event.city,
                 }
               })
               .filter(e => e.category === 'Free' && moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day'));
               this.setState(() => ({
                 refreshing: false,
                 events,
                 index
               }));

       });
     }
     if(index === 1){
       firebase.firestore().collection('approvedEvents').get().then((snap) => {
         itemsFood = snap.docs.reduce((resFood, itemFood) => ({ ...resFood,
           [itemFood.id]: itemFood.data()
         }), {});
         this.setState({itemsFood })
         events = Object.keys(itemsFood  || {})
           .map(id => {
             let event = itemsFood [id];
             return {
               ...event,
               id,
               name: event.name,
               type: event.category,
               interested: event.population,

               image: event.imageURL && event.imageURL.length > 0 && {
                 uri: event.imageURL
               },
               tagline: event.startTime + ' | ' + event.endTime,
               date: event.date,
               sponsored: event.sponsored,
               city: event.city,
             }
           })
           .filter(e => e.category === 'Food' && moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day')  );
           this.setState(() => ({
             refreshing: false,
             events,
             index,
           }));
       });
     }
     if(index === 2){
       firebase.firestore().collection('approvedEvents').get().then((snap) => {
         itemsMusic= snap.docs.reduce((resMusic, itemMusic) => ({ ...resMusic,
           [itemMusic.id]: itemMusic.data()
         }), {});
         this.setState({itemsMusic})
         events = Object.keys(itemsMusic || {})
           .map(id => {
             let event = itemsMusic[id];
             return {
               ...event,
               id,
               name: event.name,
               type: event.category,
               image: event.imageURL && event.imageURL.length > 0 && {
                 uri: event.imageURL
               },
               interested: event.population,

               tagline: event.startTime + ' | ' + event.endTime,
               date: event.date,
               sponsored: event.sponsored,
               city: event.city,
             }
           })
           .filter(e => e.category === 'Music' && moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day')  );
           this.setState(() => ({
             refreshing: false,
             events,
           }));
       });
     }
     if(index === 3){
       firebase.firestore().collection('approvedEvents').get().then((snap) => {
         itemsParties = snap.docs.reduce((resParties, itemParties) => ({ ...resParties,
           [itemParties.id]: itemParties.data()
         }), {});
         this.setState({itemsParties})
         events = Object.keys(itemsParties || {})
           .map(id => {
             let event = itemsParties[id];
             return {
               ...event,
               id,
               name: event.name,
               type: event.category,
               interested: event.population,

               image: event.imageURL && event.imageURL.length > 0 && {
                 uri: event.imageURL
               },
               tagline: event.startTime + ' | ' + event.endTime,
               date: event.date,
               sponsored: event.sponsored,
               city: event.city,
             }
           })
           .filter(e => e.category === 'Parties' && moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day')  );
           this.setState(() => ({
             refreshing: false,
             events,
           }));
       });
     }
     if(index === 4){
       firebase.firestore().collection('approvedEvents').get().then((snap) => {
         itemsClub = snap.docs.reduce((resClub, itemClub) => ({ ...resClub,
           [itemClub.id]: itemClub.data()
         }), {});
         this.setState({itemsClub})
         events = Object.keys(itemsClub || {})
           .map(id => {
             let event = itemsClub[id];
             return {
               ...event,
               id,
               name: event.name,
               type: event.category,
               interested: event.population,

               image: event.imageURL && event.imageURL.length > 0 && {
                 uri: event.imageURL
               },
               tagline: event.startTime + ' | ' + event.endTime,
               date: event.date,
               sponsored: event.sponsored,
               city: event.city,
             }
           })
           .filter(e => e.category === 'Club' && moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day')  );
           console.log(events);
           this.setState(() => ({
             refreshing: false,
             events,
           }));
       });
     }
     if(index === 5){
       firebase.firestore().collection('approvedEvents').get().then((snap) => {
         itemsAll = snap.docs.reduce((resAll, itemAll) => ({ ...resAll,
           [itemAll.id]: itemAll.data()
         }), {});
         this.setState({itemsAll})
         events = Object.keys(itemsAll || {})
           .map(id => {
             let event = itemsAll[id];
             return {
               ...event,
               id,
               name: event.name,
               interested: event.population,

               type: event.category,
               image: event.imageURL && event.imageURL.length > 0 && {
                 uri: event.imageURL
               },
               tagline: event.startTime + ' | ' + event.endTime,
               date: event.date,
               sponsored: event.sponsored,
               city: event.city,
             }
           })
           .filter(e =>moment().isSame(moment(e.date, 'MMMM D, YYYY'), 'day')  );
           this.setState(() => ({
             refreshing: false,
             events,
           }));
       });
     }
   }
  render() {
    let {
      events,
      event,
      eventScale,
      prepare,
      open,
      isAnimating,
      dimensions,
      refreshing,
      loading,
    } = this.state;


    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          pointerEvents={prepare || open ? 'none' : 'auto'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.refreshPull} />
          }
        >
          <ScreenHeader
            title="Today"
            location={this.props.screenProps.location}
          />
          <ButtonGroup
            selectedButtonStyle={{borderRadius: 2}, {backgroundColor: "#48baa3"}}
            selectedTextStyle={{color: "#fff"}}
            textStyle={{fontSize: 12}}
            onPress={this.updateIndex}
            selectedIndex={this.state.index}
            buttons={['Free', 'Food', 'Music', 'Parties', 'Org', 'All']}
            containerStyle={{height: 100}, {backgroundColor: "#fff"}, {borderRadius: 15}}
            containerBorderRadius={2} />
          <View style={styles.cardList}>
            {events.length > 0
              ? events.map((e, i) => (
                  <Animated.View
                    key={e.id}
                    ref={r => this.eventRef(i, r)}
                    style={[
                      styles.animatedCard,
                      event == i && { transform: [{ scale: eventScale }] },
                      event == i && prepare && { opacity: 0 },
                    ]}
                  >
                    <FeaturedCard
                    name={e.name}
                    type={e.category}
                    image={e.imageURL}
                    tagline={e.startTime + ' | ' + e.endTime}
                    sponsored={e.sponsored}
                    interested={e.interested}
                    cardStyle={{ height: 300 }}
                    onPressIn={() => this.onCardPressIn(i)}
                    onPressOut={() => this.onCardPressOut(i)}
                    onPress={() => this.onCardPress(i)}
                    shadow
                    />
                  </Animated.View>
                ))
              : !loading && (
                  <FeaturedCard
                    name="No Featured Events"
                    type="Uh oh"
                    tagline="Check back soon!"
                    image={require('../assets/images/nothing-found.gif')}
                    cardStyle={{ height: 350 }}
                    shadow
                  />
                )}
          </View>
        </ScrollView>
        {event >= 0 &&
          prepare && (
            <EventDescription
              event={events[event]}
              open={open}
              isAnimating={isAnimating}
              dimensions={dimensions}
              close={this.closeCard}
            />
          )}
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
    marginTop: 10,
  },
  animatedCard: {
    marginBottom: 35,
  },
});
