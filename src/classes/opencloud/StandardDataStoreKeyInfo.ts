/**
 * Standard DataStore info class for Open Cloud.
 */
export class StandardDataStoreKeyInfo {
	/**
	 * The name of the datastore.
	 */
	public readonly name: string;

	/**
	 * Creation date of the datastore.
	 */
	public readonly createdDate: Date;

	/**
	 * Construct a new StandardDataStoreKeyInfo.
	 * @param name - The name of the datastore.
	 * @param createdDate - Creation date of the datastore.
	 */
	constructor(name: string, createdDate: string) {
		this.name = name;
		this.createdDate = new Date(createdDate);
	}
}
