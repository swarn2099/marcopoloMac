import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Animated,
  LayoutAnimation,
  StatusBar,
  RefreshControl,
  BackHandler,
} from 'react-native';
import { WebBrowser, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import moment from 'moment';
import geodist from 'geodist';

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

export default class Parties extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
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

    this.onBackButtonPress = this.onBackButtonPress.bind(this);
    this.fetchPartiesEvents = this.fetchPartiesEvents.bind(this);
    this.onCardPressIn = this.onCardPressIn.bind(this);
    this.onCardPressOut = this.onCardPressOut.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  componentDidMount() {
    this.fetchPartiesEvents();

    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress() {
    let { routeName } = this.props.navigation.state;
    if (routeName.toLowerCase().trim() === 'parties') {
      if (this.state.open) {
        this.closeCard();
      } else {
        return false;
      }
    }
    return true;
  }

  async fetchPartiesEvents() {
    this.setState(() => ({
      refreshing: true,
    }));

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let allCities = true;
    let coords;

    if (status === 'granted') {
      allCities = false;

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      coords = location.coords;
    }

    let citiesData = await firebase
      .database()
      .ref('Cities')
      .once('value');

    let cities = citiesData.val();
    let allowedCities = Object.keys(cities)
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

    let eventsData = await firebase
      .database()
      .ref('Event')
      .once('value');

    let events = eventsData.val();
    events = Object.keys(events || {})
      .map(id => {
        let event = events[id];
        return {
          ...event,
          id,
          name: event.eventName,
          type: event.category,
          image: event.image && event.image.length > 0 && { uri: event.image },
          tagline: event.tagline,
          sponsored: event.sponsored,
        };
      })
      .filter(
        e =>
          e.type.toLowerCase().trim() === 'parties' &&
          moment().isSameOrBefore(moment(e.date, 'D MMMM, YYYY'), 'day') &&
          (allCities || !e.city || allowedCities.includes(e.city))
      )
      .sort(
        (a, b) =>
          moment(a.date, 'D MMMM, YYYY') - moment(b.date, 'D MMMM, YYYY')
      );

    let delay = 500;

    setTimeout(() => {
      this.setState(() => ({
        refreshing: false,
        events,
      }));
    }, delay);
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
        this.props.screenProps.setTabsVisibility(false);

        this.setState(() => ({
          event: id,
          prepare: true,
          open: true,
          dimensions: {
            pageX,
            pageY,
            width,
            height,
          },
        }));
      });
  }

  closeCard() {
    this._eventRefs[this.state.event]
      .getNode()
      .measure((x, y, width, height, pageX, pageY) => {
        this.props.screenProps.setStatusBarVisibility(true);
        this.props.screenProps.setTabsVisibility(true);

        this.setState(() => ({
          event: -1,
          prepare: false,
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
      isAnimating,
      dimensions,
      refreshing,
    } = this.state;

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: 21,
          },
        ]}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          pointerEvents={prepare || open ? 'none' : 'auto'}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.fetchPartiesEvents}
            />
          }
        >
          <ScreenHeader
            title="Parties"
            location={this.props.screenProps.location}
          />

          <View style={styles.cardList}>
            {events.map((e, i) => (
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
                  name={e.eventName}
                  type={e.category}
                  image={e.image}
                  tagline={e.tagline}
                  sponsored={e.sponsored}
                  cardStyle={{ height: 350 }}
                  onPressIn={() => this.onCardPressIn(i)}
                  onPressOut={() => this.onCardPressOut(i)}
                  onPress={() => this.onCardPress(i)}
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
        {event >= 0 &&
          prepare && (
            <EventDescription
              open
              event={events[event]}
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
