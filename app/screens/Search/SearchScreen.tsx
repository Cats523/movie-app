import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MovieService } from '../../services/movies.service';
import { MovieItem } from '../../services/movies.types';
import { ApiError } from '../../services/api.error';
import backIcon from '../../assets/icons/back.png';
import searchIcon from '../../assets/icons/search.png';
import Colors from '../../theme/colors.ts';
import SearchResultItem from '../../componets/SearchItem/SearchResultItem.tsx';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ErrorAlert from '../../componets/ErrorAlert';

type RootStackParamList = {
  DashboardMain: undefined;
  Search: undefined;
  MovieDetail: { movie: MovieItem };
};

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [allMovies, setAllMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const bottomTabHeight = useBottomTabBarHeight();
  const [error, setError] = useState<ApiError | null>(null);
  useEffect(() => {
    loadAllMovies();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      performSearch(searchText);
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  const loadAllMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MovieService.getUpcomingMovies();
      setAllMovies(data.results);
    } catch (err) {
      setError(err as ApiError);
      console.error('Error loading movies', err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = (query: string) => {
    setSearching(true);
    const lowerQuery = query.toLowerCase();
    const filtered = allMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.original_title.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(filtered);
    setSearching(false);
  };

  const handleMoviePress = (movie: MovieItem) => {
    Keyboard.dismiss();
    navigation.navigate('MovieDetail', { movie });
  };

  const handleSearch = () => {
    Keyboard.dismiss();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={backIcon}
            style={{
              width: 16,
              height: 16,
              tintColor: Colors.black,
            }}
          />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Image
            source={searchIcon}
            style={{
              width: 16,
              height: 16,
              tintColor: Colors.black,
            }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="TV shows, movies and more"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : error ? (
        <ErrorAlert
          error={error}
          onRetry={loadAllMovies}
        />
      ) : (
        <>
          {searchText.trim() ? (
            <>
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>
                  {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                </Text>
              </View>

              {searching ? (
                <View style={styles.center}>
                  <ActivityIndicator size="large" color="#000" />
                </View>
              ) : searchResults.length === 0 ? (
                <View style={styles.center}>
                  <Text style={styles.emptyText}>No movies found</Text>
                  <Text style={styles.emptySubtext}>
                    Try searching with different keywords
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={[
                    styles.listContent,
                    // 3. Use the dynamic height + listContent's own vertical padding
                    { paddingBottom: styles.listContent.padding + bottomTabHeight },
                  ]}

                  renderItem={({ item }) => (

                      <SearchResultItem movie={item} onPress={() => handleMoviePress(item)} />

                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>Search for movies</Text>
              <Text style={styles.emptySubtext}>
                Start typing to find your favorite movies
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,

    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', // This is correctly centering the entire row vertically
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40, // Height is set here
  },
  // ... searchIcon style

  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,


    paddingTop: 3,


    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000',
  },


  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 18,
    color: '#666',
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  resultItem: {
    marginBottom: 16,
  },
});

export default SearchScreen;