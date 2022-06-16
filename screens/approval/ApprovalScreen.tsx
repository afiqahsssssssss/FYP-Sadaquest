import React from 'react';
import ApprovalList from '../../components/approval/ApprovalList';

interface ApprovalScreenProps {}

const ApprovalScreen: React.FC<ApprovalScreenProps> = () => {
  // const { colors } = useTheme();
  //
  // const styles = makeStyles(colors);

  return <ApprovalList />;
};

// const makeStyles = (_colors: ReactNativePaper.ThemeColors) => StyleSheet.create({});

export default ApprovalScreen;
