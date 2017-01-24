# nodejs01
nodejs and mongoDB

## 发布npm模块
* 首先确保npm库的源是https://registry.npmjs.org/，否则输入npm adduser的时候会报错。
  npm install -g cnpm --registry=https://registry.npmjs.org/
* 提交代码到github储存库，然后在https://npmjs.org注册。
* 使用npm adduser 把注册的账号添加进环境中。（输入密码时没有任何提示，输入完毕按回车键即可）
* package.json文件修改name的值，注意name的值不能于其他包重名。
* 最后使用npm publish提交，本地npm i packagename 即可
* 注：使用npm pack封装模块，然后本地就能npm install E:\xx.tgz
* 要删除一个软件包npm unpublish 项目名称    特殊情况需加--force























