import { DisplayMode, type WalletConfiguration } from '@/configuration'
import { safeURL } from '@/utils/safeURLBuilder'
import { type Wallet } from '@/core/app/types'
import { OIDC_APP_URI, OIDC_URI } from '@/constants'
import DisplayableWallet from '@/core/app/DisplayableWallet'
import type { ConnectParameters } from '@/types'
import DisplayableAuth from '@/core/app/DisplayableAuth'

export default class HostedWallet {
    wallet: DisplayableWallet
    auth: DisplayableAuth

    constructor(apiKey: string, configuration: WalletConfiguration = {}, appChainIds: number[] = []) {
        const oidcURI = new URL(configuration.oidcURI || OIDC_URI)
        const oidcAppURI = configuration.oidcAppURI || OIDC_APP_URI
        this.wallet = new DisplayableWallet(
            DisplayMode.IFRAME,
            {
                authorizedOrigin: oidcURI.origin,
                defaultURL: safeURL(oidcAppURI, `/iframe/wallet?client_id=${apiKey}`),
                allowCreatePasskey: false,
                allowGetPasskey: true
            },
            appChainIds.length > 0 ? appChainIds[0] : 1,
            true
        )
        this.auth = new DisplayableAuth(
            apiKey,
            oidcURI.toString(),
            oidcAppURI,
            DisplayMode.POPUP,
            {
                authorizedOrigin: oidcURI.origin,
                defaultURL: safeURL(oidcAppURI, `/auth?client_id=${apiKey}`),
                allowCreatePasskey: true,
                allowGetPasskey: true
            }
        )
    }

    async login(parameters?: ConnectParameters): Promise<{ email: string } & Wallet> {
        if (!this.auth.isAuthenticated()) {
            await this.auth.login()
        }
        const wallet = await this.wallet.connect(parameters)
        return {
            address: wallet.address,
            chainId: wallet.chainId,
            email: this.auth.getEmail()!
        }
    }

    logout() {
        this.auth.logout()
        return this.wallet.disconnect()
    }
}
