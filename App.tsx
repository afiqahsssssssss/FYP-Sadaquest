import 'react-native-gesture-handler';

import { Provider as StoreProvider } from 'react-redux';
import { en, enGB, registerTranslation } from 'react-native-paper-dates';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './navigations/DrawerNavigator';
import { store } from './store/store';

registerTranslation('en-GB', enGB);
registerTranslation('en', en);

const theme = {
  ...DefaultTheme,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8bc34a',
    accent: '#824ac3',
    background: '#ffffff',
  },
};

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}
