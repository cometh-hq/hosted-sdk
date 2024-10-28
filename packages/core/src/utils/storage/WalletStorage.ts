import { LocalStorage } from '@/utils/storage/LocalStorage'
import type { KeyValueStorage } from '@/utils/storage/types'
import type {Hex} from "@/types";

export class WalletStorage {
	private storage: KeyValueStorage = new LocalStorage('hosted-wallet')

	getAddress(): Hex | null {
		return this.storage.getItem('address') as Hex | null
	}

	setAddress(address: Hex) {
		this.storage.setItem('address', address)
	}

	getCurrentChainId(): number | null {
		const chainId = this.storage.getItem('chainId')
		return chainId ? parseInt(chainId) : null
	}

	setCurrentChainId(chainId: string | number) {
		this.storage.setItem('chainId', chainId.toString())
	}

	getChainIds(): number[] | null {
		const chainId = this.storage.getItem('chainIds')
		return chainId ? JSON.parse(chainId) : null
	}

	setChainIds(chainIds: number[]) {
		this.storage.setItem('chainIds', JSON.stringify(chainIds))
	}

	clear() {
		this.storage.clear()
	}
}
