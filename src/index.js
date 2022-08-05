import fetch from "node-fetch";
import { access, mkdir, writeFile, readFile } from "node:fs/promises";
import { html2Object } from "html2object";
import fuzzysort from "fuzzysort";

const docsURL = "https://documents.devdocs.io";
// ########################### basic functions #################################### //

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function saveFetchedToFile(path, filename, content) {
	const folderExists = await exists(path);
	if (!folderExists) {
		await mkdir(path, { recursive: true });
	}
	const fullPath = path + "/" + filename;
	writeFile(fullPath, content, "utf8", console.log);
}

async function fetchDoc(path) {
	try {
		const response = await fetch(path);
		const content = await response.text();
		return content;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function convertHTMLToJson(str) {
	const obj = await html2Object(str);
	return JSON.stringify(obj);
}

async function getMainDoc(defaultURL = docsURL) {
	try {
		const response = await fetch(`${defaultURL}/docs.json`);
		const content = await response.text();
		return content;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function getDocFromSlug(slug, file, defaultURL = docsURL) {
	const htmlDoc = await fetchDoc(`${defaultURL}/${slug}/${file}.html`);
	return htmlDoc;
}

async function slugDocList(arr, defaultURL = docsURL) {
	const slugJsonArr = [];
	for (let slug of arr) {
		const content = await fetchDoc(`${defaultURL}/${slug}/index.json`);
		slugJsonArr.push({ name: slug, content });
	}
	return slugJsonArr;
}

//getDocFromSlug("angular", "api/animations/animationmetadata");
//const d = await getMainDoc();
// ######################  node   ######################################### //

async function getFileConvertAndSave(slug, filename) {
	const doc = await getDocFromSlug("react", "hooks-reference");
	const converted = convertHTMLToJson(doc);
	await saveFetchedToFile(
		"./devdocs/react",
		"hooks-reference.json",
		converted
	);
}

async function getSlugsAndSave(arr, path = "./devdocs") {
	const slugs = await slugDocList(arr);
	for (let { name, content } of slugs) {
		await saveFetchedToFile(`${path}/${name}`, "index.json", content);
	}
}

//await getSlugsAndSave(["react"]);
// ######################### read and search ###################################### //
function search(content, entries, rules) {
	const results = fuzzysort.go(content, entries, rules);
	return results;
}

async function searchFromFile(
	slug,
	content,
	rules = { limit: 15, key: "name" },
	searchFunc = search
) {
	const doc = await readFile(`./devdocs/${slug}/index.json`, "utf8");
	const { entries } = JSON.parse(doc);
	return searchFunc(content, entries, rules);
}

//const a = await searchFromFile("react", "useC");
//console.log(a);
//const b = await searchFromFile("react", "memo");
//console.log(b);
