import { type BaseService } from "../services/BaseService.ts";

/**
 * Service paging error.
 */
export class ServicePageError extends Error {
	constructor(message: string) {
		super(message);
	}
}

/**
 * Service paging.
 */
export class ServicePage<
	// deno-lint-ignore no-explicit-any
	PageFunction extends (...args: any[]) => Promise<unknown>,
	DataTransformed = Awaited<ReturnType<PageFunction>>,
> {
	/**
	 * The function to paginate.
	 * @private
	 */
	private readonly _pageFunction: PageFunction;

	/**
	 * The next page function to refer to for parameters.
	 * @private
	 */
	private readonly _nextPageFunction: (
		parameters: Parameters<PageFunction>,
		data?: Awaited<ReturnType<PageFunction>>,
	) => Parameters<PageFunction> | undefined;

	/**
	 * The previous page function to refer to for parameters.
	 * @private
	 */
	private readonly _previousPageFunction:
		| ((
			parameters: Parameters<PageFunction>,
			data?: Awaited<ReturnType<PageFunction>>,
		) => Parameters<PageFunction> | undefined)
		| undefined;

	/**
	 * The current parameters as of current request.
	 * @private
	 */
	private readonly _parameters: Parameters<PageFunction>;

	/**
	 * The service to call `pageFunction` from.
	 * @private
	 */
	private readonly _service: BaseService;

	/**
	 * Data tranformer to be read by external sources.
	 * @private
	 */
	private readonly _dataTransformer?: (
		data: Awaited<ReturnType<PageFunction>>,
	) => DataTransformed;

	/**
	 * The data returned from the last call. If it is undefined, then `getCurrentPage()` has not been called yet.
	 */
	private _data?: Awaited<ReturnType<PageFunction>>;

	/**
	 * The page number.
	 */
	public pageNumber = 0;

	/**
	 * The returned from the last call. If it is undefined, then `getCurrentPage()` has not been called yet.
	 *
	 * This data is either modified or the original data from the API response.
	 */
	public get data():
		| DataTransformed
		| Awaited<ReturnType<PageFunction>>
		| undefined {
		if (this._dataTransformer) {
			return this._dataTransformer(
				this._data as Awaited<ReturnType<PageFunction>>,
			);
		}

		return this._data;
	}

	/**
	 * Get if there is a next page.
	 */
	public hasNextPage(): boolean {
		return this._nextPageFunction(this._parameters, this._data) !==
			undefined;
	}

	/**
	 * Get if there is a previous page.
	 */
	public hasPreviousPage(): boolean {
		return this._previousPageFunction?.(this._parameters, this._data) !==
			undefined;
	}

	/**
	 * Async iterator implementation for the data.
	 */
	public async *[Symbol.asyncIterator](): AsyncGenerator<
		Awaited<DataTransformed>,
		void,
		void
	> {
		// deno-lint-ignore no-this-alias
		let currentPage: ServicePage<PageFunction, DataTransformed> = this;
		if (currentPage.hasNextPage()) {
			yield currentPage.data as DataTransformed;
		} else {
			yield (await currentPage.getCurrentPage()).data as DataTransformed;
		}

		while (currentPage.hasNextPage()) {
			currentPage = await currentPage.getNextPage();
			yield currentPage.data as DataTransformed;
		}
	}

	/**
	 * Paginate to the next page. If `nextPageFunction` returns `undefined`, it will error. Otherwise, it will go on with the request.
	 */
	public async getNextPage(): Promise<
		ServicePage<PageFunction, DataTransformed>
	> {
		if (!this.hasNextPage()) {
			throw new ServicePageError(
				"Got undefined from `nextPageFunction`, it can not go further or the current page has not yet been queried.",
			);
		}

		const parameters = this._nextPageFunction(
			this._parameters,
			this._data,
		)!;

		const data = await this._pageFunction.apply(this._service, parameters);
		return new ServicePage<PageFunction, DataTransformed>(
			this._service,
			this._pageFunction,
			parameters,
			this._nextPageFunction,
			this._previousPageFunction,
			this._dataTransformer,
			data as Awaited<ReturnType<PageFunction>>,
			this.pageNumber + 1,
		);
	}

	/**
	 * Re-fetch the current page and replaces current data wirh new data.
	 */
	public async getCurrentPage(): Promise<
		ServicePage<PageFunction, DataTransformed>
	> {
		this._data = await this._pageFunction.apply(
			this._service,
			this._parameters,
		) as Awaited<ReturnType<PageFunction>>;

		return this;
	}

	/**
	 * Paginate to the previous page. It will error if `previousPageFunction` was never supplied. If `preivousPageFunction` returns `undefined`, it will error. Otherwise, it will go on with the request.
	 */
	public async getPreviousPage(): Promise<
		ServicePage<PageFunction, DataTransformed>
	> {
		if (!this._previousPageFunction) {
			throw new ServicePageError(
				"Can not paginate to the previous page because `previousPageFunction` was never provided.",
			);
		}

		if (!this.hasNextPage()) {
			throw new ServicePageError(
				"Got undefined from `preivousPageFunction`, it can not go further or the current page has not yet been queried.",
			);
		}
		const parameters = this._previousPageFunction(
			this._parameters,
			this._data,
		)!;

		const data = await this._pageFunction.apply(this._service, parameters);
		return new ServicePage<PageFunction, DataTransformed>(
			this._service,
			this._pageFunction,
			parameters,
			this._nextPageFunction,
			this._previousPageFunction,
			this._dataTransformer,
			data as Awaited<ReturnType<PageFunction>>,
			this.pageNumber + 1,
		);
	}

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
	constructor(
		service: BaseService,
		pageFunction: PageFunction,
		parameters: Parameters<PageFunction>,
		nextPageFunction: (
			parameters: Parameters<PageFunction>,
			data?: Awaited<ReturnType<PageFunction>>,
		) => Parameters<PageFunction> | undefined,
		previousPageFunction?: (
			parameters: Parameters<PageFunction>,
			data?: Awaited<ReturnType<PageFunction>>,
		) => Parameters<PageFunction> | undefined,
		dataTransformer?: (
			data: Awaited<ReturnType<PageFunction>>,
		) => DataTransformed,
		data?: Awaited<ReturnType<PageFunction>>,
		pageNumber?: number,
	) {
		this._service = service;
		this._pageFunction = pageFunction;
		this._parameters = parameters;
		this._nextPageFunction = nextPageFunction;
		this._previousPageFunction = previousPageFunction;
		this._dataTransformer = dataTransformer;
		this._data = data;
		if (pageNumber) this.pageNumber = pageNumber;
	}
}
