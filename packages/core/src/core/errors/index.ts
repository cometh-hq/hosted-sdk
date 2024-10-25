export class UnauthorizedMethodError extends Error {
    constructor(methodName: string) {
        super(`Not authorized method: ${methodName}`)
    }
}

export class RelayedTransactionPendingError extends Error {
    constructor(public relayId: string) {
        super(
            `The transaction has not been confirmed yet on the network, you can track its progress using its relayId:${relayId}`
        )
    }
}

export class UnknownChainIdError extends Error {
    constructor() {
        super('ChainID is null')
    }
}
