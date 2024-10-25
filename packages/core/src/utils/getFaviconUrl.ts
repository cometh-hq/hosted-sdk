export const getFaviconUrl = (): string => {
	const links = document.getElementsByTagName('link')
	for (let i = 0; i < links.length; i++) {
		const link = links[i]
		if (link.rel.indexOf('icon') !== -1 || link.rel.indexOf('shortcut icon') !== -1) {
			return link.href
		}
	}
	return '/favicon.ico'
}
