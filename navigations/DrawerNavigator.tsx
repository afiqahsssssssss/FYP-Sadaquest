import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/navigations/drawer/DrawerContent';
import HomeNavigator from './HomeNavigator';
import DonateNavigator from './DonateNavigator';
import AuthNavigator from './AuthNavigator';
import ApprovalNavigator from './ApprovalNavigator';
import ApprovedNavigator from './ApprovedNavigator';

export type DrawerParamList = {
  HomeNav: undefined;
  DonateNav: undefined;
  ApprovedNav: undefined;
  ApprovalNav: undefined;
  AuthNav: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface DrawerNavigatorProps {}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = () => {
  return (
    <Drawer.Navigator initialRouteName="HomeNav" drawerContent={DrawerContent} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="HomeNav" component={HomeNavigator} />
      <Drawer.Screen name="DonateNav" component={DonateNavigator} />
      <Drawer.Screen name="ApprovedNav" component={ApprovedNavigator} />
      <Drawer.Screen name="ApprovalNav" component={ApprovalNavigator} />
      <Drawer.Screen name="AuthNav" component={AuthNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
