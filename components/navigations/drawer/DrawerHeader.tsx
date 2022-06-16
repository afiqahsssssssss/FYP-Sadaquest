import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Colors, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../../../lib/hooks';

interface DrawerHeaderProps {
  onPress: () => void;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = (props) => {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <Avatar.Icon size={56} icon="account" style={styles.avatar} />
      <Text style={styles.appName}>Donation App</Text>
      {isLoggedIn && !!user && <Text style={styles.email}>{user.email}</Text>}
      {!isLoggedIn && (
        <Button mode="contained" color={colors.accent} onPress={props.onPress}>
          Sign In
        </Button>
      )}
    </View>
  );
};

const makeStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: -100,
      marginBottom: 8,
      padding: 14,
      paddingTop: 114,
      backgroundColor: colors.primary,
    },
    avatar: {
      backgroundColor: Colors.white,
    },
    appName: {
      marginTop: 14,
      marginBottom: 8,
      fontWeight: 'bold',
      color: Colors.white,
    },
    email: {
      color: Colors.white,
    },
  });

export default DrawerHeader;
