import {DisplayMode, type WalletConfiguration} from '@/configuration'
import {safeURL} from '@/utils/safeURLBuilder'
import {
    type EventRequestDTO,
    EventType,
    type ResponseSendTransactionDTO,
    type ResponseSignMessageDTO
} from '@/core/app/types'
import { OIDC_APP_URI, OIDC_URI } from '@/constants'
import DisplayableWallet from '@/core/app/DisplayableWallet'
import type {
    Address,
    ByteArray,
    Hex,
    MetaTransaction,
    SendTransactionResponse,
    SignableMessage
} from '@/types'

export default class HostedWallet extends DisplayableWallet {

    constructor(apiKey: string, configuration: WalletConfiguration, appChainIds: number[]) {
        const oidcURI = new URL(configuration.oidcURI || OIDC_URI)
        const oidcAppURI = configuration.oidcAppURI || OIDC_APP_URI
        super(
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
    }

    async signMessage(message: SignableMessage): Promise<Hex> {
        const request: EventRequestDTO = {
            type: EventType.SIGN_MESSAGE,
            data: {message},
            client: this.getClient(),
            chainId: this.getChainId()
        }
        await this.triggerAction(request)
        const response = await this.waitActionResponse<ResponseSignMessageDTO>(
            EventType.SIGN_MESSAGE
        )
        return response.signature
    }

    async sendTransaction(
        metaTransaction: MetaTransaction,
        closeOnSuccess: boolean = true
    ): Promise<SendTransactionResponse> {
        const request: EventRequestDTO = {
            type: EventType.SEND_TRANSACTION,
            data: {metaTransaction},
            client: this.getClient(),
            chainId: this.getChainId()
        }
        await this.triggerAction(request)
        return await this.waitActionResponse<ResponseSendTransactionDTO>(
            EventType.SEND_TRANSACTION,
            closeOnSuccess
        )
    }

    async verifyMessage(
        address: Address,
        message: string,
        signature: Hex | ByteArray
    ): Promise<boolean> {
        // TODO to implement
        console.log('verify: ', address, message, signature)
        throw new Error('not implemented')
    }
}
