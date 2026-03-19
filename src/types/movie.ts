
export interface Movie {
    id: number;
    title: string;
    year: number;
    rating: number;
    poster: string;
    genres: string[];
}

export interface MovieListDoc {
    id: number;
    name?: string;
    year?: number;
    rating?: {
        kp?: number;
        imdb?: number;
    };
    poster?: {
        url?: string;
        previewUrl?: string;
    };
}

export interface MovieListResponse {
    docs: MovieListDoc[];
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

