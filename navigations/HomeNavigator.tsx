import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { screenOptions } from '../components/navigations/stack/ScreenOptions';
import HomeScreen from '../screens/home/HomeScreen';

export type HomeParamList = {
  Home: undefined;
};

const Stack = createStackNavigator<HomeParamList>();

interface HomeNavigatorProps {}

const HomeNavigator: React.FC<HomeNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Upcoming Event' }} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
