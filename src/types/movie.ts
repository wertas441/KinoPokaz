
export interface Movie {
    id: number;
    title: string;
    year: number;
    rating: number;
    poster: string;
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

