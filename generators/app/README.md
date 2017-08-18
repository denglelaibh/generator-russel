# 生成 knockout 模块代码和测试用例脚手架

使用示例:
yo russel 
## 目录结构

* ko-component
	* ko-page.html
	* ko-page.js
	* ko-page.scss
* specs
	* list.json - 查询列表的 schema 文件,无分页

### 依赖包安装
1. 有 yarn 使用 yarn(yarn 比 npm 速度要快好多)
2. 安装前最好检查该包是否已经安装了

## ChangeLog

### v0.2
* 增加 jsonschema 接口测试代码, 测试模板使用 specs 目录
* 原组件相关代码移入 ko-component 目录 
