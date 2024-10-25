export type Address = `0x${string}`
export type Hash = `0x${string}`
export type Hex = `0x${string}`
export type ByteArray = Uint8Array

export interface SendTransactionResponse {
	txHash: Hash
}

export interface MetaTransaction {
	to: Address
	value: string
	data: Hash
}

export type ConnectParameters = {
	chainIds: number[]
	isReconnecting?: boolean | undefined
}

export type SignableMessage =
	| string
	| {
	/** Raw data representation of the message. */
	raw: Hex | ByteArray
}
