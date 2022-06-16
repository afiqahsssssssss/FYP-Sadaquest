import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, useTheme } from 'react-native-paper';
import ScreenWrapper from '../../components/ScreenWrapper';
import DonateForm from '../../components/donate/DonateForm';

interface DonateScreenProps {}

const DonateScreen: React.FC<DonateScreenProps> = () => {
  const { colors } = useTheme();

  const styles = makeStyles(colors);

  return (
    <ScreenWrapper contentContainerStyle={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Title>Donation Form</Title>
      </View>
      <DonateForm />
    </ScreenWrapper>
  );
};

const makeStyles = (_colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    contentContainer: {
      padding: 16,
    },
    titleContainer: {
      alignItems: 'center',
    },
  });

export default DonateScreen;
