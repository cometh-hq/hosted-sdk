import { LocalStorage } from '@/utils/storage/LocalStorage'
import type { KeyValueStorage } from '@/utils/storage/types'

export class AuthStorage {
    private storage: KeyValueStorage = new LocalStorage('hosted-auth')

    getJWT(): string | null {
        return this.storage.getItem('jwt')
    }

    setJWT(address: string) {
        this.storage.setItem('jwt', address)
    }

    getRefreshJWT(): string | null {
        return this.storage.getItem('jwt-refresh')
    }

    setRefreshJWT(address: string) {
        this.storage.setItem('jwt-refresh', address)
    }

    getEmail(): string | null {
        return this.storage.getItem('email')
    }

    setEmail(email: string) {
        this.storage.setItem('email', email)
    }

    clear() {
        this.storage.clear()
    }
}
