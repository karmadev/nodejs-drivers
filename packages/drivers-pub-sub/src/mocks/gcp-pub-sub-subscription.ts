import { IGcpPubSubSubscription } from '../types'

export class GcpPubSubSubscriptionMock implements IGcpPubSubSubscription {
  public on(
    eventName: 'message' | 'error',
    callback: (data: any) => void
  ): void {
    if (eventName === 'message') {
      callback({
        data: Buffer.from(JSON.stringify({ a: 'b' })),
        ack() {
          //
        },
      })
    }
  }
}
