import React from 'react';
import { StyleSheet } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer, useTheme } from 'react-native-paper';
import DrawerHeader from './DrawerHeader';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { authActions } from '../../../store/features/auth/authSlice';
import { ADMIN_ID } from '@env';

interface ItemData {
  navIndex: number;
  label: string;
  icon: string;
  nav: string;
  loginRequired: boolean;
}

const drawerItemsData: ItemData[] = [
  {
    navIndex: 0,
    label: 'Homepage',
    icon: 'home',
    nav: 'HomeNav',
    loginRequired: false,
  },
  {
    navIndex: 1,
    label: 'Donate',
    icon: 'gift',
    nav: 'DonateNav',
    loginRequired: true,
  },
  {
    navIndex: 2,
    label: 'Approved Donates',
    icon: 'playlist-check',
    nav: 'ApprovedNav',
    loginRequired: true,
  },
  {
    navIndex: -1,
    label: 'About Us',
    icon: 'information',
    nav: 'HomeNav',
    loginRequired: false,
  },
];

interface DrawerContentProps extends DrawerContentComponentProps {}

const DrawerContent: React.FC<DrawerContentProps> = (props) => {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { navigation } = props;

  const { colors } = useTheme();

  const { index: selectedNavIndex } = navigation.getState();

  const handleSelectNav = async (itemData: ItemData) => {
    if (itemData.loginRequired && !isLoggedIn) {
      await navigation.navigate('AuthNav');
    } else {
      await navigation.navigate(itemData.nav);
    }
    navigation.closeDrawer();
  };

  const handleSignInButton = async () => {
    await navigation.navigate('AuthNav');
    navigation.closeDrawer();
  };

  const handleSelectApproval = async () => {
    await navigation.navigate('ApprovalNav');
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    dispatch(authActions.logout());
    await navigation.navigate('HomeNav');
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[styles.drawerContent, { backgroundColor: colors.surface }]}
    >
      <DrawerHeader onPress={handleSignInButton} />
      {drawerItemsData.map((item, index) => (
        <Drawer.Item
          {...item}
          key={index}
          active={selectedNavIndex === item.navIndex}
          onPress={() => handleSelectNav(item)}
        />
      ))}
      {isLoggedIn && !!user && user.id === ADMIN_ID && (
        <Drawer.Item
          label="Approval"
          icon="format-list-checks"
          active={selectedNavIndex === 3}
          onPress={handleSelectApproval}
        />
      )}
      {isLoggedIn && <Drawer.Item label="Logout" icon="logout" onPress={handleLogout} />}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  badge: {
    alignSelf: 'center',
  },
});

export default DrawerContent;
