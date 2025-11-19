// navigation/RootNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../theme/colors';

// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import MovieDetailScreen from '../screens/MovieDetail/MovieDetailScreen';
import TrailerPlayer from '../screens/TrailerPlayer/TrailerPlayer.tsx';
import WatchScreen from '../screens/Watch/WatchScreen';
import MediaScreen from '../screens/Media/MediaScreen';
import MoreScreen from '../screens/More/MoreScreen';

// Assets
import dashboardPng from '../assets/icons/dashboard.png';
import mediaPng from '../assets/icons/media.png';
import watchPng from '../assets/icons/watch.png';

// ----------------- Types -----------------
export type RootStackParamList = {
  MainTabs: undefined;
  TrailerPlayer: { trailerUrl: string };
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Watch: undefined;
  'Media Library': undefined;
  More: undefined;
};

// ----------------- Navigators -----------------
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();


const DashboardStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
    </Stack.Navigator>
  );
};

// Bottom Tabs
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 75,
          backgroundColor: Colors.primary,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          marginBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={dashboardPng}
              style={{ width: 16, height: 16, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Watch"
        component={WatchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={mediaPng}
              style={{ width: 16, height: 16, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Media Library"
        component={MediaScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={watchPng}
              style={{ width: 16, height: 16, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="menu-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs */}
      <RootStack.Screen name="MainTabs" component={BottomTabs} />
      {/* Fullscreen Trailer Player */}
      <RootStack.Screen name="TrailerPlayer" component={TrailerPlayer} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
