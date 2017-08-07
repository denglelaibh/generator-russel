# generator-russel

## generator 组织
package.json 约定:
1. "name" - 名字必须是 generator-xxx 形式
2. "files" - 数组,包含名为 generators 的项, 同时项目目录下要有名为 generators 的目录; 否则要把每一个 generator 目录都列在 fiels 下面, 比如 app, router 等.
3. "keywords" - 关键字必须包含 yeoman-generator

## 运行上下文
每个直接附加到 Generator prototype 的方法被认为是一个任务.
每个任务均由 Yeoman 环境运行循环按顺序运行.

### 创建帮助和私有方法的三种方式
