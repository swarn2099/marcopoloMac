import React from 'react';
import {
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  UIManager,
} from 'react-native';
import { AppLoading, Asset, Font, Permissions, Location, Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';
require("firebase/firestore");
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    statusBarHidden: false,
    tabsHidden: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      location: null,
      locationLoaded: false,
    };

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    Location.setApiKey('AIzaSyBcdNtelXOg4Wfg1ltJOkgOvaoRbCJ_L7o');
  }

  async componentDidMount() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let result =  await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === 'granted') {
       console.log('Notification permissions granted.')
      }

    if (status === 'granted') {
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

      let [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (location) {
        this.setState(() => ({
          location: {
            ...location,
            coords: {
              latitude,
              longitude,
            },
          },
          locationLoaded: true,
        }));
      } else {
        this.setState(() => ({
          location: {
            coords: {
              latitude,
              longitude,
            },
          },
          locationLoaded: true,
        }));
      }
    } else {
      this.setState(() => ({
        location: null,
        locationLoaded: true,
      }));
    }
  }

  setStatusBarVisibility(visible) {
    this.setState(() => ({
      statusBarHidden: !visible,
    }));
  }

  setTabsVisibility(visible) {
    this.setState(() => ({
      tabsHidden: !visible,
    }));
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && (
            <StatusBar
              barStyle="default"
              animated
              showHideTransition="slide"
              hidden={this.state.statusBarHidden}
            />
          )}
          <RootNavigation
            screenProps={{
              setStatusBarVisibility: this.setStatusBarVisibility.bind(this),
              setTabsVisibility: this.setTabsVisibility.bind(this),
              tabsHidden: this.state.tabsHidden,
              location: this.state.location,
              locationLoaded: this.state.locationLoaded,
            }}
          />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/brand.png'),
        // require('./assets/images/concert.jpg'),
      ]),

      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        ...Octicons.font,
        ...MaterialCommunityIcons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
