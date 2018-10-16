import { IGcpPubSubTopic, IGcpPubSubPublisher } from '../types'
import { GcpPubSubPublisherMock } from './gcp-pub-sub-publisher'
import { GcpPubSubSubscriptionMock } from '.'

export class GcpPubSubTopicMock implements IGcpPubSubTopic {
  public publisher(): IGcpPubSubPublisher {
    return new GcpPubSubPublisherMock()
  }
  public createSubscription(subscriptionName: any): Promise<any> {
    return Promise.resolve([new GcpPubSubSubscriptionMock()])
  }
}
