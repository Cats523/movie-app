// src/components/SearchResultItem/SearchResultItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MovieItem } from '../../services/movies.types';
import Colors from '../../theme/colors.ts';


interface SearchResultItemProps {
  movie: MovieItem;
  onPress?: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ movie, onPress }) => {
  console.log(movie)
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/150/0000FF/FFFFFF?text=No+Image'; // Placeholder

  const genreText = 'Fantasy';

  return (
    // <TouchableOpacity
    //   style={styles.card}
    //   onPress={() => onPress(movie)}
    //   activeOpacity={0.7}
    // >
    //   <Image source={{ uri: imageUrl }} style={styles.poster} />
    //
    //   <View style={styles.textContainer}>
    //     <Text style={styles.title} numberOfLines={1}>
    //       {movie.title}
    //     </Text>
    //     <Text style={styles.genre}>{genreText}</Text>
    //   </View>
    //
    //   <View style={styles.ellipsisContainer}>
    //     <Text style={styles.ellipsisIcon}>...</Text>
    //   </View>
    // </TouchableOpacity>
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.poster} />
      <View >
        <View style={styles.textContainer}>
         <Text style={styles.title} numberOfLines={1}>
              {movie.title}
       </Text>
           <Text style={styles.genre}>{genreText}</Text>
          </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 10,
  },
  poster: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#E0E0E0',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flexShrink: 1,
  },
  genre: {
    fontSize: 14,
    color: '#999',
    flexShrink: 1,
  },

});

export default SearchResultItem;