import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo';
import {
  Entypo,
  Ionicons,
  Octicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { createBottomTabNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import FeaturedScreen from '../screens/FeaturedScreen';
import AddScreen  from '../screens/AddEvent';
import PoolScreen from '../screens/PoolScreen';
import AccountScreen from '../screens/AccountScreen';
import DiscoverScreen from '../screens/DiscoverScreen';

// import GroupScreen from '../screens/GroupScreen';


export default createBottomTabNavigator(
  {
    Pool: { screen: PoolScreen },
    Featured: { screen: FeaturedScreen },
    Discover: {screen: DiscoverScreen},
    Add: {screen: AddScreen},
    Account: {screen: AccountScreen},

  },
  {
    navigationOptions: ({ navigation, screenProps }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const props = {
          size: 28,
          style: { marginBottom: -3, width: 25 },
          color: focused ? Colors.tabIconSelected : Colors.tabIconDefault,
        };

        switch (routeName) {
          case 'Featured':
          return <MaterialCommunityIcons name="airballoon" {...props} />;
          case 'Add':
            return <Ionicons name="ios-add-circle" {...props} />;
          case 'Discover':
            return <Ionicons name="md-glasses" {...props} />;
            case 'Pool':
              return <MaterialIcons name="pool" {...props} />;
          case 'Account':
            return <MaterialCommunityIcons name="account" {...props} />;
        }
      },
    }),

    tabBarOptions: {
      style: {
        // backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0)' : '#fff',
      },
    },
  }
);
