import fuzzysort from "fuzzysort";

export function search(content, entries, rules) {
	const results = fuzzysort.go(content, entries, rules);
	return results;
}
