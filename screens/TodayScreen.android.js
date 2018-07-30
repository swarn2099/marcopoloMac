import React from 'react';
import _ from 'lodash';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  LayoutAnimation,
  BackHandler,
} from 'react-native';
import { MapView, Permissions, Location } from 'expo';
import moment from 'moment';

import MapMarker from '../components/MapMarker';
import * as firebase from 'firebase';
import FeaturedCard from '../components/FeaturedCard';
import EventDescription from '../components/EventDescription';

const spring = LayoutAnimation.Presets.spring;
const animConfig = {
  ...spring,
  update: {
    ...spring.update,
    springDamping: 0.8,
  },
};

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export default class MapScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      event: null,
      region: null,
      slide: false,
      prepareOpen: false,
      open: false,
      openDimensions: {},
      mapLoaded: false,
    };

    this.cardHeight = 200;

    this.onBackButtonPress = this.onBackButtonPress.bind(this);
    this._eventRef = null;
    this.onRegionChange = this.onRegionChange.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.deselectEvent = this.deselectEvent.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);

    setTimeout(() => {
      this.setState(() => ({
        mapLoaded: true,
      }));
    }, 1000);

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.fetchEvents(true);
      return;
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

    this.setState(() => ({
      region: {
        latitude,
        longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      },
    }));

    this.fetchEvents();
  }

  onBackButtonPress() {
    let { routeName } = this.props.navigation.state;
    if (routeName.toLowerCase().trim() === 'map') {
      if (this.state.event) {
        this.deselectEvent();
      } else {
        return false;
      }
    }
    return true;
  }

  fetchEvents(setRegion = false) {
    let ref = firebase.database().ref('Event');
    ref.once('value', data => {
      let events = data.val();
      events = Object.keys(events || {})
        .map(id => {
          let event = events[id];
          return {
            ...event,
            id,
            name: event.eventName,
            type: event.category,
            image: event.image &&
              event.image.length > 0 && { uri: event.image },
            tagline: event.tagline,
            sponsored: event.sponsored,
            latitude: event.latCoord,
            longitude: event.longCoord,
          };
        })
        .filter(e =>
          moment().isSameOrBefore(moment(e.date, 'D MMMM, YYYY'), 'day')
        );

      this.setState(() => ({
        events,
      }));

      if (setRegion) {
        let region = this.getRegionForCoordinates(
          events.map(e => ({ latitude: e.latitude, longitude: e.longitude }))
        );

        this.setState(() => ({
          region: {
            ...region,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2,
          },
        }));
      }
    });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  getRegionForCoordinates(points) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    (point => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map(point => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = maxX - minX;
    const deltaY = maxY - minY;

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  }

  selectEvent(event, e) {
    if (e) {
      e.stopPropagation();
    }

    this.props.screenProps.setTabsVisibility(false);

    this.setState(() => ({
      event,
    }));
  }

  deselectEvent() {
    this.props.screenProps.setTabsVisibility(true);

    this.setState(() => ({
      event: null,
    }));
  }

  onCardPress() {
    this._eventRef.getNode().measure((sX, sY, width, height, pageX, pageY) => {
      this.setState(
        () => ({
          prepareOpen: true,
          openDimensions: {
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
    this._eventRef.getNode().measure((x, y, width, height, pageX, pageY) => {
      this.props.screenProps.setStatusBarVisibility(true);
      this.props.screenProps.setTabsVisibility(true);

      this.setState(() => ({
        open: false,
        openDimensions: {
          pageX,
          pageY,
          width,
          height,
        },
      }));
    });
  }

  markerColor(type) {
    switch (type) {
      case 'Free':
        return '#FF3B30';
      case 'Food':
        return '#FF9500';
      case 'Entertainment':
        return '#FFCC00';
      case 'Parties':
        return '#4CD964';
      case 'Music':
        return '#007AFF';
      case 'Sports':
        return '#5AC8FA';
      case 'Deal of the Day':
        return '#5856D6';
      default:
        return '#808080';
    }
  }

  render() {
    let {
      events,
      event,
      slide,
      prepareOpen,
      open,
      isAnimating,
      openDimensions,
      region,
      mapLoaded,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subContainer}>
          <MapView
            style={{
              flex: 1,
              marginTop: mapLoaded ? 24 : 23,
            }}
            showsUserLocation
            showsMyLocationButton
            moveOnMarkerPress
            initialRegion={region}
            provider={MapView.PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            onPress={this.deselectEvent}
          >
            {events.map((e, i) => (
              <MapView.Marker
                key={`event-${i}`}
                coordinate={{ latitude: e.latitude, longitude: e.longitude }}
                onPress={e => this.selectEvent(i, e)}
              >
                <MapMarker color={this.markerColor(e.type)} />
              </MapView.Marker>
            ))}
          </MapView>
        </View>
        {!!events[event] && (
          <EventDescription
            open
            event={events[event]}
            height={this.cardHeight}
            close={this.deselectEvent}
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
  subContainer: {
    flex: 1,
    paddingBottom: 49,
  },
  animatedCard: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
  },
});
