import axios, { type AxiosInstance } from 'axios'
import type { OAuthTokenResponse, ProfileResponse } from './types'
import { safeURL } from '@/utils/safeURLBuilder'
import type { PKCEChallenge } from '@/utils/pkce'

//TODO: put in config
const authCallback = '/callback/auth'

export default class OidcAPI {
	private api: AxiosInstance

	constructor(private apiKey: string, private apiUrl: string, private appUrl: string) {
		this.api = axios.create({
			baseURL: apiUrl
		})
	}

	async authenticateWithCode(code: string, codeVerifier: string): Promise<OAuthTokenResponse> {
		const params = new URLSearchParams()
		params.append('grant_type', 'authorization_code')
		params.append('client_id', this.apiKey)
		params.append('code', code)
		params.append('code_verifier', codeVerifier)
		params.append('redirect_uri', safeURL(this.appUrl, authCallback))

		try {
			const response = await this.api.post('/token', params, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			})
			return response.data
		} catch (error) {
			console.error('Error getting project', error)
			throw error
		}
	}

	prepareAuthUrl(pkce: PKCEChallenge): string {
		const params = new URLSearchParams()
		params.append('response_type', 'code')
		params.append('client_id', this.apiKey)
		params.append('redirect_uri', safeURL(this.appUrl, authCallback))
		params.append('scope', 'openid wallet email profile')
		params.append('code_challenge', pkce.code_challenge)
		params.append('code_challenge_method', pkce.method)
		return safeURL(this.apiUrl, `/auth?${params.toString()}`)
	}

	async me(token: string): Promise<ProfileResponse> {
		try {
			const response = await this.api.get('/me', {
				headers: { Authorization: `Bearer ${token}` }
			})
			return response.data
		} catch (error) {
			console.error('Error getting project', error)
			throw error
		}
	}
}

const oidcApi = (apiUrl: string, appUrl: string, apiKey: string): OidcAPI => {
	return new OidcAPI(apiUrl, appUrl, apiKey)
}

export { oidcApi }
