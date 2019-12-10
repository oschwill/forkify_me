const path = require('path'); // build in
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new htmlWebpackPlugin({ // kopiert die index.html aus dem src folder in den dist folder
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // Regex => alle Javascriptdateien
                exclude: /node_modules/, // Die Regel soll nicht auf den node_modules Ordner angewendet werden
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
// in der Konsole geben wir: npm run dev ein, damit er die bundle.js erstellt
// Mit npm run build nutzen wir das Production Bundle, und die js Dateien werden komprimiert