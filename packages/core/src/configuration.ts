export enum DisplayMode {
    IFRAME = 'iframe',
    POPUP = 'popup'
}

export interface WalletConfiguration {
    oidcURL?: string
    oidcAppURL?: string
}
