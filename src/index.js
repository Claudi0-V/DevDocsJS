import fetch from "node-fetch";
import { access, mkdir, writeFile, readFile } from "node:fs/promises";
import Path from "node:path";
import * as url from "url";
import { html2Object } from "html2object";

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
		const content = await fetchDoc(`${defaultURL}/${slug}/db.json`);
		slugJsonArr.push({ name: slug, content });
	}
	return slugJsonArr;
}

//getDocFromSlug("angular", "api/animations/animationmetadata");
//const d = await getMainDoc();

// ######################  node   ######################################### //

const getFileConvertAndSave = async (slug, filename) => {
	const doc = await getDocFromSlug("react", "hooks-reference");
	const converted = convertHTMLToJson(doc);
	await saveFetchedToFile(
		"./devdocs/react",
		"hooks-reference.json",
		converted
	);
};

const getSlugsAndSave = async (arr, path = "./devdocs") => {
	const slugs = await slugDocList(arr);
	for (let { name, content } of slugs) {
		await saveFetchedToFile(`${path}/${name}`, "db.json", content);
	}
};

// await getSlugsAndSave(["react", "Angular"]);
// ######################### read and search ###################################### //
// JSON.parse(config) readFile
