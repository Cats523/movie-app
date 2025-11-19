import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MovieService } from '../../services/movies.service';
import { MovieItem, UpcomingMoviesResponse } from '../../services/movies.types';
import SearchHeader from '../../componets/SearchBar/SearchBar.tsx';
import MovieCard from '../../componets/MovieCard/MovieCard.tsx';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ApiError } from '../../services/api.error';
import ErrorAlert from '../../componets/ErrorAlert';

type RootStackParamList = {
  DashboardMain: undefined;
  Search: undefined;
  MovieDetail: { movie: MovieItem };
};

const DashboardScreen: React.FC = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const bottomTabHeight = useBottomTabBarHeight();
  const [error, setError] = useState<ApiError | null>(null);
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: UpcomingMoviesResponse = await MovieService.getUpcomingMovies();
      setMovies(data.results);
    } catch (err) {
      setError(err as ApiError);
      console.error('Error loading movies', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) {
      return movies;
    }

    const query = searchQuery.toLowerCase();
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.original_title.toLowerCase().includes(query)
    );
  }, [movies, searchQuery]);

  const handleMoviePress = (movie: MovieItem) => {
    console.log('Movie pressed:', movie.title);
    // Navigate to detail screen
    navigation.navigate('MovieDetail', { movie });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <SearchHeader onSearchChange={setSearchQuery} navigation={navigation} />
        <ErrorAlert
          error={error}
          onRetry={loadMovies}
          onDismiss={() => setError(null)}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <SearchHeader onSearchChange={setSearchQuery} navigation={navigation} />

      {filteredMovies.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No movies found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[
            styles.listContent,
            // 3. Use the dynamic height + listContent's own vertical padding
            { paddingBottom: styles.listContent.padding + bottomTabHeight },
          ]}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => handleMoviePress(item)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#999',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default DashboardScreen;