# Connect Hosted SDK

Connect Hosted SDK allows developers to interact with Cometh hosted Wallet, combining web2 authentication through an
OIDC provider and web3 wallet using [Connect](https://docs.cometh.io/connect/cometh-connect/what-is-connect).

TODO: put more details about Cometh hosted Wallet (OIDC + Connect)

## Register on Cometh OIDC

Cometh OIDC is the authentication provider for Cometh. In order to use the Cometh hosted Wallet, you need to register
your application on Cometh OIDC.

Steps:

1. Create an account on [Cometh](https://app.cometh.io/). You may have to request access to the platform for your
   company/project.
2. Create a new project
3. Activate OIDC in the project settings

<details>
<summary>or set OIDC config with this API call</summary>

TODO: delete this section once dashboard is ready

1. Request OIDC access (Kong) for your project
2. Call the following API to create your OIDC client

```cURL
curl --location 'https://oidc-hosted-connect.develop.core.cometh.tech' \
--header 'Content-Type: application/json' \
--header 'apisecret: xxx' \ # your api key
--data '{
    "name": "xxx", # your application name
    "redirect_uris": [
        "xxx" # your redirect uri 
    ],
    "grant_types": [
        "authorization_code"
    ],
    "token_endpoint_auth_method": "none",
    "response_types": [
        "code"
    ],
    "allowed_oauth2_providers": ["google", "guest"]
    "scope": "openid wallet email profile"
}'
```

</details>

Once you have activated your client account on ComethOIDC, you can start an OIDC flow in your application.

## Authenticate with Cometh OIDC

### Basic flow

Our SDK provides a simple way to authenticate with Cometh OIDC using IFrames.

Detailed SDK documentation can be found [here](packages/core/README.md).

### Manual & Third-party flow

Cometh OIDC follow the OIDC standard and so can be implemented in any application that supports OIDC authentication. The
details of this implementation are out of the scope of this SDK and will depend on your stack.

The Identity of the user will ultimately contain:

```typescript
interface ComethIdentity {
    sub: string // user id
    wallet: string // wallet address
    nickname?: string
    email?: string
}
```

<details>
<summary>Here is an example on how to use Cometh OIDC with a NextJS application using NextAuth</summary>

```typescript
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/"

interface ComethProfile {
    id: string
    wallet: string
}

export default function Cometh<P extends ComethProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    return {
        id: "cometh",
        name: "Cometh",
        type: "oidc",
        authorization: {
            params: { scope: "openid email profile wallet" },
        },
        checks: ["pkce"],
        issuer: 'https://oidc-hosted-connect.cometh.io',
        profile(profile, tokens) {
            return {
                id: profile.sub,
                wallet: profile.wallet
            };
        },
        ...options,
    };
}
```

</details>

## Hosted Cometh Smart-Wallet

Detailed SDK documentation can be found [here](packages/core/README.md).
