# Connect Hosted SDK

#### Installing Wallet SDK

```bash
npm install @cometh/hosted
```

#### Initialize Wallet SDK

```typescript
import { Hosted } from '@cometh/hosted'
```

## Authentication

This method is used to authenticate the user and get the OAuth token through an OAUTH flow with ComethOIDC.
A popup will be displayed to handle the authentication process.

```typescript
const hosted = new Hosted(apiKey)

// Login to Cometh OIDC and get its email / wallet
const profile = await hosted.login()

// Logout from Cometh OIDC
await hosted.logout()
```

## Smart Wallet


#### Get Address

```typescript
hosted.wallet.getAddress()
```

This function returns the address of the wallet.

#### Send Transaction

```typescript
const txParams = { to: DESTINATION, value: VALUE, data: DATA }
const tx = await hosted.wallet.sendTransaction(txParams)
```

This function relays the transaction data to the target address. The transaction fees can be sponsored. The function returns the safeTxHash of the transaction which can be used to wait for the Transaction receipt.

#### Sign Message

```typescript
const signature = await hosted.wallet.signMessage('hello')
```

Sign the given message.
