import fetch from "node-fetch";
import { html2Object } from "html2object";

const docsURL = "https://documents.devdocs.io";

export async function convertHTMLToJson(str) {
	const obj = await html2Object(str);
	return JSON.stringify(obj);
}

export async function fetchDoc(path) {
	try {
		const response = await fetch(path);
		const content = await response.text();
		return content;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function getMainDoc(defaultURL = docsURL) {
	try {
		const response = await fetch(`${defaultURL}/docs.json`);
		return response;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function getDocFromSlug(slug, file, defaultURL = docsURL) {
	const htmlDoc = await fetchDoc(`${defaultURL}/${slug}/${file}.html`);
	const json = await convertHTMLToJson(htmlDoc);
	return json;
}

export async function slugDocList(slug, defaultURL = docsURL) {
	const content = await fetchDoc(`${defaultURL}/${slug}/index.json`);
	return content;
}
