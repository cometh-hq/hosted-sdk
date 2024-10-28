export interface OAuthTokenResponse {
    access_token: string,
    expires_in: number,
    id_token: string,
    scope: string,
    token_type: string
}

export interface ProfileResponse {
    sub: string
    email: string
    wallet: string
    nickname: string
}
