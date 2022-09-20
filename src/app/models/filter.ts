export type Include<T> = {
	relation: keyof T;
	scope?: any;
};

export interface Filter<T> {
	skip?: string | number;
	limit?: string | number;
	where?: Partial<{ [k in keyof T]: any }>;
	include?: Include<T> | Array<Include<T> | keyof T | Array<keyof T>> | keyof T | Array<keyof T>;
	fields?:any
}
