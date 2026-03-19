import {api, showErrorMessage} from "../index.ts";
import type {Movie, MovieListDoc, MovieListPage, MovieListResponse} from "../../types/movie.ts";

function mapListDocToMovie(doc: MovieListDoc): Movie {
    const kp = doc.rating?.kp ?? 0;
    const imdb = doc.rating?.imdb ?? 0;
    let rating = kp > 0 ? kp : imdb;

    if (!Number.isFinite(rating)) rating = 0;

    const poster = doc.poster?.url ?? doc.poster?.previewUrl ?? '';

    return {
        id: doc.id,
        title: doc.name ?? '',
        year: doc.year ?? 0,
        rating,
        poster,
        genres: [],
    };
}

export async function getMovieList(pageNumber: number, limitNumber: number): Promise<MovieListPage> {

    const query = [
        `/movie?page=${pageNumber}`,
        `limit=${limitNumber}`,
        `selectFields=id`,
        `selectFields=name`,
        `selectFields=year`,
        `selectFields=rating`,
        `selectFields=poster`,
        `notNullFields=poster.url`,
        `sortField=rating.kp`,
        `sortType=-1`,
    ].join('&');

    try {
        const { data } = await api.get<MovieListResponse>(query);

        const docs = Array.isArray(data?.docs) ? data.docs : [];

        return {
            movies: docs.map(mapListDocToMovie),
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

export async function getMovieDetails(id: string) {

    const query = [
        `/movie?id=${id}`,
        `selectFields=name`,
        `selectFields=description`,
        `selectFields=rating`,
        `selectFields=year`,
        `selectFields=genres`,
        `selectFields=poster`,
        `selectFields=premiere`,
    ].join('&');

    try {
        const response = await api.get(query);

        if (response.data.docs.length === 0) return undefined;

        return response.data.docs;
    } catch (error){
        if (showErrorMessage) console.error('Ошибка получения подробной информации о фильме', error);

        return undefined;
    }
}
