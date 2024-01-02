import authors from "/src/lib/authors.json";
import mainAuthors from "/src/lib/mainAuthors.json";


export function getAllAuthors() {
    return authors;
}

export function getMainAuthors() {
    return mainAuthors;
}