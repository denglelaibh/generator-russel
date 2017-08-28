# generator-russel

russel 是一个面向 PC 支持 IE8 的 knockout.js & require.js 脚手架项目, 目标是简化配置.

generator-russel 是基于 yeoman 的 russel 模块代码自动生成工具, 目标是进行业务的快速开发.

## app
CRUD 增删改查模板, 支持:
* 搜索表单
* 结果列表页
* 新增记录对话框
* 删除确认
* 消息提示对话框

## front
前端静态页面

## node
node.js 项目

## cli
Node 命令行项目

## design - web 界面设计模式示例代码项目
生成一个最简化的用于演示设计的代码结构, 

* 一个 html 文件: `index.html`
* `styles/normalize.css`: nz 的 normalize.css 文件
* `styles/base.css` - 自定义的核心默认设置.
	* 所有元素及所有元素的 before 和 after 伪元素的box-sizing 默认为 border-box
	* html 和 body 元素的宽高都设为 100%
	* 在 body 上设置默认的字体, 字体大小, 行高, 字体颜色, 背景色
	* 设置各种 block 元素的内边距和外边距为 0
	* 
* `styles/main.css` - 自定义样式
* `scripts/main.js` - 业务逻辑代码
* 一个事件监听/委托和 DOM查询帮助文件: `scripts/helpers.js`

NOTE: 面向 PC , 非 mobile
