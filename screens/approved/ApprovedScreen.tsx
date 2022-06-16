import React from 'react';
import ApprovedList from '../../components/approved/ApprovedList';

interface ApprovedScreenProps {}

const ApprovedScreen: React.FC<ApprovedScreenProps> = () => {
  // const { colors } = useTheme();
  //
  // const styles = makeStyles(colors);

  return <ApprovedList />;
};

// const makeStyles = (_colors: ReactNativePaper.ThemeColors) => StyleSheet.create({});

export default ApprovedScreen;
