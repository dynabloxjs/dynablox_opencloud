/**
 * DataStore kentr yversion info.
 */
export class DataStoreEntryVersionInfo {
	/**
	 * The version id.
	 */
	public readonly id?: string;

	/**
	 * The time the version was created at.
	 */
	public readonly createdTime?: Date;

	/**
	 * The time the entry was first created at.
	 */
	public readonly entryCreatedTime?: Date;

	/**
	 * Whether the version was deleted.
	 */
	public readonly deleted?: boolean;

	/**
	 * The content length of the entry version.
	 */
	public readonly contentLength?: number;

	/**
	 * Create a new DataStore entry version info.
	 * @param id - The version id.
	 * @param createdTime - The time the version was created at.
	 * @param entryCreatedTime - The time the entry was first created at.
	 * @param deleted - Whether the version was deleted.
	 * @param contentLength - The content length of the entry version.
	 */
	constructor(
		id?: string,
		createdTime?: string,
		entryCreatedTime?: string,
		deleted?: boolean,
		contentLength?: number,
	) {
		this.id = id;
		this.createdTime = createdTime ? new Date(createdTime) : undefined;
		this.entryCreatedTime = entryCreatedTime
			? new Date(entryCreatedTime)
			: undefined;
		this.deleted = deleted;
		this.contentLength = contentLength;
	}
}
