import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput, Title, useTheme } from 'react-native-paper';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { login, signup } from '../../store/features/auth/authSlice';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigations/DrawerNavigator';
import { ADMIN_ID } from '@env';

interface AuthFormProps {}

const AuthForm: React.FC<AuthFormProps> = () => {
  const { user, error, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [isSignup, setIsSignup] = useState(false);

  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList, 'AuthNav'>>();

  const { colors } = useTheme();

  const styles = makeStyles(colors);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      // email: 'test2@test.com',
      // password: 'test1234',
      // email: 'admin@sadaquest.com',
      // password: 'admin1234',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('Email is required'),
      password: Yup.string().min(6).required('Password is required'),
    }),
    onSubmit: async (values): Promise<void> => {
      if (isSignup) {
        await dispatch(signup({ email: values.email, password: values.password }));
      } else {
        await dispatch(login({ email: values.email, password: values.password }));
      }
    },
  });

  useEffect(() => {
    if (user?.id === ADMIN_ID) {
      navigation.navigate('ApprovalNav');
      formik.resetForm();
      return;
    }

    if (isLoggedIn) {
      navigation.navigate('DonateNav');
      formik.resetForm();
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Title>{!isSignup ? 'Sign In' : 'Sign Up'}</Title>
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          mode="outlined"
          label="Email"
          keyboardType="email-address"
          value={formik.values.email}
          onChangeText={(value) => {
            formik.setFieldValue('email', value);
          }}
          onBlur={() => formik.setTouched({ ...formik.touched, email: true })}
          error={Boolean(formik.touched.email && formik.errors.email)}
          autoCapitalize="none"
          autoComplete="email"
          autoFocus
        />
        {formik.touched.email && formik.errors.email && <HelperText type="error">{formik.errors.email}</HelperText>}
      </View>
      <View style={styles.inputContainerStyle}>
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry
          value={formik.values.password}
          onChangeText={(value) => {
            formik.setFieldValue('password', value);
          }}
          onBlur={() => formik.setTouched({ ...formik.touched, password: true })}
          error={Boolean(formik.touched.password && formik.errors.password)}
          autoComplete="password"
        />
        {formik.touched.password && formik.errors.password && (
          <HelperText type="error">{formik.errors.password}</HelperText>
        )}
      </View>
      <View style={styles.buttonContainerStyle}>
        <Button mode="contained" onPress={formik.submitForm} disabled={formik.isSubmitting}>
          {!isSignup ? 'Sign In' : 'Sign Up'}
        </Button>
        {!!error && <HelperText type="error">{error}</HelperText>}
      </View>
      <View>
        <Button color={colors.accent} onPress={() => setIsSignup((prevState) => !prevState)}>
          Switch to {isSignup ? 'Login' : 'Sign Up'}
        </Button>
      </View>
    </View>
  );
};

const makeStyles = (_colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 28,
      paddingHorizontal: 24,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 8,
    },
    inputContainerStyle: {
      marginVertical: 6,
    },
    buttonContainerStyle: {
      marginVertical: 28,
    },
  });

export default AuthForm;
