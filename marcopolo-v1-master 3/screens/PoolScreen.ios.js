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
import { WebBrowser, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
require("firebase/firestore");
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import moment from 'moment';
import geodist from 'geodist';
import sleep from 'await-sleep';
import {StackNavigator, SafeAreaView} from 'react-navigation';
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
const subscribedArray = [];
export default class Featured extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      // selectedIndex: 2,
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
    this.fetchFeed = this.fetchFeed.bind(this);
    this.onCardPressIn = this.onCardPressIn.bind(this);
    this.onCardPressOut = this.onCardPressOut.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    let { location, locationLoaded } = nextProps.screenProps;
    let result = await
    Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (locationLoaded) {
      await this.fetchFeed(location);

      this.setState(() => ({
        loading: false,
      }));
    }
  }
  refresh() {
    let { location, locationLoaded } = this.props.screenProps;

    if (locationLoaded) {
      this.fetchFeed();
    }
  }

  async fetchFeed() {
    this.setState(() => ({
      refreshing: true,
    }));

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    await firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(doc) {
        if (doc.exists) {
            subscribedArray = doc.data().subscribed;
            console.log(subscribedArray);
        }
    });

    await firebase.firestore().collection('orgEvents').get().then((snap) => {
      itemsFeed = snap.docs.reduce((resFeed, itemFeed) => ({ ...resFeed,
        [itemFeed.id]: itemFeed.data()
      }), {});
      this.setState({itemsFeed})
      events = Object.keys(itemsFeed || {})
        .map(id => {
          let event = itemsFeed[id];
          return {
            ...event,
            id,
            name: event.name,
            type: event.category,
            image: event.imageURL && event.imageURL.length > 0 && {
              uri: event.imageURL
            },
            interested: event.population,
            tagline: event.startTime + ' on ' + event.date,
            time: event.startTime + ' to ' + event.endTime,
            startTime: event.startTime,
            endTime: event.endTime,
            date: event.date,// August 5th 2018, 3:00:48 pm,
            initial: event.id,
            sponsored: event.sponsored,
            city: event.city,
            users: event.users,
            author: event.author,
            link: event.link,
            kind: event.kind
          }
        })
        .filter(e => subscribedArray.includes(e.author) && moment().isSameOrBefore(moment(e.date, 'MMM DD, YYYY'), 'day'));
        console.log(events.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)}))
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
  }

  eventRef(i, ref) {
    this._eventRefs[i] = ref;
  }


  onSwipeLeft(gestureState) {
    this.props.navigation.navigate('Featured')
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

    const config = {
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 70
        };

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          pointerEvents={prepare || open ? 'none' : 'auto'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.fetchFeed} />
          }
        >
        <GestureRecognizer
          onSwipeLeft={(state) => this.onSwipeLeft(state)}
          config={config}>
          <ScreenHeader
            title="Your Pool"
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
                      event == i && { transform: [{ scale: eventScale }] },
                      event == i && prepare && { opacity: 0 },
                    ]}
                  >
                  <PoolCard
                  name={e.name}
                  type={e.category}
                  image={e.imageURL}
                  date={moment(e.date).format("MMM, Do")}
                  tagline={e.startTime + ' on ' + moment(e.date).format("MMM Do")}
                  time={e.startTime + ' to ' + e.endTime}
                  interested={e.interested}
                  initial={e.initial}
                  location={e.location}
                  link={e.link}
                  kind={e.kind}
                  cardStyle={{ height: 300 }}
                  onPressIn={() => this.onCardPressIn(i)}
                  onPressOut={() => this.onCardPressOut(i)}
                  onPress={() => this.onCardPress(i)}
                  shadow
                  />
                  </Animated.View>
                ))
              : !loading && (
                <NoEvents
                  name="No Subscribed Events"
                  type="Uh oh"
                  tagline="Head over to Discover to subscribe to Org Events"
                  image={require('../assets/images/nothing-found.gif')}
                  cardStyle={{ height: 350 }}

                  />
                )}
          </View>
          <Text style={{fontSize: 14, fontWeight: '800'}}>Pull Down to Refresh or head to Discover to subscribe to Organizations</Text>
          </GestureRecognizer>
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
