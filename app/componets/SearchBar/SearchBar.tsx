import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import searchIcon from '../../assets/icons/search.png';
import Colors from '../../theme/colors.ts';

interface SearchHeaderProps {
  onSearchChange: (text: string) => void;
  navigation: any; // Add navigation prop
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearchChange, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const animationValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  const openSearchScreen = () => {
    navigation.navigate('Search');
  };

  const toggleSearch = () => {
    if (isExpanded) {
      // Collapse animation
      Animated.spring(animationValue, {
        toValue: 0,
        useNativeDriver: false,
        speed: 14,
        bounciness: 6,
      }).start(() => {
        setShowInput(false);
      });

      setIsExpanded(false);
      setSearchText('');
      onSearchChange('');
    } else {
      // Expand animation
      setIsExpanded(true);
      setShowInput(true);

      Animated.spring(animationValue, {
        toValue: 1,
        useNativeDriver: false,
        speed: 14,
        bounciness: 6,
      }).start();
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onSearchChange(text);
  };

  const searchBarWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [40, screenWidth - 32],
  });





  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>
        Watch
      </Text>

      <Animated.View style={[styles.searchBar, { width: searchBarWidth }]}>
        <Image
          source={searchIcon}
          style={{
            width: 20,
            height: 20,
            tintColor: Colors.black, // recolor PNG if it's pure black
          }}
        />

        {showInput && (
          <TextInput
            style={styles.input}
            placeholder="TV shows, movies and more"
            placeholderTextColor="#B0B0B0"
            value={searchText}
            onChangeText={handleTextChange}
            autoFocus={isExpanded}
          />
        )}

        {isExpanded && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        )}

        {!isExpanded && (
          <TouchableOpacity
            style={styles.searchTouchArea}
            onPress={openSearchScreen}
            activeOpacity={1}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#000',
    position: 'absolute',
    left: 16,
  },
  searchBar: {
    height: 40,

    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    overflow: 'hidden',
  },
  iconWrapper: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 48,
    paddingRight: 48,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 20,
    color: '#666',
  },
  searchTouchArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default SearchHeader;