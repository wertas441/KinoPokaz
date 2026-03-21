import {api, showErrorMessage} from "../index.ts";
import type {
    MovieDetails,
    MovieDocStructure,
    MovieListPage,
    MovieListRequestOptions,
    MovieListResponse
} from "../../types/movie.ts";
import {buildRatingKpQuery, buildYearQuery, getSortQueryParams} from "../utils/movie.ts";

function mapMoviesData(doc: MovieDocStructure): MovieDetails {

    const kp = doc.rating?.kp ?? 0;
    const imdb = doc.rating?.imdb ?? 0;
    const rating = kp > 0 ? kp : imdb;

    const poster = doc.poster?.url ?? doc.poster?.previewUrl ?? '';

    const genres = (doc.genres ?? []).map((g) => g.name.charAt(0).toUpperCase() + g.name.slice(1));

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

function hasNarrowingFilters(options: MovieListRequestOptions): boolean {

    return Boolean(
        options.fromYear?.trim() ||
        options.toYear?.trim() ||
        options.fromRating?.trim() ||
        options.toRating?.trim(),
    );
}

export async function getMovieList(pageNumber: number, limitNumber: number, options: MovieListRequestOptions = {}): Promise<MovieListPage> {

    const genres = options.genres ?? [];
    const narrowing = hasNarrowingFilters(options);

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
    ];

    for (const slug of genres) {
        const trimmed = slug.trim();

        if (trimmed) {
            queryParts.push(`genres.name=${encodeURIComponent(`+${trimmed}`)}`);
        }
    }

    if (narrowing) {
        const yearQ = buildYearQuery(options.fromYear, options.toYear);

        if (yearQ) queryParts.push(`year=${encodeURIComponent(yearQ)}`);

        const ratingQ = buildRatingKpQuery(options.fromRating, options.toRating);

        if (ratingQ) queryParts.push(`rating.kp=${encodeURIComponent(ratingQ)}`);

        const {field, type} = getSortQueryParams(options.sortBy ?? "rating");

        queryParts.push(`sortField=${encodeURIComponent(field)}`);

        queryParts.push(`sortType=${encodeURIComponent(type)}`);
    } else {
        queryParts.push(`sortField=rating.kp`);

        queryParts.push(`sortType=-1`);
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