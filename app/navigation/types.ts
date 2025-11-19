import { MovieItem } from '../services/movies.types.ts';

export type RootTabParamList = {
  Dashboard: undefined;
  Watch: undefined;
  'Media Library': undefined;
  More: undefined;
};
export type RootStackParamList = {
  DashboardMain: undefined;
  Search: undefined;
  MovieDetail: { movie: MovieItem };
  TrailerPlayer: { trailerUrl: string };
};