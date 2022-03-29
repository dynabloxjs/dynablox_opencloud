/**
 * DataStore key info.
 */
export class DataStoreEntry<Data, Attributes extends Record<string, unknown>> {
	/**
	 * The value of the entry.
	 */
	public readonly data: Data;

	/**
	 * Metadata UserIDs for the entry.
	 */
	public readonly userIds: number[] | null;

	/**
	 * Metadata attributes for the entry.
	 */
	public readonly attributes: Attributes | null;

	/**
	 * The version key.
	 */
	public readonly versionId: string | null;

	/**
	 * The time the version was created at.
	 */
	public readonly versionCreatedTime: Date | null;

	/**
	 * The time the entry was first created at.
	 */
	public readonly createdTime: Date | null;

	/**
	 * Create a new DataStore entry info.
	 * @param data - The value of the entry.
	 * @param userIds - Metadata UserIDs for the entry.
	 * @param attributes - Metadata attributes for the entry.
	 * @param versionId - The version key.
	 * @param versionCreatedTime - The time the version was created at.
	 * @param createdTime - The time the entry was first created at.
	 */
	constructor(
		data: Data,
		userIds: number[] | null,
		attributes: Attributes | null,
		versionId: string | null,
		versionCreatedTime: string | null,
		createdTime: string | null,
	) {
		this.data = data;
		this.userIds = userIds;
		this.attributes = attributes;
		this.versionId = versionId;
		this.versionCreatedTime = versionCreatedTime
			? new Date(versionCreatedTime)
			: null;
		this.createdTime = createdTime ? new Date(createdTime) : null;
	}
}
