import { pad } from '../format'
import { escapeStr } from '../string'

const LINE_REG = /([^\n]+)?(\n|$)/g
export class Source {
	readonly buff: string
	readonly len: number
	private lines: ([number, string])[]
	private linePos: number
	constructor(buff: string) {
		this.buff = buff
		this.len = buff.length
		this.lines = []
		this.linePos = 0
	}
	position(offset: number): [number, number, string] {
		const { buff, len, lines, linePos } = this
		let i = lines.length,
			p: number
		if (offset < linePos) {
			while (i--) {
				p = offset - lines[i][0]
				if (p >= 0) return [i + 1, p, lines[i][1]]
			}
		} else {
			if (linePos < len) {
				var m
				LINE_REG.lastIndex = p = linePos
				while ((m = LINE_REG.exec(buff))) {
					lines[i++] = [p, m[1] || '']
					p = LINE_REG.lastIndex
					if (!p || offset < p) break
				}
				this.linePos = p || len
			}
			return i ? [i, (offset > len ? len : offset) - lines[i - 1][0], lines[i - 1][1]] : [1, 0, '']
		}
	}
	source(escape?: boolean): string {
		const { buff } = this
		let line = 1,
			toSourceStr = escape ? escapeSourceStr : sourceStr

		return buff.replace(LINE_REG, (m, s, t) => pad(String(line++), 3) + ': ' + toSourceStr(m, s, t))
	}
}
function sourceStr(m, s, t) {
	return m || ''
}
function escapeSourceStr(m, s, t) {
	return s ? escapeStr(s) + t : t
}
