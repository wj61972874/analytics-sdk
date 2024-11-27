# 简单的埋点 SDK,可以用在 CRS 和 SSR 中

## 使用方法

1. 安装依赖（使用 npm 安装）

```bash
npm install analytics-sdk-jay
```

2. 在项目中引入并初始化

```javascript
import AnalyticsSDK from "analytics-sdk-jay";

// 创建SDK实例
const analytics = new AnalyticsSDK();

// 初始化SDK配置
analytics.init({
  apiEndpoint: "https://your-api-endpoint.com/track", // 替换为你的API端点
  userId: "user123", // 可选，用户ID
  userRole: "admin", // 可选，用户角色
  trackClicks: true, // 是否追踪点击事件
  trackViews: true, // 是否追踪浏览事件
  trackSearches: true, // 是否追踪搜索事件
  searchButtonId: "search-button", // 搜索按钮的ID
});

// 手动追踪点击事件
document
  .getElementById("your-element-id")
  .addEventListener("click", (event) => {
    analytics.trackClick(event);
  });

// 手动追踪浏览事件
window.addEventListener("load", (event) => {
  analytics.trackView(event);
});

// 手动追踪搜索事件
document.getElementById("search-button").addEventListener("click", (event) => {
  analytics.trackSearch(event);
});
```

3. 可以自定义事件触发埋点

```javascript
// 自定义事件触发埋点
document
  .getElementById("your-element-id")
  .addEventListener("your-event", (event) => {
    analytics.trackClick(event);
  });
```
