/**
 * An object whose properties are keyed by string and may all have a common type.
 */
export interface Properties<TProperty = unknown> {
	[key: string]: TProperty;	
}

/** A usage context of an application and its status. */
export interface IDimensions {
	/** The set of dimensions used to categorise this usage. */
	dimensions: Properties<string>;
}

/** The core details of an application. */
export interface IApplication {
	/** The meta data associated with the application. */
	detail: Properties;
}

/** The usage that an application can be put to. */
export interface IUsage {
	/** The data showing the application usage context over time. */
	usage: Array<IDimensions & Properties>;
}

/** A user-defined composite key into the data for determining uniqueness within the displayed data */
export interface IKey {
	/** The major key will be used for the text in the final displayed table */
	major: string;

	/** The minor key will be used to style */
	minor: string;
}

/** A key in a wider data structure */
export interface IKeyed {
	key: IKey;
}