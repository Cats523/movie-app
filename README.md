# Movie App

A React Native application that lists upcoming movies using **The Movie Database (TMDb) API**, allows searching movies, viewing movie details, and watching trailers.

---

## Features

- **Movie List Screen**
  - Displays all upcoming movies with poster, title, and release date.
  - Tap a movie to navigate to **Movie Detail Screen**.

- **Movie Detail Screen**
  - Shows movie details fetched from TMDb API.
  - “Watch Trailer” button opens full-screen trailer player.
  - Trailer can be manually played by the user.
  - Player closes automatically or via the “X” button.



- **Movie Search Screen**
  - Search movies by name.
  - Displays search results dynamically.

- **Trailer Screen**
  - Plays YouTube trailers using TMDb API.
  - Shows loading indicator until video starts.
  - Handles network errors gracefully.
  - Network connectivity check implemented.

- **Error Handling**
  - Displays proper messages for API failures and network issues.

---

## APIs Used

- **Upcoming Movies**  
  `GET /movie/upcoming`  
  - Fetches all upcoming movies.

- **Movie Videos (Trailers)**  
  `GET /movie/{movieId}/videos`  
  - Fetches YouTube trailer links for the selected movie.

> Note: Replace the dummy API key in `api.ts` with your own TMDb API key.

---

## Project Flow

1. **Launch App → Movie List Screen**
2. **Select a Movie → Movie Detail Screen**
3. **Press “Watch Trailer” → Trailer Screen**
   - Network check before playing
   - Plays and closes automatically
4. **Search movies via Search Screen**

---


