import React, { useMemo, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  TrailerPlayer: { trailerUrl: string };
};

type TrailerPlayerRouteProp = RouteProp<RootStackParamList, 'TrailerPlayer'>;

const TrailerPlayer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TrailerPlayerRouteProp>();

  const { trailerUrl } = route.params;


  const [isConnected, setIsConnected] = useState(true);

  // Internet Check
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Extract Video ID
  const videoId = useMemo(() => {
    if (!trailerUrl) return '';

    const regex = /(?:youtu\.be\/|v\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)/;
    const match = trailerUrl.match(regex);

    if (match && match[1].length === 11) {
      console.log('Extracted VideoId:', match[1]);
      return match[1];
    }
    return '';
  }, [trailerUrl]);

  // Invalid URL Screen
// Invalid URL Screen
  if (!videoId) {
    return (
      <ScreenWrapper>
        <ErrorUI
          title="Invalid Trailer URL"
          message="The trailer link is invalid or malformed."
          onBack={() => navigation.goBack()}
        />
      </ScreenWrapper>
    );
  }


  // No Internet Screen
  if (!isConnected) {
    return (
      <ScreenWrapper>
        <ErrorUI
          title="No Internet Connection"
          message="Please check your network and try again."
          onRetry={() => {}}
          onBack={() => navigation.goBack()}
        />
      </ScreenWrapper>
    );
  }

  return (
    <View style={internalStyles.container}>
      <StatusBar hidden />



      {/* Player */}
      <YoutubePlayer
        height={'100%'}
        width={'100%'}

        videoId={videoId}
        onChangeState={(state: string) => {
          if (state === 'ended') {
            navigation.goBack();
          }
        }}
      />


      {/* Close Button */}
      {(
        <TouchableOpacity
          style={internalStyles.doneButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={internalStyles.doneText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TrailerPlayer;

////////////////////////////////////////////////////////////////////////////////
// SCREEN WRAPPER + ERROR UI
////////////////////////////////////////////////////////////////////////////////

const ScreenWrapper = ({ children }: any) => (
  <View style={internalStyles.container}>
    <StatusBar hidden />
    {children}
  </View>
);

const ErrorUI = ({
                   title,
                   message,
                   onBack,
                   onRetry,
                 }: {
  title: string;
  message: string;
  onBack: () => void;
  onRetry?: () => void;
}) => (
  <View style={internalStyles.errorContainer}>
    <Text style={internalStyles.errorIcon}>⚠️</Text>
    <Text style={internalStyles.errorTitle}>{title}</Text>
    <Text style={internalStyles.errorText}>{message}</Text>

    <View style={internalStyles.errorButtonsContainer}>
      {onRetry && (
        <TouchableOpacity style={internalStyles.primaryButton} onPress={onRetry}>
          <Text style={internalStyles.buttonText}>Retry</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={internalStyles.secondaryButton} onPress={onBack}>
        <Text style={internalStyles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  </View>
);

////////////////////////////////////////////////////////////////////////////////
//  MERGED STYLES
////////////////////////////////////////////////////////////////////////////////

const internalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },

  // Error UI
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
    color: 'white',
  },
  errorTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  errorButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },

  // Close Button
  doneButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  doneText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
});
