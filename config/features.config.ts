// config/features.config.ts

type FeatureFlag = boolean;

export interface FeatureConfig {
    auth: {
        enabled: FeatureFlag;
        cookieName: string;
        sessionDuration: number;
        maxLoginAttempts: number;
        passwordValidation: {
            enabled: FeatureFlag;
            minLength: number;
            requireNumbers: boolean;
            requireSpecialChars: boolean;
            requireUppercase: boolean;
            requireLowercase: boolean;
            minimumStrength: number;
        };
    };
    profiles: {
        enabled: FeatureFlag;
        avatarUpload: FeatureFlag;
        socialLinks: FeatureFlag;
    };
    activity: {
        enabled: FeatureFlag;
        logFailedAttempts: FeatureFlag;
        logDeviceInfo: FeatureFlag;
        logLocation: FeatureFlag;
    };
    security: {
        enabled: FeatureFlag;
        rateLimiting: {
            enabled: FeatureFlag;
            windowMs: number; // Time window for attempts
            maxAttempts: number; // Max attempts per window
            blockDuration: number; // How long to block after max attempts
        };
        ipBlocking: FeatureFlag;
    };
    sessionIndicator: {
        enabled: FeatureFlag;
    };
}

const defaultConfig: FeatureConfig = {
    auth: {
        enabled: true,
        cookieName: 'auth_token',
        sessionDuration: 3600,
        maxLoginAttempts: 5,
        passwordValidation: {
            enabled: true,
            minLength: 8,
            requireNumbers: true,
            requireSpecialChars: true,
            requireUppercase: true,
            requireLowercase: true,
            minimumStrength: 2,
        },
    },
    profiles: {
        enabled: true,
        avatarUpload: true,
        socialLinks: true,
    },
    activity: {
        enabled: true,
        logFailedAttempts: true,
        logDeviceInfo: true,
        logLocation: true,
    },
    security: {
        enabled: true,
        rateLimiting: {
            enabled: true,
            windowMs: 900000, // 15 minutes
            maxAttempts: 5, // 5 attempts
            blockDuration: 1800000, // 30 minute block
        },
        ipBlocking: false,
    },
    sessionIndicator: {
        enabled: true,
    },
};

function parseEnvBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
}

function parseEnvNumber(value: string | undefined, defaultValue: number): number {
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

export const featureConfig: FeatureConfig = {
    auth: {
        enabled: parseEnvBoolean(process.env.FEATURE_AUTH_ENABLED, true),
        cookieName: process.env.AUTH_COOKIE_NAME ?? defaultConfig.auth.cookieName,
        sessionDuration: parseEnvNumber(process.env.AUTH_SESSION_DURATION, defaultConfig.auth.sessionDuration),
        maxLoginAttempts: parseEnvNumber(process.env.AUTH_MAX_LOGIN_ATTEMPTS, defaultConfig.auth.maxLoginAttempts),
        passwordValidation: {
            enabled: parseEnvBoolean(process.env.FEATURE_PASSWORD_VALIDATION, true),
            minLength: parseEnvNumber(process.env.PASSWORD_MIN_LENGTH, defaultConfig.auth.passwordValidation.minLength),
            requireNumbers: parseEnvBoolean(process.env.PASSWORD_REQUIRE_NUMBERS, defaultConfig.auth.passwordValidation.requireNumbers),
            requireSpecialChars: parseEnvBoolean(process.env.PASSWORD_REQUIRE_SPECIAL, defaultConfig.auth.passwordValidation.requireSpecialChars),
            requireUppercase: parseEnvBoolean(process.env.PASSWORD_REQUIRE_UPPERCASE, defaultConfig.auth.passwordValidation.requireUppercase),
            requireLowercase: parseEnvBoolean(process.env.PASSWORD_REQUIRE_LOWERCASE, defaultConfig.auth.passwordValidation.requireLowercase),
            minimumStrength: parseEnvNumber(process.env.PASSWORD_MIN_STRENGTH, defaultConfig.auth.passwordValidation.minimumStrength),
        },
    },
    profiles: {
        enabled: parseEnvBoolean(process.env.FEATURE_PROFILES_ENABLED, true),
        avatarUpload: parseEnvBoolean(process.env.FEATURE_AVATAR_UPLOAD, true),
        socialLinks: parseEnvBoolean(process.env.FEATURE_SOCIAL_LINKS, true),
    },
    activity: {
        enabled: parseEnvBoolean(process.env.FEATURE_ACTIVITY_ENABLED, true),
        logFailedAttempts: parseEnvBoolean(process.env.FEATURE_LOG_FAILED_ATTEMPTS, true),
        logDeviceInfo: parseEnvBoolean(process.env.FEATURE_LOG_DEVICE_INFO, true),
        logLocation: parseEnvBoolean(process.env.FEATURE_LOG_LOCATION, true),
    },
    security: {
        enabled: parseEnvBoolean(process.env.FEATURE_SECURITY_ENABLED, true),
        rateLimiting: {
            enabled: parseEnvBoolean(process.env.FEATURE_RATE_LIMITING, true),
            windowMs: parseEnvNumber(process.env.RATE_LIMIT_WINDOW, defaultConfig.security.rateLimiting.windowMs),
            maxAttempts: parseEnvNumber(process.env.RATE_LIMIT_MAX_ATTEMPTS, defaultConfig.security.rateLimiting.maxAttempts),
            blockDuration: parseEnvNumber(process.env.RATE_LIMIT_BLOCK_DURATION, defaultConfig.security.rateLimiting.blockDuration),
        },
        ipBlocking: parseEnvBoolean(process.env.FEATURE_IP_BLOCKING, defaultConfig.security.ipBlocking),
    },
    sessionIndicator: {
        enabled: parseEnvBoolean(process.env.FEATURE_SESSION_INDICATOR_ENABLED, true),
    },
};

export function isFeatureEnabled(feature: keyof FeatureConfig): boolean {
    return featureConfig[feature].enabled;
}

export function getFeatureConfig<T extends keyof FeatureConfig>(feature: T): FeatureConfig[T] {
    return featureConfig[feature];
}