import React from 'react';
import { View, Text } from 'react-native';

const MediaScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold' }}>
        Media Library
      </Text>
    </View>
  );
};

export default MediaScreen;
