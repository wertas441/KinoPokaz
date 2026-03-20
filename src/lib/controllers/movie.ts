import {api, showErrorMessage} from "../index.ts";
import type {
    MovieDetails,
    MovieDocStructure,
    MovieListPage,
    MovieListResponse
} from "../../types/movie.ts";

function mapMoviesData(doc: MovieDocStructure): MovieDetails {

    const kp = doc.rating?.kp ?? 0;
    const imdb = doc.rating?.imdb ?? 0;
    const rating = kp > 0 ? kp : imdb;

    const poster = doc.poster?.url ?? doc.poster?.previewUrl ?? '';

    const genres = (doc.genres ?? [])
        .map((g) => g.name.charAt(0).toUpperCase() + g.name.slice(1));

    return {
        id: doc.id,
        title: doc.name,
        year: doc.year,
        rating,
        poster,
        genres,
        movieLength: doc.movieLength ?? 0,
        description: doc.description ?? '',
        premiereWorld: doc.premiere?.world,
        premiereRussia: doc.premiere?.russia,
    };
}

export async function getMovieList(pageNumber: number, limitNumber: number, options?: string[]): Promise<MovieListPage> {

    const queryParts = [
        `/movie?page=${pageNumber}`,
        `limit=${limitNumber}`,
        `type=movie`,
        `selectFields=id`,
        `selectFields=name`,
        `selectFields=year`,
        `selectFields=rating`,
        `selectFields=genres`,
        `selectFields=poster`,
        `selectFields=movieLength`,
        `notNullFields=poster.url`,
        `sortField=rating.kp`,
        `sortType=-1`,
    ];

    for (const slug of options ?? []) {
        const trimmed = slug.trim();

        if (trimmed) {
            queryParts.push(`genres.name=${encodeURIComponent(`+${trimmed}`)}`);
        }
    }

    const query = queryParts.join("&");

    try {
        const { data } = await api.get<MovieListResponse>(query);

        const docs = Array.isArray(data?.docs) ? data.docs : [];

        return {
            movies: docs.map(mapMoviesData),
            page: data?.page ?? pageNumber,
            pages: data?.pages ?? 0,
            total: data?.total ?? 0,
        };
    } catch (error) {
        if (showErrorMessage) console.error('Ошибка получения списка фильмов', error);

        return {
            movies: [],
            page: pageNumber,
            pages: pageNumber,
            total: 0,
        };
    }
}

export async function getMovieDetails(id: string): Promise<MovieDetails | undefined> {

    const query = [
        `/movie?id=${id}`,
        `selectFields=id`,
        `selectFields=name`,
        `selectFields=description`,
        `selectFields=rating`,
        `selectFields=year`,
        `selectFields=genres`,
        `selectFields=poster`,
        `selectFields=premiere`,
    ].join('&');

    try {
        const { data } = await api.get<{ docs: MovieDocStructure[] }>(query);

        if (!Array.isArray(data.docs) || data.docs.length === 0) return undefined;

        return mapMoviesData(data.docs[0]);
    } catch (error) {
        if (showErrorMessage) console.error('Ошибка получения подробной информации о фильме', error);

        return undefined;
    }
}
