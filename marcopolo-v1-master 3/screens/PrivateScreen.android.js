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
  SafeAreaView,
  LayoutAnimation,
  StatusBar,
  RefreshControl,
  ImageBackground,
  BackHandler,
  YellowBox
} from 'react-native';
import { WebBrowser, Permissions, Location, Haptic, Notification } from 'expo';
import * as firebase from 'firebase';
require("firebase/firestore");
import moment from 'moment';
import geodist from 'geodist';
import sleep from 'await-sleep';
import ScreenHeader from '../components/ScreenHeader';
import PoolCard from '../components/PoolCard';
import NoEvents from '../components/NoEvents'
import PrivateDescription from '../components/PrivateDescription';
const spring = LayoutAnimation.Presets.spring;
const animConfig = {
  ...spring,
  update: {
    ...spring.update,
    springDamping: 0.8,
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
      dimensions: {},
    };

    this._eventRefs = [];

    this.refresh = this.refresh.bind(this);
    this.fetchPrivateEvents = this.fetchPrivateEvents.bind(this);
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
    if (routeName.toLowerCase() === 'privatescreen') {
      if (this.state.open) {
        this.closeCard();
      } else {
        BackHandler.removeEventListener('backPress');
        this.props.navigation.navigate('Discover')
      }
    }
    return true;
  }
  async componentWillReceiveProps(nextProps) {
    let { location, locationLoaded } = nextProps.screenProps;


    if (locationLoaded) {
      await this.fetchPrivateEvents();
      this.setState(() => ({
        loading: false,
      }));
    }
  }

  refresh() {
    let { location, locationLoaded } = this.props.screenProps;
    if (locationLoaded) {
      this.fetchPrivateEvents();
    }
  }

  async fetchPrivateEvents(location = null) {
    this.setState(() => ({
      refreshing: true,
    }));
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    await firebase.firestore().collection('privateEvents').get().then((snap) => {
      itemsPrivate = snap.docs.reduce((resPrivate, itemPrivate) => ({ ...resPrivate,
        [itemPrivate.id]: itemPrivate.data()
      }), {});
      this.setState({itemsPrivate})
      const { currentUser } = firebase.auth()

      events = Object.keys(itemsPrivate || {})
        .map(id => {
          let event = itemsPrivate[id];
          console.log(currentUser)
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
            users: event.users,
            info: event.info
          }

        })
        .filter(e => e.users.includes(currentUser.email) != false && moment().isSameOrBefore(moment(e.date, 'MMM DD, YYYY'), 'day'));
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
                this.props.screenProps.setStatusBarVisibility(false);
                this.props.screenProps.setTabsVisibility(false);

                this.setState(() => ({
                  open: true,
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
        refreshing,
        loading,
      } = this.state;

      return (
        <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            pointerEvents={prepare || open ? 'none' : 'auto'}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.fetchPrivateEvents}/>}
          >
            <ScreenHeader
              title="Private"
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
                      tagline={e.startTime + ' on ' + moment(e.date).format("MMM, Do")}
                      time={e.startTime + ' to ' + e.endTime}
                      interested={e.interested}
                      info={e.info}
                      location={e.location}
                      cardStyle={{ height: 350 }}
                      onPressIn={() => this.onCardPressIn(i)}
                      onPressOut={() => this.onCardPressOut(i)}
                      onPress={() => this.onCardPress(i)}
                      />

                    </Animated.View>
                  ))
                : !!loading && (
                    <NoEvents
                      name="No Private Events"
                      type="Uh oh"
                      tagline="You'll find events here if you get invited to them or if you create them"
                      image={require('../assets/images/nothing-found.gif')}
                      cardStyle={{ height: 350 }}
                      shadow
                    />
                  )}
            </View>
            <Text style={{fontSize: 14, fontWeight: '800'}}>Pull Down to Refresh</Text>
          </ScrollView>
          {event >= 0 &&
            prepare && (
              <PrivateDescription
              event={events[event]}
              open={open}
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
