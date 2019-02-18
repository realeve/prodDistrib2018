export default {
  hash: true, //添加hash后缀
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          hmr: true
        },
        antd: true, // antd 默认不开启，如有使用需自行配置
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /components\//,
            /utils\//,
            /service\.js/
          ]
        },
        // dynamicImport: {
        //   loadingComponent: './components/PageLoading/Loading1.jsx'
        // },
        targets: ['ie11']
      }
    ]
  ]
};
