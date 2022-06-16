import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput, Title, useTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import * as Yup from 'yup';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { useFormik } from 'formik';
import type { SingleChange } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import axios from 'axios';
import { Masjid } from '../../types/masjid';
import { FIREBASE_REALTIME_DATABASE_ENDPOINT } from '@env';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigations/DrawerNavigator';
import { useAppSelector } from '../../lib/hooks';
import donationTypeList from '../../constants/donationTypesList';

interface DonateFormProps {}

const DonateForm: React.FC<DonateFormProps> = () => {
  const [showMasjidDropDown, setShowMasjidDropDown] = useState(false);
  const [showDonationTypeDropDown, setShowDonationTypeDropDown] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [masjids, setMasjids] = useState<Masjid[]>();

  const { user } = useAppSelector((state) => state.auth);

  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList, 'DonateNav'>>();

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  const formik = useFormik({
    initialValues: {
      masjid: '',
      donationType: '',
      details: '',
      quantity: 0,
      date: undefined as Date | undefined,
      time: '',
      submit: null,
    },
    validationSchema: Yup.object({
      masjid: Yup.string().required('Masjid is required'),
      donationType: Yup.string().required('Type of Donation is required'),
      details: Yup.string().required('Details is required'),
      quantity: Yup.number().min(1, 'Must be greater than or equal to 1').required('Quantity is required'),
      date: Yup.date().required('Date is required'),
      time: Yup.string().required('Time is required'),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      if (!masjids || !user) return;
      try {
        await axios.post(`${FIREBASE_REALTIME_DATABASE_ENDPOINT}/donates.json`, {
          userEmail: user.email,
          userId: user.id,
          masjidId: values.masjid,
          masjid: masjids.find((masjid) => masjid.id === values.masjid)!.name,
          donationType: values.donationType,
          details: values.details,
          quantity: values.quantity,
          date: values.date,
          time: values.time,
        });

        Alert.alert('Donate submitted', 'Thank you for you donations.', [
          {
            text: 'OK',
          },
        ]);
        setLoading(true);
        helpers.resetForm();
        setLoading(false);
      } catch (err: any) {
        const message = err.response.data;

        console.error(message);

        Alert.alert('Error Submitted', 'Something went wrong. Please try again.', [
          {
            text: 'OK',
          },
        ]);
      }
    },
  });

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
      formik.resetForm();
      setLoading(true);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const handleShowMasjidDropDown = () => {
    formik.setTouched({ ...formik.touched, masjid: true });

    setShowMasjidDropDown(true);
  };

  const handleShowDonationTypeDropDown = () => {
    formik.setTouched({ ...formik.touched, donationType: true });

    setShowDonationTypeDropDown(true);
  };

  const handleOpenDate = () => {
    formik.setTouched({ ...formik.touched, date: true });

    setOpenDate(true);
  };

  const handleOpenTime = () => {
    formik.setTouched({ ...formik.touched, time: true });

    setOpenTime(true);
  };

  const handleDateConfirm: SingleChange = (params) => {
    setOpenDate(false);
    formik.setFieldValue('date', params.date);
  };

  const handleDateDismiss = () => {
    setOpenDate(false);
  };

  const onConfirm = (value: { hours: number; minutes: number }) => {
    setOpenTime(false);

    const minutesStr = String(value.minutes).padStart(2, '0');

    let time: string;
    if (value.hours == 0) {
      time = `12:${minutesStr} AM`;
    } else if (value.hours < 12) {
      time = `${value.hours}:${minutesStr} AM`;
    } else if (value.hours == 12) {
      time = `12:${minutesStr} PM`;
    } else {
      time = `${value.hours - 12}:${minutesStr} PM`;
    }

    formik.setFieldValue('time', time);
  };

  const onDismiss = () => {
    setOpenTime(false);
  };

  if (loading || !masjids) {
    return (
      <View style={styles.loadingContainer}>
        <Title>Loading...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainerStyle}>
        <DropDown
          mode="outlined"
          label="Masjid"
          visible={showMasjidDropDown}
          value={formik.values.masjid}
          setValue={(value) => {
            formik.setFieldValue('masjid', value);
          }}
          list={masjids.map((masjid) => ({ label: masjid.name, value: masjid.id }))}
          showDropDown={handleShowMasjidDropDown}
          onDismiss={() => setShowMasjidDropDown(false)}
        />
        {formik.touched.masjid && formik.errors.masjid && <HelperText type="error">{formik.errors.masjid}</HelperText>}
      </View>
      <View style={styles.inputContainerStyle}>
        <DropDown
          mode="outlined"
          label="Type of Donation"
          visible={showDonationTypeDropDown}
          value={formik.values.donationType}
          setValue={(value) => {
            formik.setFieldValue('donationType', value);
          }}
          list={donationTypeList}
          showDropDown={handleShowDonationTypeDropDown}
          onDismiss={() => setShowDonationTypeDropDown(false)}
        />
        {formik.touched.donationType && formik.errors.donationType && (
          <HelperText type="error">{formik.errors.donationType}</HelperText>
        )}
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          style={styles.fixedHeight}
          mode="outlined"
          label="Details"
          value={formik.values.details}
          onChangeText={(value) => {
            formik.setFieldValue('details', value);
          }}
          multiline
          onBlur={() => formik.setTouched({ ...formik.touched, details: true })}
          error={Boolean(formik.touched.details && formik.errors.details)}
        />
        {formik.touched.details && formik.errors.details && (
          <HelperText type="error">{formik.errors.details}</HelperText>
        )}
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          mode="outlined"
          label="Quantity"
          keyboardType="number-pad"
          value={formik.values.quantity.toString()}
          onChangeText={(value) => {
            formik.setFieldValue('quantity', +value);
          }}
          onBlur={() => formik.setTouched({ ...formik.touched, quantity: true })}
          error={Boolean(formik.touched.quantity && formik.errors.quantity)}
        />
        {formik.touched.quantity && formik.errors.quantity && (
          <HelperText type="error">{formik.errors.quantity}</HelperText>
        )}
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          mode="outlined"
          label="Date"
          value={!!formik.values.date ? formik.values.date.toLocaleDateString('en-GB') : ''}
          disabled
        />
        {formik.touched.date && formik.errors.date && <HelperText type="error">{formik.errors.date}</HelperText>}
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput mode="outlined" label="Time" value={formik.values.time} disabled />
        {formik.touched.time && formik.errors.time && <HelperText type="error">{formik.errors.time}</HelperText>}
      </View>
      <View style={styles.buttonContainerStyle}>
        <View style={styles.dateTimeButtonContainer}>
          <Button
            mode="contained"
            style={styles.dateTimeButton}
            color={colors.accent}
            onPress={handleOpenDate}
            disabled={formik.isSubmitting}
          >
            Pick Date
          </Button>
          <Button
            mode="contained"
            style={styles.dateTimeButton}
            color={colors.accent}
            onPress={handleOpenTime}
            disabled={formik.isSubmitting}
          >
            Pick Time
          </Button>
        </View>
        <Button mode="contained" style={styles.submitButton} onPress={formik.submitForm} disabled={formik.isSubmitting}>
          Submit
        </Button>
      </View>
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={openDate}
        date={formik.values.date}
        onConfirm={handleDateConfirm}
        onDismiss={handleDateDismiss}
      />
      <TimePickerModal
        visible={openTime}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
        animationType="fade"
        locale="en"
        hours={13}
        minutes={0}
      />
    </View>
  );
};

const makeStyles = (_colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    container: {
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    inputContainerStyle: {
      marginVertical: 6,
    },
    fixedHeight: {
      height: 100,
    },
    buttonContainerStyle: {
      marginVertical: 18,
    },
    dateTimeButtonContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    dateTimeButton: {
      flexGrow: 1,
      marginHorizontal: 8,
    },
    submitButton: {
      marginHorizontal: 8,
    },
  });

export default DonateForm;
