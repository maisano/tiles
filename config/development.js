import replace from 'rollup-plugin-replace';

import extendBaseConfig from './base';

export default extendBaseConfig({
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
