import pkceChallenge from 'pkce-challenge'

export interface PKCEChallenge {
    code_verifier: string
    code_challenge: string
    method: string
}

const getPkce = async (): Promise<PKCEChallenge> => {
    const result = await pkceChallenge()
    return {
        code_verifier: result.code_verifier,
        code_challenge: result.code_challenge,
        method: "S256"
    }
}

export default getPkce