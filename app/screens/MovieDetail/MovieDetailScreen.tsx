import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Colors from '../../theme/colors.ts';
import backIcon from '../../assets/icons/back.png';
import { MovieService } from '../../services/movies.service.ts';
import { RootStackParamList } from '../../navigation/types.ts';
import { ApiError } from '../../services/api.error.ts';
import ErrorAlert from '../../componets/ErrorAlert';

// --- Type Definitions (Assuming they are correct from your file) ---

type MovieDetailRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = 450; // Increased height to cover more of the screen top

const MovieDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<MovieDetailRouteProp>();
  const [error, setError] = useState<ApiError | null>(null);
  const { movie } = route.params;

  // Use poster if backdrop is not available, as backdrop covers a large area
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  // Mock genre names (Use a simple color mapping for visualization)
  const genres = [
    { name: 'Action', color: Colors.green },
    { name: 'Thriller', color: Colors.pink },
    { name: 'Science', color: Colors.purple },
    { name: 'Fiction', color: Colors.yellow },
  ];

  const handleWatchTrailer = async () => {
    try {
      const response = await MovieService.getMovieVideos(movie.id);
      const videos = response.results;

      const trailer = videos.find(
        (v: any) => v.type === 'Trailer' && v.site === 'YouTube',
      );

      if (!trailer) {
        Alert.alert('Trailer not available');
        return;
      }

      const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

      navigation.navigate('TrailerPlayer', {
        trailerUrl: youtubeUrl,
      });
    } catch (e) {
      setError(e as ApiError);
      console.error(e);
    }
  };
  if (error) {
    return (
      <ErrorAlert
        error={error}
        onRetry={handleWatchTrailer}
        onDismiss={() => setError(null)}
      />
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* --- 1. Backdrop Image (Fixed Position/Scrollable background) --- */}
      <View style={styles.backdropContainer}>
        <Image source={{ uri: imageUrl }} style={styles.backdrop} />
        <View style={styles.backdropOverlay} />

        {/* --- Back Button --- */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Image
            source={backIcon}
            style={{
              width: 16,
              height: 16,
              tintColor: Colors.white, // recolor PNG if it's pure black
            }}
          />
        </TouchableOpacity>

        {/* --- 'Watch' Title Header --- */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>Watch</Text>
        </View>

        {/* --- Movie Info on Backdrop --- */}
        <View style={styles.titleContainer}>
          <Text style={styles.movieTitleOnBackdrop}>{movie.title}</Text>
          <Text style={styles.releaseDate}>
            In Theaters {movie.release_date}
          </Text>

          {/* --- Action Buttons (Below releaseDate) --- */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.buttonBase, styles.getTicketsButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.getTicketsText}>Get Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonBase, styles.watchTrailerButton]}
              activeOpacity={0.8}
              onPress={handleWatchTrailer}
            >
              <Text style={styles.watchTrailerIcon}>▶</Text>
              <Text style={styles.watchTrailerText}>Watch Trailer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/*/!* --- Action Buttons (Now inside ScrollView) --- *!/*/}
        {/*<View style={styles.actionButtons}>*/}
        {/*  <TouchableOpacity style={styles.getTicketsButton} activeOpacity={0.8}>*/}
        {/*    <Text style={styles.getTicketsText}>Get Tickets</Text>*/}
        {/*  </TouchableOpacity>*/}

        {/*  <TouchableOpacity style={styles.watchTrailerButton} activeOpacity={0.8}>*/}
        {/*    <Text style={styles.watchTrailerIcon}>▶</Text>*/}
        {/*    <Text style={styles.watchTrailerText}>Watch Trailer</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
      </View>

      {/* --- 2. Scrollable Content Area (Starts at the bottom of the backdrop) --- */}
      <ScrollView
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Padding to push content down and make space for buttons */}
        <View style={styles.paddingTopForButtons} />

        {/* --- Content Sections --- */}
        <View style={styles.contentSectionsWrapper}>
          {/* Genres */}
          <View style={[styles.section, styles.genreSection]}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genreTags}>
              {genres.slice(0, 4).map((genre, index) => (
                <View
                  key={index}
                  style={[styles.genreTag, { backgroundColor: genre.color }]}
                >
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionSeparator} />

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>

          {/* Removed redundant stats section for simplicity and focus on the image layout */}
        </View>
      </ScrollView>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // --- Backdrop Styles ---
  backdropContainer: {
    position: 'absolute',
    width: width,
    height: BACKDROP_HEIGHT,
    zIndex: 0,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  // --- Header/Title on Backdrop ---
  headerTitleContainer: {
    position: 'absolute',
    top: 55, // Adjusted for status bar
    left: 70,
  },
  headerTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjusted for status bar
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    lineHeight: 24,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 150, // distance from bottom of the backdrop
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  movieTitleOnBackdrop: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for the title
    marginBottom: 4,
    textAlign: 'center',
  },
  releaseDate: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  // --- Scrollable Content Styles ---
  scrollableContent: {
    flex: 1,
    zIndex: 1, // Ensure content is above the backdrop
    // Start the scroll view right below the backdrop
    marginTop: BACKDROP_HEIGHT - 60, // Start scrolling about 60px above the bottom of the backdrop

    backgroundColor: '#fff',
  },
  paddingTopForButtons: {
    height: 40, // Reserve space for buttons to visually sit over the backdrop
  },
  actionButtons: {
    flexDirection: 'column', // stack vertically
    justifyContent: 'center',
    gap: 12, // space between buttons
    marginTop: 12, // space below releaseDate
    alignItems: 'center', // center buttons horizontally
    width: '100%',
  },

  // Common button style
  buttonBase: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160, // both buttons same minimum width
    width: '60%', // optional: scale with screen width
  },

  getTicketsButton: {
    backgroundColor: Colors.blue,
  },

  getTicketsText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },

  watchTrailerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.blue,
    flexDirection: 'row',
  },

  watchTrailerIcon: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },

  watchTrailerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  // --- General Content Styles ---
  contentSectionsWrapper: {
    paddingHorizontal: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 20,
    marginTop: -80, // Pull up the D/S icons
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  circleIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    paddingVertical: 8,
  },
  genreSection: {
    paddingTop: 0,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
    marginBottom: 12,
  },
  genreTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  genreText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
  },
  overview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
});

export default MovieDetailScreen;
