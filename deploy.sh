#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 清理之前的构建
rm -rf dist/

# 安装依赖
npm install

# 构建
npm run build

# 进入构建文件夹
cd dist

# 创建 .nojekyll 文件，避免 GitHub Pages 忽略下划线开头的文件
touch .nojekyll

# 配置 Git
git config --local user.email "859509286@qq.com"
git config --local user.name "zxs0401"

# 初始化 git 仓库
git init
git add -A
git commit -m 'deploy'

# 推送到 gh-pages 分支
git push -f git@github.com:zxs0401/my-first-web.git master:gh-pages

cd - 