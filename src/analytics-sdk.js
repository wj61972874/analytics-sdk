class AnalyticsSDK {
    constructor() {
        this.apiEndpoint = '';
        this.userId = 'anonymous';
        this.userRole = 'guest';
    }
    // 初始化埋点 SDK
    init(config) {
        this.apiEndpoint = config.apiEndpoint;
        this.userId = config.userId || this.userId;
        this.userRole = config.userRole || this.userRole;

        // 设置全局事件监听器
        if (config.trackClicks) {
            document.addEventListener('click', this.trackClick.bind(this));
        }
        if (config.trackViews) {
            window.addEventListener('load', this.trackView.bind(this));
        }
        if (config.trackSearches) {
            document.getElementById(config.searchButtonId).addEventListener('click', this.trackSearch.bind(this));
        }
    }

    // 捕获点击事件
    trackClick(event) {
        const eventData = this._createEventData('click', event);
        this._sendEvent(eventData);
    }

    // 捕获浏览事件
    trackView(event) {
        const eventData = this._createEventData('view', event);
        this._sendEvent(eventData);
    }

    // 捕获搜索事件
    trackSearch(event) {
        const eventData = this._createEventData('search', event);
        this._sendEvent(eventData);
    }

    // 创建事件数据
    _createEventData(eventType, event) {
        return {
            event_type: eventType,
            event_time: new Date().toISOString(),
            user_id: this.userId,
            user_role: this.userRole,
            page_url: window.location.href,
            page_title: document.title,
            device_type: this._getDeviceType(),
            operating_system: this._getOperatingSystem(),
            browser: this._getBrowser(),
            event_params: this._getEventParams(event),
            source: this._getSource(),
        };
    }

    // 发送事件数据到后端
    _sendEvent(eventData) {
        fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        }).catch(error => console.error('Error sending event data:', error));
    }

    // 获取用户 ID
    _getUserId() {
        return this.userId;
    }

    // 获取用户角色
    _getUserRole() {
        return this.userRole;
    }

    // 获取设备类型
    _getDeviceType() {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'mobile';
        if (/tablet/i.test(ua)) return 'tablet';
        return 'desktop';
    }

    // 获取操作系统
    _getOperatingSystem() {
        const ua = navigator.userAgent;
        if (/windows/i.test(ua)) return 'Windows';
        if (/macintosh/i.test(ua)) return 'macOS';
        if (/linux/i.test(ua)) return 'Linux';
        if (/android/i.test(ua)) return 'Android';
        if (/iphone|ipad/i.test(ua)) return 'iOS';
        return 'Unknown';
    }

    // 获取浏览器
    _getBrowser() {
        const ua = navigator.userAgent;
        if (/chrome/i.test(ua)) return 'Chrome';
        if (/firefox/i.test(ua)) return 'Firefox';
        if (/safari/i.test(ua)) return 'Safari';
        if (/msie|trident/i.test(ua)) return 'Internet Explorer';
        if (/edge/i.test(ua)) return 'Edge';
        return 'Unknown';
    }

    // 获取事件参数
    _getEventParams(event) {
        return {
            element_id: event.target.id,
            element_class: event.target.className,
            element_text: event.target.innerText,
        };
    }

    // 获取来源
    _getSource() {
        return document.referrer || 'direct';
    }
}

export default AnalyticsSDK;