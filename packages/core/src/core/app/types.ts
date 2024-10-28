import type {Address, Hash, MetaTransaction} from '@/types'

export interface Profile {
	email: string
	token: OAuthToken
}

export interface Wallet {
	address: Address
	chainId: number
}

export interface OAuthToken {
	access_token: string
	expires_in: number
	id_token: string
	scope: string
	token_type: string
}

/** MESSAGES **/

export interface RequestSignMessageDTO {
	message: string
}

export interface RequestSendTransactionDTO {
	metaTransaction: MetaTransaction
}

export interface ResponseErrorDTO {
	message: string
}

export interface ResponseSignMessageDTO {
	message: string
	signature: Hash
}

export interface ResponseSendTransactionDTO {
	txHash: Hash
}

export interface ResponseRequestAccountsDTO {
	chainIds: number[]
	currentAccount: Address
	accounts: Address[]
}

export interface ResponseOAuthTokenRedirectDTO {
	code: string
	iss: string
}

export interface EventResponseDTO {
	type: EventType
	data: ResponseErrorDTO | any
	success: boolean
}

export interface EventRequestDTO {
	type: EventType
	data: any
	chainId: number
	client?: any
}

export type MessageEventResp = MessageEvent<EventResponseDTO>

export enum EventType {
	OAUTH_TOKEN_REDIRECT = 'OAUTH_TOKEN_REDIRECT',
	DISPLAY_READY = 'DISPLAY_READY',
	SIGN_MESSAGE = 'SIGN_MESSAGE',
	SEND_TRANSACTION = 'SEND_TRANSACTION',
	REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS',
	CLOSE_DIALOG = 'CLOSE_DIALOG',
	SWITCH_CHAIN = 'SWITCH_CHAIN'
}
