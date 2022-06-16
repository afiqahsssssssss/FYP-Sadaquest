import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ScreenWrapper from '../../components/ScreenWrapper';
import AuthForm from '../../components/user/AuthForm';

interface AuthScreenProps {}

const AuthScreen: React.FC<AuthScreenProps> = () => {
  const { colors } = useTheme();

  const styles = makeStyles(colors);

  return (
    <ScreenWrapper contentContainerStyle={styles.contentContainer}>
      <View>
        <Text style={styles.appTitle}>SadaQuest</Text>
      </View>
      <AuthForm />
    </ScreenWrapper>
  );
};

const makeStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    contentContainer: {
      height: '100%',
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    appTitle: {
      fontSize: 54,
      color: colors.primary,
    },
  });

export default AuthScreen;
