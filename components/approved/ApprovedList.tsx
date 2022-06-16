import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Title, useTheme } from 'react-native-paper';
import ApprovedItem from './ApprovedItem';
import axios from 'axios';
import { FIREBASE_REALTIME_DATABASE_ENDPOINT } from '@env';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigations/DrawerNavigator';
import { Donate } from '../../types/donate';
import { useAppSelector } from '../../lib/hooks';

interface ApprovedListProps {}

const ApprovedList: React.FC<ApprovedListProps> = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [donates, setDonates] = useState<Donate[]>();

  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList, 'DonateNav'>>();

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  useEffect(() => {
    const fetchDonates = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/approved/${user!.id}.json`);

        const fetchedDonates: Donate[] = [];

        for (const key in data) {
          fetchedDonates.unshift({
            id: key,
            userEmail: user!.email,
            userId: user!.id,
            masjidId: data[key].masjidId,
            masjid: data[key].masjid,
            donationType: data[key].donationType,
            details: data[key].details,
            quantity: data[key].quantity,
            date: data[key].date,
            time: data[key].time,
          });
        }

        setDonates(fetchedDonates);
      } catch (err) {
        console.log(err.response.data);
      }
      setLoading(false);
    };

    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchDonates();
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation, user]);

  if (loading || !donates) {
    return (
      <View style={styles.loadingContainer}>
        <Title>Loading...</Title>
      </View>
    );
  }

  if (donates.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Title>No donates approved yet</Title>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={donates}
      renderItem={({ item: donate }) => <ApprovedItem donate={donate} />}
    />
  );
};

const makeStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: colors.surface,
    },
    container: {
      backgroundColor: colors.surface,
    },
    contentContainer: {
      marginVertical: 30,
      marginHorizontal: 28,
    },
  });

export default ApprovedList;
