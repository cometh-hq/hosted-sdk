import { LocalStorage } from '@/utils/storage/LocalStorage'
import type { KeyValueStorage } from '@/utils/storage/types'
import type { OAuthToken } from '@/core/app/types'

export class AuthStorage {
    private storage: KeyValueStorage = new LocalStorage('hosted-auth')

    getJWT(): OAuthToken | null {
        const token =  this.storage.getItem('jwt')
        if (!token) return null
        return JSON.parse(token)
    }

    setJWT(token: OAuthToken) {
        this.storage.setItem('jwt', JSON.stringify(token))
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
