class AnalyticsSDK {
    constructor() {
        if (AnalyticsSDK.instance) {
            return AnalyticsSDK.instance;
        }

        this.apiEndpoint = '';
        this.userId = this._getOrCreateUserId();
        this.userRole = 'guest';

        AnalyticsSDK.instance = this;
    }

    // 初始化埋点 SDK
    init(config) {
        this.apiEndpoint = config.apiEndpoint;
        this.userRole = config.userRole || this.userRole;

        // 设置全局事件监听器
        if (config.trackClicks) {
            this._addEventListener('click', this.trackClick.bind(this));
        }
        if (config.trackViews) {
            this._addEventListener('load', this.trackView.bind(this));
        }
        if (config.trackSearches) {
            this._addEventListenerToElement(config.searchButtonId, 'click', this.trackSearch.bind(this));
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
            page_url: this._getPageUrl(),
            page_title: this._getPageTitle(),
            device_type: this._getDeviceType(),
            operating_system: this._getOperatingSystem(),
            browser: this._getBrowser(),
            // event_params: this._getEventParams(event),
            event_params: event,
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

    // 获取或创建用户 ID
    _getOrCreateUserId() {
        if (this._isClient()) {
            let userId = this._getCookie('user_id');
            if (!userId) {
                userId = this._generateUUID();
                this._setCookie('user_id', userId, 365);
            }
            return userId;
        }
        return 'server-generated-id';
    }

    // 生成 UUID
    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 设置 Cookie
    _setCookie(name, value, days) {
        if (this._isClient()) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }
    }

    // 获取 Cookie
    _getCookie(name) {
        if (this._isClient()) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    // 检查是否为客户端环境
    _isClient() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }

    // 获取页面 URL
    _getPageUrl() {
        return this._isClient() ? window.location.href : '';
    }

    // 获取页面标题
    _getPageTitle() {
        return this._isClient() ? document.title : '';
    }

    // 添加事件监听器
    _addEventListener(event, handler) {
        if (this._isClient()) {
            window.addEventListener(event, handler);
        }
    }

    // 添加事件监听器到元素
    _addEventListenerToElement(elementId, event, handler) {
        if (this._isClient()) {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener(event, handler);
            }
        }
    }

    // 获取设备类型
    _getDeviceType() {
        if (this._isClient()) {
            const ua = navigator.userAgent;
            if (/mobile/i.test(ua)) return 'mobile';
            if (/tablet/i.test(ua)) return 'tablet';
            return 'desktop';
        }
        return 'unknown';
    }

    // 获取操作系统
    _getOperatingSystem() {
        if (this._isClient()) {
            const ua = navigator.userAgent;
            if (/windows/i.test(ua)) return 'Windows';
            if (/macintosh/i.test(ua)) return 'macOS';
            if (/linux/i.test(ua)) return 'Linux';
            if (/android/i.test(ua)) return 'Android';
            if (/iphone|ipad/i.test(ua)) return 'iOS';
            return 'Unknown';
        }
        return 'unknown';
    }

    // 获取浏览器
    _getBrowser() {
        if (this._isClient()) {
            const ua = navigator.userAgent;
            if (/chrome/i.test(ua)) return 'Chrome';
            if (/firefox/i.test(ua)) return 'Firefox';
            if (/safari/i.test(ua)) return 'Safari';
            if (/msie|trident/i.test(ua)) return 'Internet Explorer';
            if (/edge/i.test(ua)) return 'Edge';
            return 'Unknown';
        }
        return 'unknown';
    }

    // 获取事件参数
    _getEventParams(event) {
        if (this._isClient()) {
            return {
                element_id: event.target.id,
                element_class: event.target.className,
                element_text: event.target.innerText,
            };
        }
        return {};
    }

    // 获取来源
    _getSource() {
        return this._isClient() ? document.referrer : '';
    }
}

export default AnalyticsSDK;