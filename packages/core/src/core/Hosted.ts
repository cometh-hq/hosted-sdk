import { DisplayMode, type WalletConfiguration } from '@/configuration'
import { type Wallet } from '@/core/app/types'
import { OIDC_APP_URL, OIDC_URL } from '@/constants'
import type { ConnectParameters } from '@/types'
import DisplayableAuth from '@/core/app/DisplayableAuth'
import HostedWallet from '@/core/HostedWallet'

export default class Hosted {
    wallet: HostedWallet
    auth: DisplayableAuth

    constructor(apiKey: string, configuration: WalletConfiguration = {}, appChainIds: number[] = []) {
        const oidcURL = configuration.oidcURL || OIDC_URL
        const oidcAppURL = configuration.oidcAppURL || OIDC_APP_URL
        this.wallet = new HostedWallet(
            apiKey,
            configuration,
            appChainIds
        )
        this.auth = new DisplayableAuth(
            apiKey,
            oidcURL,
            oidcAppURL,
            DisplayMode.POPUP
        )
    }

    async login(parameters?: ConnectParameters): Promise<{ email: string } & Wallet> {
        if (!parameters?.isLoggedIn && !this.auth.isAuthenticated()) {
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
