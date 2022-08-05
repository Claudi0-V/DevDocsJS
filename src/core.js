import fetch from "node-fetch";
import fuzzysort from "fuzzysort";
import { html2Object } from "html2object";

const docsURL = "https://documents.devdocs.io";

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

export async function convertHTMLToJson(str) {
	const obj = await html2Object(str);
	return JSON.stringify(obj);
}

export async function getMainDoc(defaultURL = docsURL) {
	try {
		const response = await fetch(`${defaultURL}/docs.json`);
		const content = await response.text();
		return content;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export async function getDocFromSlug(slug, file, defaultURL = docsURL) {
	const htmlDoc = await fetchDoc(`${defaultURL}/${slug}/${file}.html`);
	return htmlDoc;
}

export async function slugDocList(arr, defaultURL = docsURL) {
	const slugJsonArr = [];
	for (let slug of arr) {
		const content = await fetchDoc(`${defaultURL}/${slug}/index.json`);
		slugJsonArr.push({ name: slug, content });
	}
	return slugJsonArr;
}

export function search(content, entries, rules) {
	const results = fuzzysort.go(content, entries, rules);
	return results;
}
