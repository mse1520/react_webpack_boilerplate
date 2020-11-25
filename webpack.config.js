const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV.trim();
const PRODUCTION = NODE_ENV === 'prod';
let mode, devtool;

switch (NODE_ENV) {
    case 'dev':
        mode = 'development';
        devtool = 'eval';
        break;
    case 'dev-detail':
        mode = 'development';
        devtool = 'eval-cheap-module-source-map';
        break;
    case 'prod':
    default:
        mode = 'production';
        devtool = 'hidden-source-map';
        break;
}

module.exports = {
    name: 'webpack-config',
    mode, // 실서비스는 production
    devtool, // 실서비스는 hidden-source-map
    // entry 부분에서 합쳐질 파일의 확장자를 붙여준다
    resolve: {
        extensions: ['.jsx', '.js']
    },
    // 합쳐질 파일의 시작점
    entry: {
        //파일이 서로 연결된경우 알아서 찾아준다
        app: path.resolve('src', 'index')
    },
    // 하나로 합쳐실 출력 파일의 설정입니다.
    output: {
        path: path.resolve('public'),
        filename: '[name].js',
        //publicPath: "/dist/"
    },
    // loader 설정
    module: {
        rules: [{
            //test는 어떤 파일이 함쳐지는지에 대한 내용입니다
            test: /\.jsx?$/, //정규 표현식
            // loader 가 단독으로 쓰일 때는 그냥 사용 가능하다
            // 다수의 loader를 사용할 시 use 배열로 객체를 정의할 수 있다
            // loader의 옵션이 없을 시 객체로 정의하지 않고 사용 가능하다
            // 아래의 css loader 참고
            // use: [{}, {}]
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                // @babel/preset-env, @babel/preset-react 까지 설치 후
                // 추가 설치가 필요한 것만 설치하는 것이 좋다
                //presets: ["@babel/preset-env", "@babel/preset-react"],
                presets: [
                    ['@babel/preset-env', {
                        // polifill 설정 대체 할 수 없는 문법을 변환한다
                        // corejs: { version: 3, proposals: true },
                        corejs: 3,
                        shippedProposals: true,
                        useBuiltIns: 'usage',
                        // true 시 실행했을 때 터미널에서 내용을 볼 수 있다
                        debug: true,
                        targets: {
                            // 지원하고 싶은 브라우저의 종류를 배열로 사용 가능하다
                            // [last 2 versions, '>= 5% in KR']
                            browsers: '>= 5% in KR'
                        }
                    }],
                    '@babel/preset-react'
                ]
            }
        }]
    },
    // plugin은 번들링 된 파일에 작업이 필요할 때
    plugins: [
        // 번들링 할 때 쓰이는 변수를 화면단으로 넘겨주는 역할
        // new DefinePlugin({ PRODUCTION }),
        new EnvironmentPlugin({ PRODUCTION }),
        // 번들링 할 때 해당 내용의 파일을 지워준다
        // 제외 시킬 파일은 '!'를 사용할 수 있다
        new CleanWebpackPlugin(),
        // html 파일을 번들링 파일과 연결하여 ouput 해준다
        new HtmlWebpackPlugin({
            cache: false,
            template: './src/index.html' // 번들링 파일과 연결할 파일의 경로
        })
    ]
};