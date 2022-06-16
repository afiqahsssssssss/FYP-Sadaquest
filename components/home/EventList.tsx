import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Title, useTheme } from 'react-native-paper';
import EventItem from './EventItem';
import axios from 'axios';
import { FIREBASE_REALTIME_DATABASE_ENDPOINT } from '@env';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigations/DrawerNavigator';
import { Donate } from '../../types/donate';
import { Masjid } from '../../types/masjid';
import DropDown from 'react-native-paper-dropdown';

interface EventListProps {}

const EventList: React.FC<EventListProps> = () => {
  const [loading, setLoading] = useState(false);
  const [donates, setDonates] = useState<Donate[]>();
  const [masjids, setMasjids] = useState<Masjid[]>();
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid>();
  const [showMasjidDropDown, setShowMasjidDropDown] = useState(false);

  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList, 'DonateNav'>>();

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  useEffect(() => {
    const fetchMasjids = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/masjids.json`);

        const fetchedMasjids: Masjid[] = [];

        for (const key in data) {
          fetchedMasjids.push({
            id: key,
            name: data[key].name,
          });
        }

        setMasjids(fetchedMasjids);
      } catch (err) {
        console.log(err.response.data);
      }
      setLoading(false);
    };

    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchMasjids();
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setSelectedMasjid(undefined);
      setDonates([]);
      setLoading(true);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    const fetchDonates = async () => {
      try {
        const { data } = await axios.get(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/events/${selectedMasjid!.id}.json`);

        const fetchedDonates: Donate[] = [];

        for (const key in data) {
          fetchedDonates.unshift({
            id: key,
            userEmail: data[key].userEmail,
            userId: data[key].userId,
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
        console.log(err.response);
      }
    };

    if (selectedMasjid) {
      fetchDonates();
    }
  }, [selectedMasjid]);

  if (loading || !masjids) {
    return (
      <View style={styles.loadingContainer}>
        <Title>Loading...</Title>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.dropdownContainer}>
        <DropDown
          mode="outlined"
          label="Masjid"
          visible={showMasjidDropDown}
          value={selectedMasjid?.id}
          setValue={(value) => {
            setSelectedMasjid(masjids.find((masjid) => masjid.id === value));
          }}
          list={masjids.map((masjid) => ({ label: masjid.name, value: masjid.id }))}
          showDropDown={() => setShowMasjidDropDown(true)}
          onDismiss={() => setShowMasjidDropDown(false)}
        />
      </View>
      {!donates && (
        <View style={styles.infoContainer}>
          <Title>Please select a masjid.</Title>
        </View>
      )}
      {donates?.length === 0 && (
        <View style={styles.infoContainer}>
          <Title>No Donation Available.</Title>
        </View>
      )}
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={donates}
        renderItem={({ item: donate }) => <EventItem donate={donate} />}
      />
    </View>
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
    pageContainer: {
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
    dropdownContainer: {
      marginTop: 16,
      marginHorizontal: 28,
    },
    infoContainer: {
      alignItems: 'center',
      marginVertical: 30,
    },
  });

export default EventList;
