import { Appbar, Colors } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationOptions } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

export const screenOptions: StackNavigationOptions = {
  headerMode: 'screen',
  header: ({ navigation, options, back }) => (
    <Appbar.Header>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : (navigation as any).openDrawer ? (
        <Appbar.Action
          color={Colors.white}
          icon="menu"
          onPress={() => (navigation as any as DrawerNavigationProp<{}>).openDrawer()}
        />
      ) : null}
      <Appbar.Content color={Colors.white} title={options.title} titleStyle={styles.headerText} />
      <Appbar.Action color={Colors.white} icon="handshake" />
    </Appbar.Header>
  ),
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
  },
});
