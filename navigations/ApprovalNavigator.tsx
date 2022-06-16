import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ApprovalScreen from '../screens/approval/ApprovalScreen';
import { screenOptions } from '../components/navigations/stack/ScreenOptions';

export type ApprovalParamList = {
  Approval: undefined;
};

const Stack = createStackNavigator<ApprovalParamList>();

interface ApprovalNavigatorProps {}

const ApprovalNavigator: React.FC<ApprovalNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Approval" component={ApprovalScreen} options={{ title: 'Approval' }} />
    </Stack.Navigator>
  );
};

export default ApprovalNavigator;
