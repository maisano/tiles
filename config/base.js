import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import css from 'modular-css/rollup';

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
  css({
    css: 'build/index.css',
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
