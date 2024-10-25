export interface KeyValueStorage {
	setItem(key: string, value: string): void

	getItem(key: string): string | null

	removeItem(key: string): void

	clear(): void
}

const scope = 'cometh'

export abstract class ScopedStorage {
	constructor(private module: string | undefined) {}

	scopedKey(key: string) {
		return `-${scope}${this.module ? `:${this.module}` : ''}:${key}`
	}
}
