import React from 'react';
import EventList from '../../components/home/EventList';

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  // const { colors } = useTheme();
  //
  // const styles = makeStyles(colors);

  return <EventList />;
};

// const makeStyles = (_colors: ReactNativePaper.ThemeColors) => StyleSheet.create({});

export default HomeScreen;
