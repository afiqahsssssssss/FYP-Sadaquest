import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DonateScreen from '../screens/donate/DonateScreen';
import { screenOptions } from '../components/navigations/stack/ScreenOptions';

export type DonateParamList = {
  DonateForm: undefined;
};

const Stack = createStackNavigator<DonateParamList>();

interface DonateNavigatorProps {}

const DonateNavigator: React.FC<DonateNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DonateForm" component={DonateScreen} options={{ title: 'Donate' }} />
    </Stack.Navigator>
  );
};

export default DonateNavigator;
