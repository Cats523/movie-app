
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const AppContent: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
