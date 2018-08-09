import { Notifications } from 'expo';
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import {View, Text} from 'react-native';
import * as firebase from 'firebase';
import Login from '../screens/LoginScreen';
import Loading from '../screens/Loading';
import SignUp from '../screens/SignUp';
import AccountScreen from '../screens/AccountScreen';
import PoolScreen from '../screens/PoolScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import FeaturedScreen from '../screens/FeaturedScreen';
import PrivateScreen from '../screens/PrivateScreen';
import CategoryScreen from '../screens/CategoryScreen';
import AddEvent from '../screens/AddEvent';

import Organizations from '../screens/Organizations';
import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';


const RootStackNavigator = createStackNavigator(
  {
    Loading:{
      screen: Loading,
      navigationOptions:  {headerLeft: null}
    },
    SignUp:{
      screen: SignUp,
      navigationOptions:  {headerLeft: null, gesturesEnabled: false,}
    },
    Login:{
      screen: Login,
      navigationOptions:  {headerLeft: null, gesturesEnabled: false,}
    },
    Main: {
      screen: MainTabNavigator,
      navigationOptions:  {headerLeft: null,         gesturesEnabled: false,}
    },
    Featured: {
      screen: FeaturedScreen,
      navigationOptions:  {headerLeft: null}
    },
    PrivateScreen:{
      screen: PrivateScreen,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    },
    CategoryScreen:{
      screen: CategoryScreen,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    },
    Organizations:{
      screen: Organizations,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    },
    AddEvent:{
      screen: AddEvent,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    },
    AccountScreen:{
      screen: AccountScreen,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    },
    Pool:{
      screen: PoolScreen,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    },
    Discover:{
      screen: DiscoverScreen,
      navigationOptions:  {headerMode: 'float', headerLeft: true}
    }
  },
  {
  headerMode: 'none',
},
  {
    navigationOptions: () => ({
      gesturesEnabled: false,
      headerTitleStyle: {
        fontWeight: 'normal',

      },
    }),
  }
);

export default class RootNavigator extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator {...this.props} />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}
