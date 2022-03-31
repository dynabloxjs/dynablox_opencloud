import { type HTTPMethod as Method } from "../rest/RESTController.ts";

export type Limitation =
	| "All"
	| "AuthenticatedIP"
	| "NotAuthenticated"
	| "Authenticated";

export type RegisterIdentifierType = "Authenticated";

export interface SubjectRatelimit {
	index: number;
	origin: Limitation;
	count: number;
	dependencies: string[];
	startTime?: Date;
}

export interface RegisteredSubject {
	type: Limitation;
	id?: number;
	ratelimits: SubjectRatelimit[];
}

export interface Ratelimit {
	methods: Method[];
	pattern: URLPattern;
	limitations: Limitation[];
	duration: number;
	count: number;
	dependencies?: string[];
}

/**
 * Helper for OpenCloud ratelimit handling.
 */
export class RatelimitHelper {
	/**
	 * Get a subject's global limitations.
	 * @param subject - The target subject.
	 */
	public static getGlobalSubjectLimitations(
		subject?: RegisteredSubject,
	): Limitation[] {
		if (!subject) return ["All", "NotAuthenticated"];

		if (subject.type === "Authenticated") {
			return ["All", "AuthenticatedIP"];
		}

		// Should never reach this point
		return ["All", "NotAuthenticated"];
	}

	/**
	 * Get a subject's individual limitations.
	 * @param subject
	 */
	public static getIndividualSubjectLimitations(
		subject: RegisteredSubject,
	): Limitation[] {
		if (subject.type === "Authenticated") {
			return ["Authenticated"];
		}

		// Should never reach this point
		return [];
	}

	/**
	 * The current subject ID.
	 * @private
	 */
	private _currentId = 0;

	/**
	 * A list of global and individual subjects with ratelimits.
	 * @private
	 */
	private _subjects: RegisteredSubject[] = [];

	/**
	 * The options given to the constructor.
	 * @private
	 */
	private readonly _options: Ratelimit[];

	/**
	 * Construct a new RatelimitHelper instance.
	 * @param options - The ratelimits to set.
	 */
	constructor(options: Ratelimit[]) {
		this._options = options;
		this._subjects.push(
			...(["All", "AuthenticatedIP", "NotAuthenticated"] as Limitation[])
				.map((type) => {
					return {
						type,
						ratelimits: [],
					};
				}),
		);
	}

	/**
	 * Register a new subject.
	 * @param type - The type of the subject.
	 */
	public registerSubject(type: RegisterIdentifierType): number {
		const id = this._currentId++;
		this._subjects.push({
			type,
			id,
			ratelimits: [],
		});

		return id;
	}

	/**
	 * De-register a registered subject by ID.
	 * @param id - The target subject ID.
	 */
	public deregisterSubject(id: number): void {
		this._subjects = this._subjects.filter((subject) => subject.id !== id);
	}

	/**
	 * Remove expired ratelimits in the instance.
	 */
	public removeExpiredRatelimits(): void {
		for (const subject of this._subjects) {
			for (const [index, ratelimit] of subject.ratelimits.entries()) {
				const limitation = this._options[ratelimit.index];

				if (
					!((Date.now() - ratelimit.startTime!.getTime()) <
						limitation.duration)
				) {
					subject.ratelimits.splice(index, 1);
				}
			}
		}
	}

	/**
	 * List a subject's global and individual ratelimits, even if some are 0.
	 * @param method - The HTTP method.
	 * @param url - The HTTP url.
	 * @param id - The target subject ID.
	 */
	public listSubjectRatelimits(
		method: Method,
		url: URL,
		id?: number,
	): SubjectRatelimit[] {
		const targetSubject = id !== undefined
			? this._subjects.find((subject) => subject.id === id)
			: undefined;
		const ratelimits: SubjectRatelimit[] = [];

		const subjectLimitations = targetSubject
			? RatelimitHelper
				.getIndividualSubjectLimitations(
					targetSubject,
				)
			: [];

		const globalLimitations = RatelimitHelper.getGlobalSubjectLimitations(
			targetSubject,
		);

		for (const subject of this._subjects) {
			// Global would be undefined
			if (subject.id === undefined || subject.id === targetSubject?.id) {
				for (const ratelimit of subject.ratelimits) {
					const limitation = this._options[ratelimit.index];

					const match = limitation.pattern.exec(url);

					if (match) {
						const dependencies: string[] = [];
						if (limitation.dependencies) {
							for (const dependency of limitation.dependencies) {
								if (match.pathname.groups[dependency]) {
									dependencies.push(
										match.pathname.groups[dependency],
									);
								}
								if (url.searchParams.has(dependency)) {
									dependencies.push(
										url.searchParams.get(dependency)!,
									);
								}
							}
						}

						if (
							(!limitation.dependencies?.length ||
								ratelimit.dependencies!.every((
									value,
									index,
								) => dependencies[index] === value)) &&
							(limitation.methods.includes(method)) &&
							((limitation.limitations.some((r) =>
								subjectLimitations.includes(r)
							)) || (limitation.limitations.some((r) =>
								globalLimitations.includes(r)
							)))
						) {
							ratelimits.push(ratelimit);
						}
					}
				}
			}
		}

		for (const [limitationIndex, limitation] of this._options.entries()) {
			const match = limitation.pattern.exec(url);
			if (
				limitation.methods.includes(method) &&
				match
			) {
				const dependencies: string[] = [];
				if (limitation.dependencies) {
					for (const dependency of limitation.dependencies) {
						if (match.pathname.groups[dependency]) {
							dependencies.push(
								match.pathname.groups[dependency],
							);
						}
						if (url.searchParams.has(dependency)) {
							dependencies.push(
								url.searchParams.get(dependency)!,
							);
						}
					}
				}

				for (
					const type of limitation.limitations.filter((type) =>
						(subjectLimitations.includes(type) ||
							globalLimitations.includes(type)) &&
						!ratelimits.find((ratelimit) =>
							(ratelimit.index ===
								limitationIndex) &&
							(ratelimit.origin === type) &&
							(!limitation.dependencies?.length ||
								ratelimit.dependencies!.every((
									value,
									index,
								) => dependencies[index] === value))
						)
					)
				) {
					ratelimits.push({
						index: limitationIndex,
						origin: type,
						count: 0,
						dependencies,
					});
				}
			}
		}

		return ratelimits;
	}

