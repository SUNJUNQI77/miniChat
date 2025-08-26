# MiniChat - 智能问答应用

一个基于 uni-app 开发的智能问答应用，支持多端运行。

## 项目结构

```
miniChat/
├── components/           # 组件目录
│   ├── ChatContent.vue   # 聊天内容区域组件
│   ├── ChatInput.vue     # 聊天输入区域组件
│   └── UserDrawer.vue    # 用户抽屉组件
├── pages/               # 页面目录
│   ├── home/            # 首页
│   ├── login/           # 登录页
│   └── settings/        # 设置页
├── stores/              # 状态管理
│   ├── user.js          # 用户状态
│   ├── qa.js            # 问答状态
│   └── theme.js         # 主题状态
├── utils/               # 工具函数
│   ├── index.js         # 通用工具函数
│   ├── request.js       # 请求工具
│   └── api.js           # API服务
├── static/              # 静态资源
└── uni_modules/         # uni-app 模块
```

## 组件化架构

### 1. ChatContent 组件
- **功能**: 显示聊天消息列表和欢迎页面
- **特性**: 
  - 支持消息滚动和自动滚动到底部
  - 优化了滚动性能，使用节流函数
  - 支持快捷问题点击
  - 响应式设计

### 2. ChatInput 组件
- **功能**: 消息输入和发送
- **特性**:
  - 支持语音输入和图片输入
  - 输入验证和字数限制
  - 发送状态管理
  - 可配置的输入选项

### 3. UserDrawer 组件
- **功能**: 用户信息和聊天历史抽屉
- **特性**:
  - 动态宽度计算
  - 响应式布局
  - 聊天历史管理
  - 用户统计信息

## 工具函数

### 1. 通用工具 (utils/index.js)
- 时间格式化
- 防抖和节流函数
- 深拷贝
- 本地存储工具
- 系统信息获取
- UI 提示工具

### 2. 请求工具 (utils/request.js)
- 封装 uni.request
- 支持请求和响应拦截器
- 错误处理
- 文件上传下载
- 自动加载提示

### 3. API服务 (utils/api.js)
- 用户相关API
- 聊天相关API
- 设置相关API
- 文件相关API
- 系统相关API

## 性能优化

### 1. 滚动优化
- 使用 `scroll-into-view` 实现流畅滚动
- 节流处理滚动事件
- 硬件加速和性能优化

### 2. 组件优化
- 使用 `defineExpose` 暴露组件方法
- 合理的 props 和 emits 设计
- 响应式数据优化

### 3. 样式优化
- 使用 CSS 硬件加速
- 合理的动画性能
- 响应式设计

## 使用方法

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev:mp-weixin  # 微信小程序
npm run dev:h5         # H5
npm run dev:app        # App
```

### 构建
```bash
npm run build:mp-weixin
npm run build:h5
npm run build:app
```

## 主要特性

- ✅ 组件化架构
- ✅ 响应式设计
- ✅ 主题切换
- ✅ 聊天历史管理
- ✅ 性能优化
- ✅ 工具函数封装
- ✅ API 服务封装
- ✅ 多端兼容

## 技术栈

- **框架**: uni-app
- **UI组件**: uview-plus
- **状态管理**: Pinia
- **样式**: SCSS
- **构建工具**: Vite

## 开发规范

1. **组件命名**: 使用 PascalCase
2. **文件命名**: 使用 kebab-case
3. **变量命名**: 使用 camelCase
4. **常量命名**: 使用 UPPER_SNAKE_CASE
5. **注释规范**: 使用 JSDoc 格式

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
