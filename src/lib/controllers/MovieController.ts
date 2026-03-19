import {api, showErrorMessage} from "../index.ts";

export async function getMovieList(pageNumber: number, limitNumber: number) {

    const query = `/movie?page=${pageNumber}
    &limit=${limitNumber}
    &selectFields=id
    &selectFields=name
    &selectFields=year
    &selectFields=rating
    &selectFields=poster
    &notNullFields=poster.url
    &sortField=rating.kp
    &sortType=-1
    `

    try {
        const response = await api.get(query);

        if (response.data.docs.length === 0) return undefined;

        return response.data.docs;
    } catch (error){
        if (showErrorMessage) console.error('Ошибка получения списка фильмов', error);

        return undefined;
    }
}