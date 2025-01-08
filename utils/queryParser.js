export function queryParser(url){

    if (typeof url !== 'string') {
        throw new Error('Expected a string as the URL to parse');
    }

    if (!url) {
        throw new Error('Kindly supply a URL to parse');
    }

    try {
        const parsedUrl = new URL(url, `http://localhost`).searchParams;
        return Object.fromEntries(parsedUrl);
    } catch (error) {
        throw new Error('Invalid URL provided');
    }
}