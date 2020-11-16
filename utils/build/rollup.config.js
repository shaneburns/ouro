import { terser } from "rollup-plugin-terser";
export default [
	{
		input: 'src/OURO.js',
		output: [
			{
				format: 'umd',
				name: 'OURO',
				file: 'build/OURO.js',
				indent: '\t'
			}
		]
	},
	{
        input: 'src/OURO.js',
        plugins: [
            terser()
        ],
		output: [
			{
				format: 'umd',
				name: 'OURO',
				file: 'build/OURO.min.js'
			}
		]
	},
	{
		input: 'src/OURO.js',
		output: [
			{
				format: 'esm',
				file: 'build/OURO.module.js'
			}
		]
	}
];