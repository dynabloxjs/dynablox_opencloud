const infinity = "1e309";

/** JSON.parse with BigInt support */
export function deserialize(text: string): unknown {
	return JSON.parse(
		text.replace(/([^"]+":\s*)(\d{16,})/g, '$1"$2n"').replace(
			/([^"]+":\s*)inf/g,
			`$1${infinity}`,
		),
		(_, v) => {
			if (typeof v === "string" && /^\d{16,}n$/.test(v)) {
				v = BigInt(v.slice(0, -1));
			}

			return v;
		},
	);
}

/** JSON.stringify with BigInt support */
export function serialize(
	value: unknown,
	space?: number,
	lua?: boolean,
): string {
	return JSON.stringify(value, (_, v) => {
		if (typeof v === "bigint") {
			v = `_NUMBER_${v.toString()}n`;
		} else if (typeof v === "number" && !Number.isFinite(v)) {
			v = `_NUMBER_${lua ? "inf" : infinity}`;
		}

		return v;
	}, space).replace(/:"_NUMBER_(.+?)n?"/g, ":$1");
}
