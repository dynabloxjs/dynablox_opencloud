/**
 * Helper for OpenCloud ratelimit handling.
 */
export class RatelimitHelper {
    /**
     * Construct a new RatelimitHelper instance.
     * @param options - The ratelimits to set.
     */
    constructor(options) {
        /**
         * The current subject ID.
         * @private
         */
        Object.defineProperty(this, "_currentId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * A list of global and individual subjects with ratelimits.
         * @private
         */
        Object.defineProperty(this, "_subjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * The options given to the constructor.
         * @private
         */
        Object.defineProperty(this, "_options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._options = options;
        this._subjects.push(...["All", "AuthenticatedIP", "NotAuthenticated"]
            .map((type) => {
            return {
                type,
                ratelimits: [],
            };
        }));
    }
    /**
     * Get a subject's global limitations.
     * @param subject - The target subject.
     */
    static getGlobalSubjectLimitations(subject) {
        if (!subject)
            return ["All", "NotAuthenticated"];
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
    static getIndividualSubjectLimitations(subject) {
        if (subject.type === "Authenticated") {
            return ["Authenticated"];
        }
        // Should never reach this point
        return [];
    }
    /**
     * Register a new subject.
     * @param type - The type of the subject.
     */
    registerSubject(type) {
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
    deregisterSubject(id) {
        this._subjects = this._subjects.filter((subject) => subject.id !== id);
    }
    /**
     * Remove expired ratelimits in the instance.
     */
    removeExpiredRatelimits() {
        for (const subject of this._subjects) {
            for (const [index, ratelimit] of subject.ratelimits.entries()) {
                const limitation = this._options[ratelimit.index];
                if (!((Date.now() - ratelimit.startTime.getTime()) <
                    limitation.duration)) {
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
    listSubjectRatelimits(method, url, id) {
        const targetSubject = id !== undefined
            ? this._subjects.find((subject) => subject.id === id)
            : undefined;
        const ratelimits = [];
        const subjectLimitations = targetSubject
            ? RatelimitHelper
                .getIndividualSubjectLimitations(targetSubject)
            : [];
        const globalLimitations = RatelimitHelper.getGlobalSubjectLimitations(targetSubject);
        for (const subject of this._subjects) {
            // Global would be undefined
            if (subject.id === undefined || subject.id === targetSubject?.id) {
                for (const ratelimit of subject.ratelimits) {
                    const limitation = this._options[ratelimit.index];
                    const match = limitation.pattern.exec(url);
                    if (match) {
                        const dependencies = [];
                        if (limitation.dependencies) {
                            for (const dependency of limitation.dependencies) {
                                if (match.pathname.groups[dependency]) {
                                    dependencies.push(match.pathname.groups[dependency]);
                                }
                                if (url.searchParams.has(dependency)) {
                                    dependencies.push(url.searchParams.get(dependency));
                                }
                            }
                        }
                        if ((!limitation.dependencies?.length ||
                            ratelimit.dependencies.every((value, index) => dependencies[index] === value)) &&
                            (limitation.methods.includes(method)) &&
                            ((limitation.limitations.some((r) => subjectLimitations.includes(r))) || (limitation.limitations.some((r) => globalLimitations.includes(r))))) {
                            ratelimits.push(ratelimit);
                        }
                    }
                }
            }
        }
        for (const [limitationIndex, limitation] of this._options.entries()) {
            const match = limitation.pattern.exec(url);
            if (limitation.methods.includes(method) &&
                match) {
                const dependencies = [];
                if (limitation.dependencies) {
                    for (const dependency of limitation.dependencies) {
                        if (match.pathname.groups[dependency]) {
                            dependencies.push(match.pathname.groups[dependency]);
                        }
                        if (url.searchParams.has(dependency)) {
                            dependencies.push(url.searchParams.get(dependency));
                        }
                    }
                }
                for (const type of limitation.limitations.filter((type) => (subjectLimitations.includes(type) ||
                    globalLimitations.includes(type)) &&
                    !ratelimits.find((ratelimit) => (ratelimit.index ===
                        limitationIndex) &&
                        (ratelimit.origin === type) &&
                        (!limitation.dependencies?.length ||
                            ratelimit.dependencies.every((value, index) => dependencies[index] === value))))) {
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
    incrementRatelimits(method, url, id, count = 1) {
        this.removeExpiredRatelimits();
        const targetSubject = id !== undefined
            ? this._subjects.find((subject) => subject.id === id)
            : undefined;
        const subjectLimitations = targetSubject
            ? RatelimitHelper
                .getIndividualSubjectLimitations(targetSubject)
            : [];
        const globalLimitations = RatelimitHelper.getGlobalSubjectLimitations(targetSubject);
        // Global would be undefined
        for (const subject of this._subjects.filter((subject) => subject.id === undefined || subject.id == targetSubject?.id)) {
            for (const ratelimit of subject.ratelimits) {
                const limitation = this._options[ratelimit.index];
                const match = limitation.pattern.exec(url);
                if (match) {
                    const dependencies = [];
                    if (limitation.dependencies) {
                        for (const dependency of limitation.dependencies) {
                            if (match.pathname.groups[dependency]) {
                                dependencies.push(match.pathname.groups[dependency]);
                            }
                            if (url.searchParams.has(dependency)) {
                                dependencies.push(url.searchParams.get(dependency));
                            }
                        }
                    }
                    if ((subjectLimitations.includes(ratelimit.origin) ||
                        globalLimitations.includes(ratelimit.origin)) &&
                        (limitation.methods.includes(method)) &&
                        ((limitation.limitations.some((r) => subjectLimitations.includes(r))) || (limitation.limitations.some((r) => globalLimitations.includes(r)))) &&
                        (!limitation.dependencies?.length ||
                            ratelimit.dependencies.every((value, index) => dependencies[index] === value))) {
                        ratelimit.count += count;
                    }
                }
            }
            for (const [limitationIndex, limitation] of this._options.entries()) {
                const match = limitation.pattern.exec(url);
                if (limitation.methods.includes(method) &&
                    match) {
                    const dependencies = [];
                    if (limitation.dependencies) {
                        for (const dependency of limitation.dependencies) {
                            if (match.pathname.groups[dependency]) {
                                dependencies.push(match.pathname.groups[dependency]);
                            }
                            if (url.searchParams.has(dependency)) {
                                dependencies.push(url.searchParams.get(dependency));
                            }
                        }
                    }
                    for (const type of limitation.limitations.filter((type) => (subject.type === type &&
                        (subject.id === undefined
                            ? globalLimitations.includes(type)
                            : subjectLimitations.includes(type))) &&
                        !subject.ratelimits.find((ratelimit) => (ratelimit.index ===
                            limitationIndex &&
                            ratelimit.origin === type) &&
                            (!limitation.dependencies?.length ||
                                ratelimit.dependencies.every((value, index) => dependencies[index] === value))))) {
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
    getRequestAvailability(method, url, id) {
        this.removeExpiredRatelimits();
        return this.listSubjectRatelimits(method, url, id).every((ratelimit) => {
            const limitation = this._options[ratelimit.index];
            return ratelimit.count < limitation.count;
        });
    }
    /**
     * Gets the date of the request availability for a URL and method for a subject.
     * @param method - The HTTP method.
     * @param url - The HTTP url.
     * @param id - The target subject ID.
     */
    getNextRequestAvailability(method, url, id) {
        this.removeExpiredRatelimits();
        const dates = this.listSubjectRatelimits(method, url, id).filter((ratelimit) => {
            const limitation = this._options[ratelimit.index];
            return ratelimit.count >= limitation.count;
        }).map((ratelimit) => {
            const limitation = this._options[ratelimit.index];
            if (limitation.count < 1)
                return;
            return new Date(Date.now() + limitation.duration);
        });
        if (dates.some((date) => date === undefined))
            return;
        return dates.reduce((a, b) => a > b ? a : b);
    }
}
