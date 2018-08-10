# 报表系统

基于 umi+dva+antd+react

## 服务端：https://github.com/realeve/thinkPHP

## 路由

此处 :tid 表示接口 id，数据格式有微调
http://localhost:8000/table/:tid

http://localhost:8000/table/:tid?cache=10

http://localhost:8000/table/:tid?cache=10&其它参数

## todos

1.  四新计划增加 适用名称
2.  工艺流程多选：去掉自动分配
3.  自动分配工艺流程：人工拉号在有富余的情况下自己抽产品，提供适用于人工拉号的产品列表。
4.  异常品的全流程提示，按工序自动推送到工艺质量管理平台以及对应工艺、机检人员。
5.  四新列表中增加，新材料

## 库管涉及修改

1.  WMS 接口修改；
2.  码后核查验证票，波拉机请求流程；
3.  平库收付加入工艺分支及是否验证；
4.  增加产品是否为码后核查验证的接口；
5.  库管收付加入机台连续废通知提示；
6.  机台作业系统刷卡时提示是否有连续废通知（提供接口给企划），提供带参数网页查看信息。
7.  拉号班电脑升级。

## git 操作帮助

# Command line instructions

```
Git global setup
git config --global user.name "libin"
git config --global user.email "realeve@qq.com"
```

# Create a new repository

```
git clone http://10.8.1.62/libin/doc_proddist.git
cd doc_proddist
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
```

# Existing folder

```
cd existing_folder
git init
git remote add origin http://10.8.1.62/libin/doc_proddist.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

# Existing Git repository

```
cd existing_repo
git remote add origin http://10.8.1.62/libin/doc_proddist.git
git push -u origin --all
git push -u origin --tags
```
