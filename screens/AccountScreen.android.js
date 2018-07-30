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
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';
import moment from 'moment';

import ScreenHeader from '../components/ScreenHeader';
import FeaturedCard from '../components/FeaturedCard';
import EventDescription from '../components/StoryDescription';

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
    this.fetchFeaturedEvents = this.fetchFeaturedEvents.bind(this);
    this.onCardPressIn = this.onCardPressIn.bind(this);
    this.onCardPressOut = this.onCardPressOut.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  componentDidMount() {
    this.fetchFeaturedEvents();

    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress() {
    let { routeName } = this.props.navigation.state;
    if (routeName.toLowerCase().trim() === 'stories') {
      if (this.state.open) {
        this.closeCard();
      } else {
        return false;
      }
    }
    return true;
  }

  fetchFeaturedEvents() {
    this.setState(() => ({
      refreshing: true,
    }));

    let ref = firebase.database().ref('Stories');
    ref.once('value', data => {
      let events = data.val();
      events = Object.keys(events || {}).map(id => {
        let event = events[id];
        return {
          ...event,
          id,
          name: event.articleName,
          type: event.category,
          image: event.image &&
            event.image.length > 0 && {
              uri: event.image,
            },
          tagline: event.tagline,
          link: event.articleLink,
          external: event.type.toLowerCase() === 'external',
        };
      });

      let delay = 500;

      setTimeout(() => {
        this.setState(() => ({
          refreshing: false,
          events,
        }));
      }, delay);
    });
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
              onRefresh={this.fetchFeaturedEvents}
            />
          }
        >
          <ScreenHeader
            title="Stories"
            location={this.props.screenProps.location}
          />

          <View style={styles.cardList}>
            {events.map((e, i) => (
              <Animated.View
                key={e.id}
                ref={r => this.eventRef(i, r)}
                style={[
                  styles.animatedCard,
                  event == i && {
                    transform: [
                      {
                        scale: eventScale,
                      },
                    ],
                  },
                  event == i &&
                    prepare && {
                      opacity: 0,
                    },
                ]}
              >
                <FeaturedCard
                  name={e.articleName}
                  type={e.category}
                  image={e.image}
                  tagline={e.tagline}
                  sponsored={e.sponsored}
                  cardStyle={{
                    height: e.external ? 200 : 350,
                  }}
                  onPressIn={() => this.onCardPressIn(i)}
                  onPressOut={() => this.onCardPressOut(i)}
                  onPress={() => this.onCardPress(i)}
                  shadow
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
