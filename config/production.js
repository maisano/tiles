import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

import extendBaseConfig from './base';

export default extendBaseConfig({
  dest: 'build/app.min.js',
  plugins: [
    uglify(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
