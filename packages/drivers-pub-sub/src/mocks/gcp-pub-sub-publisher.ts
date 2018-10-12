import { IGcpPubSubPublisher } from '../types'

export class GcpPubSubPublisherMock implements IGcpPubSubPublisher {
  public publish(dataBuffer: Buffer): Promise<any> {
    return Promise.resolve(dataBuffer)
  }
}
