import fetch from "node-fetch";
import { access, mkdir, writeFile } from "node:fs/promises";
import Path from "node:path";
import * as url from "url";

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

async function getDoc(path) {
	try {
		const response = await fetch(path);
		const content = await response.text();
		return content;
	} catch (err) {
		console.log(err);
		return null;
	}
}
