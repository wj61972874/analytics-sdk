declare module 'analytics-sdk-jay' {
    interface AnalyticsConfig {
        apiEndpoint: string;
        userId?: string;
        userRole?: string;
        trackClicks?: boolean;
        trackViews?: boolean;
        trackSearches?: boolean;
        searchButtonId?: string;
    }

    class AnalyticsSDK {
        constructor();
        init(config: AnalyticsConfig): void;
        trackClick(event: Event): void;
        trackView(event: Event): void;
        trackSearch(event: Event): void;
    }

    export default AnalyticsSDK;
}