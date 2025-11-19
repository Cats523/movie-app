import api from './api.ts';
import { MovieVideosResponse, UpcomingMoviesResponse } from './movies.types.ts';
import { ApiError } from './api.error';

export const MovieService = {
  getUpcomingMovies: async (): Promise<UpcomingMoviesResponse> => {
    try {
      const response = await api.get<UpcomingMoviesResponse>('/movie/upcoming');
      return response.data;
    } catch (error) {

      throw error as ApiError;
    }
  },

  getMovieVideos: async (movieId: number): Promise<MovieVideosResponse> => {
    try {
      const response = await api.get<MovieVideosResponse>(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

