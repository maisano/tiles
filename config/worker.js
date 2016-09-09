import buble from 'rollup-plugin-buble';

export default {
  dest: 'build/worker.js',
  entry: 'src/worker.js',
  plugins: [
    buble(),
  ],
};
