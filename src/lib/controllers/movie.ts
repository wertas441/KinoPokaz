import {api, showErrorMessage} from "../index.ts";
import type {Movie} from "../../types/movie.ts";

interface MovieListDoc {
    id: number;
    name: string;
    year: number;
    rating: {
        kp: number;
        imdb: number
    };
    poster: {
        url?: string;
        previewUrl?: string
    };
}

function mapListDocToMovie(doc: MovieListDoc): Movie {
    const rating = doc.rating.kp > 0 ? doc.rating.kp : doc.rating.imdb;
    const poster = doc.poster?.url ?? doc.poster?.previewUrl ?? '';

    return {
        id: doc.id,
        title: doc.name,
        year: doc.year,
        rating,
        poster,
        genres: [],
    };
}

export async function getMovieList(pageNumber: number, limitNumber: number): Promise<Movie[]> {

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
    ].join('&')

    try {
        const response = await api.get<{ docs: MovieListDoc[] }>(query);

        const docs = response.data?.docs;

        if (!Array.isArray(docs) || docs.length === 0) return [];

        return docs.map(mapListDocToMovie);
    } catch (error) {
        if (showErrorMessage) console.error('Ошибка получения списка фильмов', error);

        return [];
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