	/**
	 * Increment all global and individual ratelimits for a subject ID by `count`.
	 * @param method - The HTTP method.
	 * @param url - The HTTP url.
	 * @param id - The target subject ID.
	 * @param count - The number to increment by.
	 */
	public incrementRatelimits(
		method: Method,
		url: URL,
		id?: number,
		count = 1,
	): void {
		this.removeExpiredRatelimits();

		const targetSubject = id !== undefined
			? this._subjects.find((subject) => subject.id === id)
			: undefined;

		const subjectLimitations = targetSubject
			? RatelimitHelper
				.getIndividualSubjectLimitations(
					targetSubject,
				)
			: [];

		const globalLimitations = RatelimitHelper.getGlobalSubjectLimitations(
			targetSubject,
		);

		// Global would be undefined
		for (
			const subject of this._subjects.filter((subject) =>
				subject.id === undefined || subject.id == targetSubject?.id
			)
		) {
			for (const ratelimit of subject.ratelimits) {
				const limitation = this._options[ratelimit.index];

				const match = limitation.pattern.exec(url);
				if (match) {
					const dependencies: string[] = [];
					if (limitation.dependencies) {
						for (const dependency of limitation.dependencies) {
							if (match.pathname.groups[dependency]) {
								dependencies.push(
									match.pathname.groups[dependency],
								);
							}
							if (url.searchParams.has(dependency)) {
								dependencies.push(
									url.searchParams.get(dependency)!,
								);
							}
						}
					}

					if (
						(subjectLimitations.includes(ratelimit.origin) ||
							globalLimitations.includes(ratelimit.origin)) &&
						(limitation.methods.includes(method)) &&
						((limitation.limitations.some((r) =>
							subjectLimitations.includes(r)
						)) || (limitation.limitations.some((r) =>
							globalLimitations.includes(r)
						))) &&
						(!limitation.dependencies?.length ||
							ratelimit.dependencies!.every((
								value,
								index,
							) => dependencies[index] === value))
					) {
						ratelimit.count += count;
					}
				}
			}

			for (
				const [limitationIndex, limitation] of this._options.entries()
			) {
				const match = limitation.pattern.exec(url);

				if (
					limitation.methods.includes(method) &&
					match
				) {
					const dependencies: string[] = [];
					if (limitation.dependencies) {
						for (const dependency of limitation.dependencies) {
							if (match.pathname.groups[dependency]) {
								dependencies.push(
									match.pathname.groups[dependency],
								);
							}
							if (url.searchParams.has(dependency)) {
								dependencies.push(
									url.searchParams.get(dependency)!,
								);
							}
						}
					}

					for (
						const type of limitation.limitations.filter((type) =>
							(subject.type === type &&
								(subject.id === undefined
									? globalLimitations.includes(type)
									: subjectLimitations.includes(type))) &&
							!subject.ratelimits.find(
								(ratelimit) =>
									(ratelimit.index ===
											limitationIndex &&
										ratelimit.origin === type) &&
									(!limitation.dependencies?.length ||
										ratelimit.dependencies!.every((
											value,
											index,
										) => dependencies[index] === value)),
							)
						)
					) {
						subject.ratelimits.push({
							index: limitationIndex,
							origin: type,
							count,
							startTime: new Date(),
							dependencies,
						});
					}
				}
			}
		}
	}

	/**
	 * Gets the request availability for a URL and method for a subject.
	 * @param method - The HTTP method.
	 * @param url - The HTTP url.
	 * @param id - The target subject ID.
	 */
	public getRequestAvailability(
		method: Method,
		url: URL,
		id?: number,
	): boolean {
		this.removeExpiredRatelimits();

		return this.listSubjectRatelimits(method, url, id).every(
			(ratelimit) => {
				const limitation = this._options[ratelimit.index];

				return ratelimit.count < limitation.count;
			},
		);
	}

	/**
	 * Gets the date of the request availability for a URL and method for a subject.
	 * @param method - The HTTP method.
	 * @param url - The HTTP url.
	 * @param id - The target subject ID.
	 */
	public getNextRequestAvailability(
		method: Method,
		url: URL,
		id?: number,
	): Date | undefined {
		this.removeExpiredRatelimits();

		const dates = this.listSubjectRatelimits(method, url, id).filter(
			(ratelimit) => {
				const limitation = this._options[ratelimit.index];

				return ratelimit.count >= limitation.count;
			},
		).map((ratelimit) => {
			const limitation = this._options[ratelimit.index];

			if (limitation.count < 1) return;
			return new Date(Date.now() + limitation.duration);
		});

		if (dates.some((date) => date === undefined)) return;

		return (dates as Date[]).reduce((a, b) => a > b ? a : b);
	}
}
