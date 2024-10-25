import { type EventRequestDTO } from '@/core/app/types'
import Embedded from '@/core/app/embedded'
import { buildURL } from '@/utils/safeURLBuilder'

export default class IFrame extends Embedded {
	private _modalID = 'modal-cometh-web-auth'
	private _modal: HTMLElement | null = null
	private _iframeID = 'cometh-web-auth'
	private _iframe: HTMLIFrameElement | null = null

	private _prepareModal(modalId: string) {
		const modal = document.createElement('div')
		modal.id = modalId
		modal.style.position = 'fixed'
		modal.style.top = '0px'
		modal.style.right = '0px'
		modal.style.left = '0px'
		modal.style.bottom = '0px'
		modal.style.display = 'none'
		modal.style.zIndex = '1000'
		return modal
	}

	private _createModal() {
		const existingModal = document.getElementById(this._modalID)
		if (existingModal) {
			this._modal = existingModal
			return
		}
		const modal = this._prepareModal(this._modalID)
		document.body.appendChild(modal)
		this._modal = modal
	}

	private _createIframe() {
		if (this._iframe) {
			return
		}
		const existingIframe = document.getElementById(this._iframeID)
		if (existingIframe) {
			this._iframe = existingIframe as HTMLIFrameElement
			return
		}
		const iframe = document.createElement('iframe')
		iframe.id = this._iframeID
		iframe.allow = ''
		if (this._config.allowGetPasskey) {
			iframe.allow += `publickey-credentials-get ${this._config.authorizedOrigin}`
		}
		if (this._config.allowCreatePasskey) {
			iframe.allow +=
				(iframe.allow.length != 0 ? ';' : '') +
				`publickey-credentials-create ${this._config.authorizedOrigin}`
		}
		iframe.style.width = '100%'
		iframe.style.height = '100%'
		this._iframe = iframe
		this._modal?.appendChild(iframe)
	}

	private _hideModal() {
		if (this._modal) {
			this._modal.style.display = 'none'
		}
		// TODO find a way to cancel passkey request, or can't close modal if request pending
	}

	private _showModal(display: boolean = true) {
		if (this._modal && display) {
			this._modal.style.display = 'block'
		}
	}

	initialize() {
		this._createModal()
		this._createIframe()
	}

	open(url?: string, params?: { [key: string]: string | undefined }, display?: boolean): boolean {
		const target = url || this._config.defaultURL
		const formatedURL = buildURL(target, params)
		if (!this._iframe) return false
		this._iframe.src = formatedURL
		this._showModal(display)
		return true
	}

	close() {
		this._hideModal()
	}

	sendMessage(message: EventRequestDTO) {
		if (this._iframe?.contentWindow) {
			console.log('sending message: ', message)
			this._iframe.contentWindow.postMessage(message, '*')
		}
	}
}
