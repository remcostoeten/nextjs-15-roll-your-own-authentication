import { colorsPageMetadata } from '@/core/config/metadata'
import { ColorsView } from '@/views/demos/colors-view'

export const metadata = colorsPageMetadata
export const revalidate = 0

export default function ColorsPage() {
	return <ColorsView />
}
