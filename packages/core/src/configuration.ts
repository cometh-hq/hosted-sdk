export enum DisplayMode {
    IFRAME = 'iframe',
    POPUP = 'popup'
}

export interface WalletConfiguration {
    oidcURI?: string
    oidcAppURI?: string
}
