import { FeatureConfig, getFeatureConfig } from '@/core/config/FEATURE_CONFIG'
import { useUser } from '@/shared/hooks/use-user'

// Hook for client components to get feature config
export function useFeatureConfig(): FeatureConfig {
	const { user } = useUser()
	return getFeatureConfig(user?.role)
}
