# 福邻社会福祉服务平台

一个使用 Firebase Authentication 与 Cloud Firestore 的静态多页面网站。

## 页面

- `index.html`：首页
- `policies.html`：福利政策与搜索筛选
- `notices.html`：Firestore 实时公告列表
- `login.html`：Firebase 邮箱密码登录
- `admin.html`：管理员发布公告

## Firebase 配置

1. 在 Firebase 控制台创建项目和 Web 应用。
2. 开启 **Authentication > Sign-in method > Email/Password**。
3. 创建 Cloud Firestore 数据库。
4. 将 Web 应用配置填写到 `firebase-config.js`。
5. 将 `firestore.rules` 发布为 Firestore 安全规则。
6. 在 Authentication 创建管理员用户。
7. 在 Firestore 新建 `users/{管理员UID}` 文档，并写入：

```json
{
  "role": "admin",
  "name": "管理员"
}
```

## 本地运行

ES Modules 不能直接通过双击文件运行，请使用任意静态服务器，例如：

```bash
npx serve .
```

然后打开终端显示的本地地址。

## Firebase Hosting 部署

在本目录完成 Firebase CLI 登录与项目关联后运行：

```bash
firebase deploy
```
