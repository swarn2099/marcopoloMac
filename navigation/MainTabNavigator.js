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
import TodayScreen from '../screens/TodayScreen';
import UpcomingScreen from '../screens/UpcomingScreen';
import StoriesScreen from '../screens/StoriesScreen';
import AccountScreen from '../screens/AccountScreen';

// import GroupScreen from '../screens/GroupScreen';


export default createBottomTabNavigator(
  {
    Featured: { screen: FeaturedScreen },
    Today: { screen: TodayScreen },
    Pool: {screen: StoriesScreen},
    Upcoming: {screen: UpcomingScreen},
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
          case 'Today':
            return <MaterialCommunityIcons name="grid" {...props} />;
          case 'Upcoming':
            return <Octicons name="watch" {...props} />;
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
