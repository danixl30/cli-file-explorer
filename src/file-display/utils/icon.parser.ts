import { Node } from '../types/node.js'

const dirIcons = (node: Node) => {
	if (node.name === 'test' || node.name === 'tests') return '󰙨 '
	if (node.name === 'node_modules') return ' '
	if (node.name === '.git') return ' '
	if (node.name === 'src') return ' '
	if (node.name === '.vscode') return ' '
	if (node.name === '.aws') return ' '
	if (node.name === '.docker') return ' '
	if (node.name === '.config') return ' '
	if (node.name === 'Documents' || node.name === 'docs') return ' '
	if (node.name === 'Downloads') return '󰉍 '
	if (node.name === 'Desktop') return '󰧨 '
	if (node.name.toLowerCase() === 'music') return '󱍙 '
	if (
		node.name.toLowerCase() === 'pictures' ||
		node.name.toLowerCase() === 'picture'
	)
		return '󰉏 '
	if (
		node.name.toLowerCase() === 'videos' ||
		node.name.toLowerCase() === 'video'
	)
		return ' '
	if (node.name === 'bin') return ' '
	return ' '
}

const fileIcons = (node: Node) => {
	if (
		node.name === 'package.json' ||
		node.name === '.nvmrc' ||
		node.name === '.node-version'
	)
		return ' '
	if (
		node.name === 'Dockerfile' ||
		node.name === '.dockerignore' ||
		node.name === 'docker-compose.yml'
	)
		return ' '
	if (node.name === '.gitignore' || node.name === '.gitattributes')
		return ' '
	if (node.name.toLowerCase() === 'readme.md') return ' '
	if (node.name.endsWith('.key') || node.name.endsWith('.gpg')) return ' '
	if (node.name.endsWith('.ts')) return ' '
	if (node.name.endsWith('.c')) return ' '
	if (node.name.endsWith('.exe')) return 'ﬓ '
	if (node.name.endsWith('.sln')) return ' '
	if (node.name.endsWith('.cs')) return ' '
	if (node.name.endsWith('.js')) return ' '
	if (node.name.endsWith('.txt')) return ' '
	if (
		node.name.endsWith('.zip') ||
		node.name.endsWith('.rar') ||
		node.name.endsWith('.7z')
	)
		return ' '
	if (node.name.endsWith('.cpp')) return ' '
	if (node.name.endsWith('.html')) return ' '
	if (
		node.name.endsWith('.png') ||
		node.name.endsWith('.jpg') ||
		node.name.endsWith('.jpeg') ||
		node.name.endsWith('.gif') ||
		node.name.endsWith('.bmp') ||
		node.name.endsWith('.cur') ||
		node.name.endsWith('.tiff') ||
		node.name.endsWith('.svg')
	)
		return ' '
	if (node.name.endsWith('.java')) return ' '
	if (node.name.endsWith('.bat')) return ' '
	if (node.name.endsWith('.md')) return ' '
	if (node.name.endsWith('.kt')) return ' '
	if (node.name.endsWith('.php')) return ' '
	if (node.name.endsWith('.json')) return ' '
	if (node.name.endsWith('.py')) return ' '
	if (node.name.endsWith('.lock')) return ' '
	if (node.name.endsWith('.toml') || node.name.endsWith('.ini')) return ' '
	if (node.name.endsWith('.rs')) return ' '
	if (node.name.endsWith('.sql')) return '.sql'
	if (node.name.endsWith('.zig')) return ' '
	if (node.name.endsWith('.tsx') || node.name.endsWith('.jsx')) return ' '
	if (node.name.endsWith('.pdf')) return ' '
	if (node.name.endsWith('.docx')) return ' '
	if (node.name.endsWith('.doc')) return '󱎒 '
	if (node.name.endsWith('.xls') || node.name.endsWith('.xlsx')) return '󱎒 '
	if (node.name.endsWith('.ppt') || node.name.endsWith('.pptx')) return '󱎐 '
	if (node.name.endsWith('.psd')) return ' '
	if (node.name.endsWith('.css')) return ' '
	if (node.name.endsWith('.dll')) return ' '
	if (
		node.name.endsWith('.mp3') ||
		node.name.endsWith('.ma4') ||
		node.name.endsWith('.wav') ||
		node.name.endsWith('.mp3')
	)
		return ' '
	if (
		node.name.endsWith('.mkv') ||
		node.name.endsWith('.mp4') ||
		node.name.endsWith('.avi')
	)
		return ' '
	if (node.name.endsWith('.log')) return ' '
	return ' '
}

const driveIcon = (_node: Node) => {
	return ' '
}

export const getNodeIcon = (node: Node) =>
	node.type === 'DIR'
		? dirIcons(node)
		: node.type === 'FILE'
			? fileIcons(node)
			: driveIcon(node)
