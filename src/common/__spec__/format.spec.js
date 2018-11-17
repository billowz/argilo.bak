import { format, pad } from '../format'

describe('String:format', () => {
	it('pad', () => {
		expect(pad('1', 3, '#')).to.equal('##1')
		expect(pad('1', 3, '#', 1)).to.equal('1##')
		expect(pad('123', 3, '#')).to.equal('123')
		expect(pad('123', 3, '#', 1)).to.equal('123')
	})

	let pi = 3.141592653589793,
		cases = [
			{
				format: '%%',
				expect: '%'
			},
			{
				format: '%b',
				args: [2],
				expect: '10'
			},
			{
				format: '%c',
				args: [65],
				expect: 'A'
			},
			{
				format: '%o',
				args: [8],
				expect: '10'
			},
			{
				format: '%d',
				args: [2],
				expect: '2'
			},
			{
				format: '%d',
				args: ['2'],
				expect: '2'
			},
			{
				expect: '-2',
				format: '%d',
				args: [-2]
			},
			{
				expect: '+2',
				format: '%+d',
				args: [2]
			},
			{
				expect: '-2',
				format: '%+d',
				args: [-2]
			},
			{
				expect: '-00002',
				format: '%05d',
				args: [-2]
			},
			{
				expect: '+0000000123',
				format: '%+010d',
				args: [123]
			},
			{
				expect: '1,000',
				format: '%,d',
				args: [1000]
			},
			{
				expect: '1,000,000',
				format: '%,d',
				args: [1000000]
			},
			{
				format: '%u',
				args: [2],
				expect: '2'
			},
			{
				format: '%u',
				args: [-2],
				expect: '4294967294'
			},
			{
				format: '%.0e',
				args: [2],
				expect: '2e+0'
			},
			{
				format: '%f',
				args: [2.2],
				expect: '2.2'
			},
			{
				expect: '-2.2',
				format: '%f',
				args: [-2.2]
			},
			{
				expect: '+2.2',
				format: '%+f',
				args: [2.2]
			},
			{
				expect: '-2.3',
				format: '%+.1f',
				args: [-2.34]
			},
			{
				expect: '-0.0',
				format: '%+.1f',
				args: [-0.01]
			},
			{
				expect: '-234.34 123.2',
				format: '%f %f',
				args: [-234.34, 123.2]
			},
			{
				expect: '-0010.235',
				format: '%8.3f',
				args: [-10.23456]
			},
			{
				expect: '1,000.0123',
				format: '%,f',
				args: [1000.0123]
			},
			{
				expect: '1,000,000.0123',
				format: '%,f',
				args: [1000000.0123]
			},
			{
				format: '%g',
				args: [pi],
				expect: '3.141592653589793'
			},
			{
				expect: '%s',
				format: '%s',
				args: ['%s']
			},
			{
				expect: 'ff',
				format: '%x',
				args: [255]
			},
			{
				expect: 'FF',
				format: '%X',
				args: [255]
			},
			{
				expect: 'Polly wants a cracker',
				format: '%2$s %3$s a %1$s',
				args: ['cracker', 'Polly', 'wants']
			},
			{
				expect: 'true',
				format: '%s',
				args: [true]
			},
			{
				expect: 't',
				format: '%.1s',
				args: [true]
			},
			{
				expect: '    <',
				format: '%5s',
				args: ['<']
			},
			{
				expect: '0000<',
				format: '%05s',
				args: ['<']
			},
			{
				expect: '>    ',
				format: '%-5s',
				args: ['>']
			},
			{
				expect: '>0000',
				format: '%0-5s',
				args: ['>']
			},
			{
				expect: 'xxxxxx',
				format: '%5s',
				args: ['xxxxxx']
			},
			{
				expect: '1234',
				format: '%02u',
				args: [1234]
			},
			{
				expect: '-12.34 xxx',
				format: '%f %s',
				args: [-12.34, 'xxx']
			},
			{
				expect: 'xxxxx',
				format: '%5.5s',
				args: ['xxxxxx']
			},
			{
				expect: '    x',
				format: '%5.1s',
				args: ['xxxxxx']
			}
		]
	for (var i = 0, l = cases.length; i < l; i++) {
		var c = cases[i]
		it(`format: c.format`, () => {
			expect(format.apply(null, [c.format].concat(c.args || []))).to.equal(c.expect)
		})
	}
})