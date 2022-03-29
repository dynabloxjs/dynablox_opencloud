import { type BaseService } from "../services/BaseService.js";
/**
 * Service paging error.
 */
export declare class ServicePageError extends Error {
    constructor(message: string);
}
/**
 * Service paging.
 */
export declare class ServicePage<PageFunction extends (...args: any[]) => Promise<unknown>, DataTransformed = Awaited<ReturnType<PageFunction>>> {
    /**
     * The function to paginate.
     * @private
     */
    private readonly _pageFunction;
    /**
     * The next page function to refer to for parameters.
     * @private
     */
    private readonly _nextPageFunction;
    /**
     * The previous page function to refer to for parameters.
     * @private
     */
    private readonly _previousPageFunction;
    /**
     * The current parameters as of current request.
     * @private
     */
    private readonly _parameters;
    /**
     * The service to call `pageFunction` from.
     * @private
     */
    private readonly _service;
    /**
     * Data tranformer to be read by external sources.
     * @private
     */
    private readonly _dataTransformer?;
    /**
     * The data returned from the last call. If it is undefined, then `getCurrentPage()` has not been called yet.
     */
    private _data?;
    /**
     * The page number.
     */
    pageNumber: number;
    /**
     * The returned from the last call. If it is undefined, then `getCurrentPage()` has not been called yet.
     *
     * This data is either modified or the original data from the API response.
     */
    get data(): DataTransformed | Awaited<ReturnType<PageFunction>> | undefined;
    /**
     * Get if there is a next page.
     */
    hasNextPage(): boolean;
    /**
     * Get if there is a previous page.
     */
    hasPreviousPage(): boolean;
    /**
     * Async iterator implementation for the data.
     */
    [Symbol.asyncIterator](): AsyncGenerator<Awaited<DataTransformed>, void, void>;
    /**
     * Paginate to the next page. If `nextPageFunction` returns `undefined`, it will error. Otherwise, it will go on with the request.
     */
    getNextPage(): Promise<ServicePage<PageFunction, DataTransformed>>;
    /**
     * Re-fetch the current page and replaces current data wirh new data.
     */
    getCurrentPage(): Promise<ServicePage<PageFunction, DataTransformed>>;
    /**
     * Paginate to the previous page. It will error if `previousPageFunction` was never supplied. If `preivousPageFunction` returns `undefined`, it will error. Otherwise, it will go on with the request.
     */
    getPreviousPage(): Promise<ServicePage<PageFunction, DataTransformed>>;
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
    constructor(service: BaseService, pageFunction: PageFunction, parameters: Parameters<PageFunction>, nextPageFunction: (parameters: Parameters<PageFunction>, data?: Awaited<ReturnType<PageFunction>>) => (Parameters<PageFunction> | undefined), previousPageFunction?: ((parameters: Parameters<PageFunction>, data?: Awaited<ReturnType<PageFunction>>) => Parameters<PageFunction> | undefined), dataTransformer?: (data: Awaited<ReturnType<PageFunction>>) => DataTransformed, data?: Awaited<ReturnType<PageFunction>>, pageNumber?: number);
}
