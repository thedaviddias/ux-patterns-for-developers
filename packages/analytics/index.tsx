import { OpenPanelAnalyticsComponent } from './providers/openpanel'

interface AnalyticsProviderProps {
  readonly openPanelClientId?: string
  readonly nonce?: string
}

/**
 * Provider component that injects analytics tracking scripts.
 *
 * @param props - Component properties
 * @param props.openPanelClientId - Client ID for OpenPanel Analytics
 * @returns Analytics script components
 *
 * @example
 * ```tsx
 * <AnalyticsProvider openPanelClientId="op_abc123" />
 * ```
 */
export function AnalyticsProvider({ openPanelClientId, nonce }: AnalyticsProviderProps) {
  if (!openPanelClientId || process.env.NODE_ENV !== 'production') {
    return null
  }

  return <OpenPanelAnalyticsComponent clientId={openPanelClientId} nonce={nonce} />
}
