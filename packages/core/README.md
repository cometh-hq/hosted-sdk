# Connect Hosted SDK

#### Installing Wallet SDK

```bash
npm install @cometh/hosted
```

#### Initialize Wallet SDK

```typescript
import { HostedWallet } from '@cometh/hosted'
```

## Authentication

This method is used to authenticate the user and get the OAuth token through an OAUTH flow with ComethOIDC.
A popup will be displayed to handle the authentication process.

```typescript
const hosted = new HostedWallet(apiKey)

// Login to Cometh OIDC and get a session token with its email / wallet
const profile = await hosted.connect()

// Logout from Cometh OIDC
await hosted.disconnect()
```

## Smart Wallet


#### Get Address

```typescript
hosted.getAddress()
```

This function returns the address of the wallet.

#### Send Transaction

```typescript
const txParams = { to: DESTINATION, value: VALUE, data: DATA }
const tx = await hosted.sendTransaction(txParams)
```

This function relays the transaction data to the target address. The transaction fees can be sponsored. The function returns the safeTxHash of the transaction which can be used to wait for the Transaction receipt.

#### Sign Message

```typescript
const signature = await hosted.signMessage('hello')
```

Sign the given message.
