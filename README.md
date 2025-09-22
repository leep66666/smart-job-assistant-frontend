# Smart Job Assistant

智能求职助手 - 基于NLP技术的AI求职辅助平台

## 🎯 项目概述

Smart Job Assistant是一个基于自然语言处理技术的智能求职助手，帮助求职者优化简历、准备面试，提升求职成功率。

## ✨ 核心功能

### 已实现功能
- ✅ **简历生成器界面** - 上传简历和职位描述，生成匹配的简历
- ✅ **响应式布局** - 适配各种设备尺寸
- ✅ **文件上传** - 支持PDF、DOC、DOCX、TXT格式

### 计划功能
- 🔄 **AI简历优化** - 根据职位要求智能调整简历内容
- 🔄 **模拟面试** - AI驱动的面试问题生成和评估
- 🔄 **面试准备** - 个性化面试问题和建议
- 🔄 **PPT生成** - 自动生成面试演示文稿

## 🛠️ 技术栈

### 前端
- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用型CSS框架
- **Zustand** - 轻量级状态管理
- **React Router** - 页面路由
- **React Dropzone** - 文件上传组件

### 后端（计划中）
- **Python Flask** - 后端API框架
- **大语言模型API** - GPT/Claude/Gemini
- **语音识别API** - 面试录音转文字

## 📁 项目结构

```
smart-job-assistant/
├── src/
│   ├── components/           # 可复用组件
│   │   ├── FileUpload/      # 文件上传组件
│   │   └── Layout/          # 页面布局组件
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 主页
│   │   └── ResumeGenerator/ # 简历生成页
│   ├── services/            # API服务层
│   ├── store/               # 状态管理
│   └── types/               # TypeScript类型定义
├── public/                  # 静态资源
└── config files            # 配置文件
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm/yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 🎨 设计理念

- **用户友好** - 简洁直观的界面设计
- **响应式** - 适配移动端和桌面端
- **可扩展** - 模块化架构便于功能扩展
- **类型安全** - 全面使用TypeScript
- **性能优化** - 代码分割和懒加载

## 📋 开发计划

### 阶段一：基础架构 ✅
- [x] 前端项目搭建
- [x] 基础组件开发
- [x] 路由和状态管理
- [x] Git仓库初始化

### 阶段二：核心功能开发 🔄
- [ ] 后端API开发
- [ ] AI模型集成
- [ ] 简历生成功能
- [ ] 模拟面试功能

### 阶段三：功能完善 📋
- [ ] PPT生成功能
- [ ] 语音识别集成
- [ ] 用户体验优化
- [ ] 性能优化

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 开发团队

HKU 7607 NLP Final Project Team

---

> 💡 这是一个正在积极开发中的项目，欢迎提出建议和贡献代码！
