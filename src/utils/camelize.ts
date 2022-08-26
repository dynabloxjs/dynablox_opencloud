function camelCaseString(str: string): string {
	return str.split("").reverse().map((character, index, array) => {
		if (character == " " || character == "_" || character == "-") return;

		if (index === array.length - 1) return character.toLowerCase();
		const nextCharacter = array[index + 1];

		if (
			nextCharacter == " " || nextCharacter == "_" || nextCharacter == "-"
		) {
			return character.toUpperCase();
		}
		return character;
	}).reverse().join("");
}

// Ported from "https://github.com/sindresorhus/camelcase-keys/blob/main/index.js" for use in Deno.
const cache = new Map<string, string>();

// deno-lint-ignore ban-types
const isObject = (value: unknown): value is Object =>
	typeof value === "object" &&
	value !== null &&
	!(value instanceof RegExp) &&
	!(value instanceof Error) &&
	!(value instanceof Date);

export function camelizeObject(
	input: unknown,
	options: {
		deep: boolean;
		pascalCase: boolean;
		exclude?: string[];
		stopPaths?: string[];
	} = { deep: false, pascalCase: false },
) {
	if (!isObject(input)) {
		return input;
	}

	const { exclude, pascalCase, stopPaths, deep } = options;

	const stopPathsSet = new Set(stopPaths);

	const makeMapper =
		(parentPath?: string) => (key: string | number, value: unknown) => {
			if (deep && isObject(value)) {
				const path = parentPath === undefined
					? key.toString()
					: `${parentPath}.${key}`;

				if (Array.isArray(value)) {
					const newValue = value.map((value, index) =>
						Array.from(makeMapper(path)(index, value))
					);
					const valueToSet: unknown[] = [];
					newValue.forEach(([index, value]) =>
						valueToSet[index as number] = value
					);

					value = valueToSet;
				} else if (!stopPathsSet.has(path)) {
					value = Object.fromEntries(
						Object.entries(value).map(([key, value]) =>
							makeMapper(path)(key, value)
						),
					);
				}
			}

			if (
				!Number.isInteger(key) &&
				!(exclude && exclude.includes(key as string))
			) {
				const cacheKey = pascalCase ? `${key}_` : key;

				if (cache.has(cacheKey as string)) {
					key = cache.get(cacheKey as string)!;
				} else {
					const returnValue = camelCaseString(key as string);

					if ((key as string).length < 100) { // Prevent abuse
						cache.set(cacheKey as string, returnValue);
					}

					key = returnValue;
				}
			}

			return [key, value];
		};

	if (Array.isArray(input)) {
		const newInput = input.map((value, index) =>
			Array.from(makeMapper(undefined)(index, value))
		);
		const output: unknown[] = [];
		newInput.forEach(([index, value]) => output[index as number] = value);

		return output;
	} else {
		return Object.fromEntries(
			Object.entries(input).map(([key, value]) =>
				makeMapper(undefined)(key, value)
			),
		);
	}
}
