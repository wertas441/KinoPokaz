
export interface Movie {
    id: number;
    title: string;
    year: number;
    rating: number;
    poster: string;
    movieLength: number;
    genres: string[];
}

export interface MovieDetails extends Movie {
    description: string;
    premiereWorld?: string;
    premiereRussia?: string;
}

export interface MovieDocStructure {
    id: number;
    name: string;
    year: number;
    description?: string;
    movieLength?: number,
    genres: {
        name: string
    }[];
    rating?: {
        kp?: number;
        imdb?: number;
    };
    poster?: {
        url?: string;
        previewUrl?: string;
    };
    premiere?: {
        world?: string;
        russia?: string
    }
}

export interface MovieListResponse {
    docs: MovieDocStructure[];
    page: number;
    pages: number;
    total: number;
}

export interface MovieListPage {
    movies: Movie[];
    page: number;
    pages: number;
    total: number;
}

export interface MovieListRequestOptions {
    genres?: string[];
    fromYear?: string;
    toYear?: string;
    fromRating?: string;
    toRating?: string;
    sortBy?: "rating" | "year" | "title";
}
