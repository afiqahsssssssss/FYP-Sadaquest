import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { screenOptions } from '../components/navigations/stack/ScreenOptions';
import AuthScreen from '../screens/user/AuthScreen';

export type HomeParamList = {
  Auth: undefined;
};

const Stack = createStackNavigator<HomeParamList>();

const TestComp: React.FC = () => {
  return (
    <View>
      <Text>test</Text>
    </View>
  );
};

interface HomeNavigatorProps {}

const HomeNavigator: React.FC<HomeNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Sign In / Sign Up' }} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
