# Smart Job Assistant

智能求职助手 - 基于自然语言处理技术的求职辅助平台

## 项目简介

Smart Job Assistant 是一个基于自然语言处理技术的智能求职助手，旨在帮助求职者优化简历、准备面试，提升求职成功率。系统采用现代化的前端技术栈，为用户提供直观、高效的求职辅助服务。

## 核心功能

### 简历生成与优化
- 智能简历分析和优化建议
- 根据职位描述定制简历内容
- 多种文件格式支持（PDF、DOC、DOCX、TXT）
- 实时预览和编辑功能

### 面试准备系统
- AI驱动的面试问题生成
- 个性化面试建议和指导
- 模拟面试环境和评估
- 面试技巧和策略推荐

### 文档生成工具
- 自动生成面试演示文稿
- 求职计划和时间安排
- 个人品牌建设材料

## 技术架构

### 前端技术栈
- **React 19** - 现代化用户界面框架
- **TypeScript** - 静态类型检查，提升代码质量
- **Vite** - 高性能构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **React Router** - 单页应用路由管理
- **React Dropzone** - 文件上传处理

### 后端架构（规划中）
- **Python Flask** - 轻量级Web框架
- **大语言模型集成** - 支持多种NLP服务
- **语音识别服务** - 面试录音处理

## 项目结构

```
smart-job-assistant/
├── src/
│   ├── components/          # 可复用UI组件
│   │   ├── FileUpload/     # 文件上传组件
│   │   └── Layout/         # 页面布局组件
│   ├── pages/              # 页面组件
│   │   ├── Home/           # 首页
│   │   └── ResumeGenerator/ # 简历生成页面
│   ├── services/           # API服务层
│   ├── store/              # 全局状态管理
│   └── types/              # TypeScript类型定义
├── public/                 # 静态资源
└── 配置文件                # 各类配置文件
```

## 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装和运行

1. 安装项目依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 访问应用
打开浏览器访问 http://localhost:5173

### 构建和部署

```bash
# 构建生产版本
npm run build

# 代码质量检查
npm run lint
```

## 设计原则

- **用户体验优先** - 简洁直观的界面设计
- **响应式设计** - 兼容各种设备和屏幕尺寸
- **模块化架构** - 便于维护和功能扩展
- **类型安全** - 使用TypeScript确保代码质量
- **性能优化** - 采用现代化构建工具和优化策略

## 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 遵循TypeScript严格模式
- 组件采用函数式编程范式
- 状态管理使用Zustand模式

### 文件命名
- 组件文件使用PascalCase命名
- 工具函数使用camelCase命名
- 常量使用UPPER_SNAKE_CASE命名

## 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](LICENSE) 文件。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目仓库：[GitHub Repository]
- 邮箱：[联系邮箱]

---

本项目为HKU 7607 NLP课程期末项目。
