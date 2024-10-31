import type Embedded from '@/core/app/embedded'
import embeddedFactory from '@/core/app/factory'
import { DisplayMode } from '@/configuration'
import { EventType, type OAuthToken, type Profile, type ResponseOAuthTokenRedirectDTO } from '@/core/app/types'
import { getFaviconUrl } from '@/utils/getFaviconUrl'
import { AuthStorage } from '@/utils/storage/AuthStorage'
import getPkce, { type PKCEChallenge } from '@/utils/pkce'
import OidcAPI from '@/core/apis/oidcAPI/oidcAPI'
import { safeURL } from '@/utils/safeURLBuilder'

export default class DisplayableAuth {
    protected storage = new AuthStorage()
    private embedded: Embedded
    private oidcAPI: OidcAPI

    constructor(apiKey: string, oidcApiUrl: string, oidcAppUrl: string, display: DisplayMode) {
        const oidcURL = new URL(oidcApiUrl)
        this.embedded = embeddedFactory(display,
            {
                authorizedOrigin: oidcURL.origin,
                defaultURL: safeURL(oidcApiUrl, `/auth?client_id=${apiKey}`),
                allowCreatePasskey: true,
                allowGetPasskey: true
            })
        this.embedded.initialize()
        this.oidcAPI = new OidcAPI(apiKey, oidcApiUrl, oidcAppUrl)
    }

    private async _openDisplay(url: string): Promise<void> {
        const reload = this.embedded.open(url)
        if (reload) {
            await this.waitActionResponse<void>(EventType.DISPLAY_READY, false)
        }
    }

    protected async waitActionResponse<T>(
        type: EventType,
        closeOnSuccess: boolean = true
    ): Promise<T> {
        try {
            const result = await this.embedded.waitMessage<T>(type)
            if (closeOnSuccess) {
                this._closeDisplay()
            }
            return result
        } catch (e) {
            this._closeDisplay()
            throw e
        }
    }

    protected _closeDisplay() {
        this.embedded.close()
    }

    private async _exchangeCodeForToken(
        result: ResponseOAuthTokenRedirectDTO,
        pkce: PKCEChallenge
    ): Promise<OAuthToken> {
        return this.oidcAPI.authenticateWithCode(result.code, pkce.code_verifier)
    }

    private async _redirectToLogin(pkce: PKCEChallenge) {
        const url = this.oidcAPI.prepareAuthUrl(pkce)
        await this._openDisplay(url)
    }

    async login(): Promise<Profile> {
        if (this.isAuthenticated()) {
            const profile = this.getProfile()
            if (profile) {
                return profile
            }
        }
        const pkce = await getPkce()
        await this._redirectToLogin(pkce)
        const result = await this.waitActionResponse<ResponseOAuthTokenRedirectDTO>(EventType.OAUTH_TOKEN_REDIRECT)
        const response = await this._exchangeCodeForToken(result, pkce)
        const profile = await this.oidcAPI.me(response.access_token)
        this.storage.setEmail(profile.email)
        this.storage.setJWT(response)
        return {
            email: profile.email,
            token: response
        }
    }

    logout() {
        this.embedded.close()
        this.storage.clear()
    }

    getEmail(): string | undefined {
        return this.storage.getEmail() || undefined
    }

    getProfile(): Profile | undefined {
        const email = this.getEmail()
        const token = this.storage.getJWT()
        if (!email || !token) return undefined
        return {
            email,
            token
        }
    }

    isAuthenticated(): boolean {
        // TODO check JWT expiration
        return !!this.storage.getJWT()
    }

    getClient() {
        return {
            name: document.title,
            icon: getFaviconUrl(),
            url: window.location.href
        }
    }
}
