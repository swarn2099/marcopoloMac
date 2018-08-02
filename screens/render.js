import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
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
import StoryDescription from '../components/StoryDescription';
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
    constructor(props){
      super(props);
      this.state = {
        loading: true,
        refreshing: false,
        events: [],
        data: events,
        event: -1,
        eventScale: new Animated.Value(1),
        prepare: false,
        open: false,
        isAnimating: false,
        dimensions: {},
      }
      this._carousel = {};
      this._eventRefs = [];
      this.onCardPressIn = this.onCardPressIn.bind(this);
      this.onCardPressOut = this.onCardPressOut.bind(this);
      this.onCardPress = this.onCardPress.bind(this);
      this.closeCard = this.closeCard.bind(this);


    }
    async componentWillMount(){

      firebase.firestore().collection('stories').get().then((snap) => {
        items = snap.docs.reduce((res, item) => ({ ...res, [item.id]: item.data()}), {});
        events = Object.keys(items || {})
          .map(id => {
            let event = items[id];
            return {
              ...event,

            }
          })
      });
      await sleep(500);

      this.setState(() => ({ data: events, events, refreshing: false,
 }));

    }



    handleSnapToItem(index){}
    onCardPressIn(id) {
      let animation = Animated.spring(this.state.eventScale, {
        toValue: 0.80,
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
                pageX: Dimensions.get('window').width,
                pageY: Dimensions.get('window').height,
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
    _renderItem2 = ( { item, index} ) => {
      let {
        events,
        event,
        eventScale,
        prepare,
        open,
        isAnimating,
        loading,
        dimensions,

      } = this.state;
      return (
        <View >
          {events.map((e, i) => (
                <Animated.View
                  key={e.id}
                  ref={r  => this.eventRef(i, r)}
                  style={[
                    styles.animatedCard,
                    event == i && { transform: [{ scale: eventScale }] },
                    event == i && prepare && { opacity: 0 },
                  ]}
                >
                  <PoolCards
                  name={item.name}
                  image={item.imageURL}
                  cardStyle={{ height: 450 }}
                  onPressIn={() => this.onCardPressIn(i)}
                  onPressOut={() => this.onCardPressOut(i)}
                  onPress={() => this.onCardPress(i)}
                  />
                </Animated.View>
              ))
            }
            console.log(index)

        </View>
      );

    }
    render = () => {
      let {
        events,
        event,
        eventScale,
        data,
        prepare,
        open,
        isAnimating,
        dimensions,

      } = this.state;


      return (
        <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <ScreenHeader title="Orgs" location={this.props.screenProps.location}/>
              <Carousel
                ref={ (c) => { this._carousel = c; } }
                data={data}
                renderItem={this._renderItem2.bind(this)}
                onSnapToItem={this.handleSnapToItem.bind(this)}
                sliderWidth={360}
                itemWidth={300}
                layout={'default'}
                firstItem={0}
              />
          </ScrollView>
          {event >= 0 &&
            prepare && (
              <StoryDescription
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
