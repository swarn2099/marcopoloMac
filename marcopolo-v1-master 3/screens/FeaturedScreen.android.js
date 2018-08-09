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
  UIManager,
  SafeAreaView,
  BackHandler,
  LayoutAnimation,
  StatusBar,
  RefreshControl,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
import { WebBrowser, Permissions, Location, Haptic, Notification } from 'expo';
import * as firebase from 'firebase';
require("firebase/firestore");
import moment from 'moment';
import geodist from 'geodist';
import sleep from 'await-sleep';
import ScreenHeader from '../components/ScreenHeader';
import PoolCard from '../components/PoolCard';
import NoEvents from '../components/NoEvents';
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

    this._eventRefs = [];
    this.refresh = this.refresh.bind(this);
    this.fetchFeaturedEvents = this.fetchFeaturedEvents.bind(this);
    this.onCardPressIn = this.onCardPressIn.bind(this);
    this.onCardPressOut = this.onCardPressOut.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.closeCard = this.closeCard.bind(this);
    this.onBackButtonPress = this.onBackButtonPress.bind(this);
  }

      componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
      }

      onBackButtonPress() {
        let { routeName } = this.props.navigation.state;
        if (routeName.toLowerCase().trim() === 'featured') {
          if (this.state.open) {
            this.closeCard();
          } else {
            BackHandler.removeEventListener('backPress');
          }
        }
        return true;
      }
  async componentWillReceiveProps(nextProps) {
    let { location, locationLoaded } = nextProps.screenProps;
    if (locationLoaded) {
       this.fetchFeaturedEvents(location);
      this.setState(() => ({
        loading: false,
      }));
    }
  }

  refresh() {
    let { location, locationLoaded } = this.props.screenProps;
    if (locationLoaded) {
       this.fetchFeaturedEvents(location);
    }
  }

  async fetchFeaturedEvents(location = null) {
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
      let citiesData = await firebase.database().ref('Cities').once('value');
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

     await firebase.firestore().collection('approvedEvents').get().then((snap) => {
          itemsAll = snap.docs.reduce((resAll, itemAll) => ({ ...resAll,
            [itemAll.id]: itemAll.data()
          }), {});
          this.setState({
            itemsAll
          })
          events = Object.keys(itemsAll)
            .map(id => {
              let event = itemsAll[id];
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
                initial: event.id,
                time: event.startTime + ' to ' + event.endTime,
                startTime: event.startTime,
                endTime: event.endTime,
                date: event.date,
                interested: event.population,
                date: event.date,
                sponsored: event.sponsored,
                city: event.city,
                location: event.location,
                info: event.info
              }
            })
        .filter(e => e.featured === true && moment().isSame(moment(e.date, 'MMM DD, YYYY'), 'day') && (allCities || !e.city || allowedCities.includes(e.city)));

    });

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
                  isAnimating: false,
                }));
              }, 1);
            }
          );
        });
    }

    closeCard() {
      this._eventRefs[this.state.event]
        .getNode()
        .measure((x, y, width, height, pageX, pageY) => {
          this.setState(() => ({
            event: -1,
            prepare: false,
          }));

          this.props.screenProps.setStatusBarVisibility(true);
          this.props.screenProps.setTabsVisibility(true);

          this.setState(() => ({
            open: false,
            dimensions: {
              pageX,
              pageY,
              width,
              height,
            },
            isAnimating: false,
          }));
        });
    }

  eventRef(i, ref) {
    this._eventRefs[i] = ref;
  }

    render() {
      let {
        events,
        event,
        eventScale,
        prepare,
        open,
        dimensions,
        isAnimating,
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
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.fetchFeaturedEvents }
              />
            }
          >
            <ScreenHeader
              title="Traveler Picks"
              location={this.props.screenProps.location}
            />

            <View style={styles.cardList}>
              {events.length > 0
                ? events.map((e, i) => (
                    <Animated.View
                      key={e.id}
                      ref={r => this.eventRef(i, r)}
                      style={[
                        styles.animatedCard,
                        event == i&&{ transform: [{ scale: eventScale }] },
                        event == i&&prepare && { opacity: 0 },
                      ]}
                    >
                      <PoolCard
                      name={e.name}
                      type={e.category}
                      image={e.imageURL}
                      date={moment(e.date).format("MMM, Do")}
                      tagline={e.startTime + ' to ' + e.endTime}
                      time={e.startTime + ' to ' + e.endTime}
                      initial={e.initial}
                      info={e.info}
                      interested={e.interested}
                      location={e.location}
                      cardStyle={{ height: 400 }}
                      onPressIn={() => this.onCardPressIn(i)}
                      onPressOut={() => this.onCardPressOut(i)}
                      onPress={() => this.onCardPress(i)}
                      />
                    </Animated.View>
                  ))
                : !!loading && (
                  <NoEvents
                    name="Pull down to refresh"
                    type="Uh oh"
                    tagline="If no events appear, give the Travelers some time and they will update today's picks with the best events"
                    image={require('../assets/images/nothing-found.gif')}
                    cardStyle={{ height: 350 }}
                  />
                  )}
            </View>
            <Text style={{fontSize: 14, fontWeight: '800'}}>Pull Down to Refresh</Text>
          </ScrollView>
          {event >= 0 &&
            prepare && (
              <EventDescription
                open
                dimensions={dimensions}
                event={events[event]}
                close={this.closeCard}
                isAnimating={isAnimating}
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
