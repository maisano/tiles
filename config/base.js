import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import postcssModules from 'postcss-modules';
import autoprefixer from 'autoprefixer';

const cssExportMap = {};

const defaults = {
  dest: 'build/app.js',
  entry: 'src/index.js',
  sourceMap: true,
};

const plugins = [
  buble({
    exclude: '**/*.css',
    objectAssign: 'Object.assign',
  }),
  commonjs({
    include: [
      'node_modules/classnames/**',
      'node_modules/hammerjs/**',
      'node_modules/fbjs/**',
      'node_modules/object-assign/**',
      'node_modules/react-dom/**',
      'node_modules/react/**',
    ],
  }),
  resolve({
    browser: true,
    main: true,
  }),
  postcss({
    plugins: [
      autoprefixer(),
      postcssModules({
        getJSON(id, exportTokens) {
          cssExportMap[id] = exportTokens;
        },
      }),
    ],
    getExport(id) {
      return cssExportMap[id];
    },
  }),
];

export default function extendBaseConfig(options) {
  return Object.assign({}, defaults, options, {
    plugins: [].concat(
      plugins,
      options.plugins || []
    ),
  });
}
