/**
 * Service paging error.
 */
export class ServicePageError extends Error {
    constructor(message) {
        super(message);
    }
}
/**
 * Service paging.
 */
export class ServicePage {
    /**
     * Construct a new service paging helper.
     * @param service - The service to call `pageFunction` from.
     * @param pageFunction - The function to paginate.
     * @param parameters - The current parameters as of current request.
     * @param nextPageFunction - The next page function to refer to for parameters.
     * @param previousPageFunction - The previous page function to refer to for parameters.
     * @param dataTransformer - The function to transform the data.
     * @param data - The data returned from the last call, or undefined.
     * @param pageNumber - The current page number.
     */
    constructor(service, pageFunction, parameters, nextPageFunction, previousPageFunction, dataTransformer, data, pageNumber) {
        /**
         * The function to paginate.
         * @private
         */
        Object.defineProperty(this, "_pageFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The next page function to refer to for parameters.
         * @private
         */
        Object.defineProperty(this, "_nextPageFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The previous page function to refer to for parameters.
         * @private
         */
        Object.defineProperty(this, "_previousPageFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The current parameters as of current request.
         * @private
         */
        Object.defineProperty(this, "_parameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The service to call `pageFunction` from.
         * @private
         */
        Object.defineProperty(this, "_service", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Data tranformer to be read by external sources.
         * @private
         */
        Object.defineProperty(this, "_dataTransformer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The data returned from the last call. If it is undefined, then `getCurrentPage()` has not been called yet.
         */
        Object.defineProperty(this, "_data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The page number.
         */
        Object.defineProperty(this, "pageNumber", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this._service = service;
        this._pageFunction = pageFunction;
        this._parameters = parameters;
        this._nextPageFunction = nextPageFunction;
        this._previousPageFunction = previousPageFunction;
        this._dataTransformer = dataTransformer;
        this._data = data;
        if (pageNumber)
            this.pageNumber = pageNumber;
    }
    /**
     * The returned from the last call. If it is undefined, then `getCurrentPage()` has not been called yet.
     *
     * This data is either modified or the original data from the API response.
     */
    get data() {
        if (this._dataTransformer) {
            return this._dataTransformer(this._data);
        }
        return this._data;
    }
    /**
     * Get if there is a next page.
     */
    hasNextPage() {
        return this._nextPageFunction(this._parameters, this._data) !==
            undefined;
    }
    /**
     * Get if there is a previous page.
     */
    hasPreviousPage() {
        return this._previousPageFunction?.(this._parameters, this._data) !==
            undefined;
    }
    /**
     * Async iterator implementation for the data.
     */
    async *[Symbol.asyncIterator]() {
        // deno-lint-ignore no-this-alias
        let currentPage = this;
        if (currentPage.hasNextPage()) {
            yield currentPage.data;
        }
        else {
            yield (await currentPage.getCurrentPage()).data;
        }
        while (currentPage.hasNextPage()) {
            currentPage = await currentPage.getNextPage();
            yield currentPage.data;
        }
    }
    /**
     * Paginate to the next page. If `nextPageFunction` returns `undefined`, it will error. Otherwise, it will go on with the request.
     */
    async getNextPage() {
        if (!this.hasNextPage()) {
            throw new ServicePageError("Got undefined from `nextPageFunction`, it can not go further or the current page has not yet been queried.");
        }
        const parameters = this._nextPageFunction(this._parameters, this._data);
        const data = await this._pageFunction.apply(this._service, parameters);
        return new ServicePage(this._service, this._pageFunction, parameters, this._nextPageFunction, this._previousPageFunction, this._dataTransformer, data, this.pageNumber + 1);
    }
    /**
     * Re-fetch the current page and replaces current data wirh new data.
     */
    async getCurrentPage() {
        this._data = await this._pageFunction.apply(this._service, this._parameters);
        return this;
    }
    /**
     * Paginate to the previous page. It will error if `previousPageFunction` was never supplied. If `preivousPageFunction` returns `undefined`, it will error. Otherwise, it will go on with the request.
     */
    async getPreviousPage() {
        if (!this._previousPageFunction) {
            throw new ServicePageError("Can not paginate to the previous page because `previousPageFunction` was never provided.");
        }
        if (!this.hasNextPage()) {
            throw new ServicePageError("Got undefined from `preivousPageFunction`, it can not go further or the current page has not yet been queried.");
        }
        const parameters = this._previousPageFunction(this._parameters, this._data);
        const data = await this._pageFunction.apply(this._service, parameters);
        return new ServicePage(this._service, this._pageFunction, parameters, this._nextPageFunction, this._previousPageFunction, this._dataTransformer, data, this.pageNumber + 1);
    }
}
