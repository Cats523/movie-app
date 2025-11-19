// Date Range (maximum + minimum)
export interface DateRange {
  maximum: string;
  minimum: string;
}

// Single Movie Item
export interface MovieItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Response for Upcoming Movies API
export interface UpcomingMoviesResponse {
  dates: DateRange;
  page: number;
  results: MovieItem[];
  total_pages: number;
  total_results: number;
}
export interface MovieVideo {
  id: string;
  key: string;          // YouTube video key
  name: string;
  site: string;         // "YouTube"
  size: number;
  type: string;         // "Trailer", "Teaser", etc.
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}
