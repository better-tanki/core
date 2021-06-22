const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',

	devtool: 'source-map',

	stats: {
		warningsFilter: /^(?!CriticalDependenciesWarning$)/
	},

	resolve: {
		extensions: [
			'.ts',
			'.js'
		],
		modules: [
			'node_modules'
		]
	},

	target: 'node',

	entry: {
		'bundle': './src/app.ts',
		'bundle.min': './src/app.ts'
	},
	output: {
		// filename: '[name].[chunkhash:8].js',
		filename: '[name].js',
		path: path.join(__dirname, 'dist')
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				include: path.join(__dirname, 'src'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile : 'tsconfig.json'
						}
					}
				]
			},
			// {
			// 	test: /\.s[ac]ss$/,
			// 	include: path.join(__dirname, 'static/scss'),
			// 	exclude: /node_modules/,
			// 	use: [
			// 		'style-loader',
			// 		{
			// 			loader: 'css-loader',
			// 			options: {
			// 				sourceMap: false
			// 			}
			// 		},
			// 		{
			// 			loader: 'postcss-loader',
			// 			options: {
			// 			}
			// 		},
			// 		{
			// 			loader: 'sass-loader',
			// 			options: {
			// 			}
			// 		}
			// 	]
			// },
			// {
			// 	enforce: 'pre',
			// 	test: /\.js$/,
			// 	loader: 'source-map-loader'
			// }
		]
	},
	
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				include: /\.min\.js$/,
				parallel: true,
				terserOptions: {
					mangle: true,
					keep_classnames: false,
					keep_fnames: false
				}
			})
		]
	},

	externals: {
		'pg-native': 'pg-native',
		'bufferutil': 'bufferutil',
		'utf-8-validate': 'utf-8-validate'
	}
};
