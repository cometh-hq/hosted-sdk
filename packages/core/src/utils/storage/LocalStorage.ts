import { type KeyValueStorage, ScopedStorage } from './types'

export class LocalStorage extends ScopedStorage implements KeyValueStorage {
	constructor(module?: string) {
		super(module)
	}

	setItem(key: string, value: string): void {
		if (!localStorage) return
		localStorage.setItem(this.scopedKey(key), value)
	}

	getItem(key: string): string | null {
		if (!localStorage) return null
		return localStorage.getItem(this.scopedKey(key))
	}

	removeItem(key: string): void {
		if (!localStorage) return
		localStorage.removeItem(this.scopedKey(key))
	}

	clear() {
		if (!localStorage) return
		const prefix = this.scopedKey('')
		const keysToRemove: string[] = []
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			if (typeof key === 'string' && key.startsWith(prefix)) {
				keysToRemove.push(key)
			}
		}
		keysToRemove.forEach((key) => localStorage.removeItem(key))
	}
}
