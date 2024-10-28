import type Embedded from '@/core/app/embedded'
import type { EmbeddedConfiguration } from '@/core/app/embedded'
import embeddedFactory from '@/core/app/factory'
import { DisplayMode } from '@/configuration'
import {
    type Wallet,
    type EventRequestDTO,
    EventType,
    type ResponseRequestAccountsDTO,
    type ResponseSendTransactionDTO
} from '@/core/app/types'
import { WalletStorage } from '@/utils/storage/WalletStorage'
import { getFaviconUrl } from '@/utils/getFaviconUrl'
import type { ConnectParameters, Hex } from '@/types'

export default class DisplayableWallet {
    protected storage = new WalletStorage()
    private embedded: Embedded

    constructor(display: DisplayMode, config: EmbeddedConfiguration, private defaultChain: number, private hidden: boolean = false) {
        this.embedded = embeddedFactory(display, config)
        this.embedded.initialize()
    }

    private async _openDisplay(parameters?: ConnectParameters): Promise<void> {
        const reload = this.embedded.open(undefined, {
            chain_id: parameters?.chainIds?.[0]?.toString()
        }, !this.hidden)
        if (reload) {
            await this.waitActionResponse<void>(EventType.DISPLAY_READY, false)
        }
    }

    protected _closeDisplay() {
        this.embedded.close()
    }

    async connect(parameters?: ConnectParameters): Promise<Wallet> {
        await this._openDisplay(parameters)
        const walletInfoPromise = this.waitActionResponse<ResponseRequestAccountsDTO>(
            EventType.REQUEST_ACCOUNTS,
            false
        )
        this.embedded.sendMessage({
            client: this.getClient(),
            type: EventType.REQUEST_ACCOUNTS,
            chainId: this.getChainId(),
            data: { chainIds: parameters?.chainIds }
        })
        const walletInfo = await walletInfoPromise

        console.log({
            walletInfo,
            address: walletInfo.currentAccount,
            chainIds: walletInfo.chainIds
        })

        const address = walletInfo.currentAccount
        const chainIds = walletInfo.chainIds
        this.storage.setAddress(address)
        this.storage.setCurrentChainId(chainIds[0])
        this.storage.setChainIds(chainIds)
        this._closeDisplay()
        return {
            address,
            chainId: chainIds[0]
        }
    }

    disconnect() {
        this.embedded.close()
        this.storage.clear()
    }

    protected async triggerAction(message: EventRequestDTO) {
        await this._openDisplay()
        this.embedded.sendMessage(message)
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

    async switchChain(id: number) {
        const availableChainIds = this.storage.getChainIds()
        if (!availableChainIds || (availableChainIds && !availableChainIds?.includes(id))) {
            const request: EventRequestDTO = {
                type: EventType.SWITCH_CHAIN,
                data: { id },
                client: this.getClient(),
                chainId: id
            }
            await this.triggerAction(request)
            await this.waitActionResponse<ResponseSendTransactionDTO>(EventType.SWITCH_CHAIN)

            this.storage.setChainIds([...(availableChainIds || []), id])
        }

        this.storage.setCurrentChainId(id)
    }

    getAddress(): Hex | undefined {
        return this.storage.getAddress() || undefined
    }

    getChainId(): number {
        return this.storage.getCurrentChainId() || this.defaultChain
    }

    getClient() {
        return {
            name: document.title,
            icon: getFaviconUrl(),
            url: window.location.href
        }
    }
}
