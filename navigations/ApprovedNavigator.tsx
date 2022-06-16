import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ApprovedScreen from '../screens/approved/ApprovedScreen';
import { screenOptions } from '../components/navigations/stack/ScreenOptions';

export type ApprovedParamList = {
  Approved: undefined;
};

const Stack = createStackNavigator<ApprovedParamList>();

interface ApprovedNavigatorProps {}

const ApprovedNavigator: React.FC<ApprovedNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Approved" component={ApprovedScreen} options={{ title: 'Approved' }} />
    </Stack.Navigator>
  );
};

export default ApprovedNavigator;
