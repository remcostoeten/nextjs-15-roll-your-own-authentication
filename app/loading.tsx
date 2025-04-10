import { HeartbeatLoader } from '@/components/loaders/heartbeat.loader'
import { Center } from '@/shared/components/center'

export default function Loading() {
	return (
		<Center>
			<HeartbeatLoader />
		</Center>
	)
}
