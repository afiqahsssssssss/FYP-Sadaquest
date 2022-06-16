import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph, Text, useTheme } from 'react-native-paper';
import { Donate } from '../../types/donate';
import donationTypeList from '../../constants/donationTypesList';

interface EventItemProps {
  donate: Donate;
}

const EventItem: React.FC<EventItemProps> = (props) => {
  const { donate } = props;

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  return (
    <Card style={styles.container}>
      <Card.Content>
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

export default EventItem;
