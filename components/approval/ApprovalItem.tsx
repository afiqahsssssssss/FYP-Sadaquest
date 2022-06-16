import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button, Card, Paragraph, Text, Title, useTheme } from 'react-native-paper';
import { Donate } from '../../types/donate';
import axios from 'axios';
import { FIREBASE_REALTIME_DATABASE_ENDPOINT } from '@env';
import donationTypeList from '../../constants/donationTypesList';

interface ApprovalItemProps {
  donate: Donate;
  onDone: () => void;
}

const ApprovalItem: React.FC<ApprovalItemProps> = (props) => {
  const { donate, onDone } = props;

  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axios.post(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/approved/${donate.userId}.json`, {
        masjidId: donate.masjidId,
        masjid: donate.masjid,
        donationType: donate.donationType,
        details: donate.details,
        quantity: donate.quantity,
        date: donate.date,
        time: donate.time,
      });

      await axios.post(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/events/${donate.masjidId}.json`, {
        userEmail: donate.userEmail,
        userId: donate.userId,
        donationType: donate.donationType,
        details: donate.details,
        quantity: donate.quantity,
        date: donate.date,
        time: donate.time,
      });

      await axios.delete(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/donates/${donate.id}.json`);

      onDone();

      Alert.alert('Approval Success', 'The donate have been approved.', [
        {
          text: 'OK',
        },
      ]);
    } catch (err: any) {
      const message = err.response.data;

      console.error(message);

      Alert.alert('Error', 'Something went wrong. Please try again.', [
        {
          text: 'OK',
        },
      ]);

      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await axios.delete(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/donates/${donate.id}.json`);

      onDone();

      Alert.alert('Decline Success', 'The donate have been decline.', [
        {
          text: 'OK',
        },
      ]);
    } catch (err: any) {
      const message = err.response.data;

      console.error(message);

      Alert.alert('Error', 'Something went wrong. Please try again.', [
        {
          text: 'OK',
        },
      ]);

      setLoading(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>{donate.userEmail}</Title>
        <Paragraph>
          <Text style={styles.info}>Masjid:</Text> {donate.masjid}
        </Paragraph>
        <Paragraph>
          <Text style={styles.info}>Type:</Text>{' '}
          {
            donationTypeList.find((donationType) => {
              return donationType.value === donate.donationType;
            })?.label
          }
        </Paragraph>
        <Paragraph>
          <Text style={styles.info}>Details:</Text> {donate.details}
        </Paragraph>
        <Paragraph>
          <Text style={styles.info}>Quantity:</Text> {donate.quantity} pax
        </Paragraph>
        <Paragraph>
          <Text style={styles.info}>Date:</Text> {new Date(donate.date).toLocaleDateString('en-GB')}
        </Paragraph>
        <Paragraph>
          <Text style={styles.info}>Time:</Text> {donate.time}
        </Paragraph>
        <Card.Actions style={styles.actionContainer}>
          <Button style={styles.actionButton} mode="contained" onPress={handleApprove} disabled={loading}>
            Approve
          </Button>
          <Button
            style={styles.actionButton}
            mode="contained"
            color={colors.error}
            onPress={handleReject}
            disabled={loading}
          >
            Reject
          </Button>
        </Card.Actions>
      </Card.Content>
    </Card>
  );
};

const makeStyles = (_colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    title: {
      marginBottom: 8,
      fontSize: 16,
    },
    info: {
      fontWeight: 'bold',
    },
    actionContainer: {
      marginTop: 14,
      justifyContent: 'space-between',
    },
    actionButton: {
      paddingVertical: 2,
      paddingHorizontal: 4,
    },
  });

export default ApprovalItem;
