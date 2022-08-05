import { access, mkdir, writeFile, readFile } from "node:fs/promises";

export async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

export async function saveFetchedToFile(path, filename, content) {
	const folderExists = await exists(path);
	if (!folderExists) {
		await mkdir(path, { recursive: true });
	}
	const fullPath = path + "/" + filename;
	writeFile(fullPath, content, "utf8", console.log);
}

export async function getFileConvertAndSave(slug, filename) {
	const doc = await getDocFromSlug("react", "hooks-reference");
	const converted = convertHTMLToJson(doc);
	await saveFetchedToFile(
		"./devdocs/react",
		"hooks-reference.json",
		converted
	);
}

export async function getSlugsAndSave(arr, path = "./devdocs") {
	const slugs = await slugDocList(arr);
	for (let { name, content } of slugs) {
		await saveFetchedToFile(`${path}/${name}`, "index.json", content);
	}
}

export async function searchFromFile(
	slug,
	content,
	rules = { limit: 15, key: "name" },
	searchFunc = search,
	mainPath = "./devdocs"
) {
	const doc = await readFile(`${mainPath}/${slug}/index.json`, "utf8");
	const { entries } = JSON.parse(doc);
	return searchFunc(content, entries, rules);
}
