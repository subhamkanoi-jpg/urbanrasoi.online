import { JsonLd } from '@/components/json-ld'
import { siteGraph } from '@/lib/seo'

export function StructuredData() {
  return <JsonLd data={siteGraph()} />
}
