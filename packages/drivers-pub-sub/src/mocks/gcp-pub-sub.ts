import { IGcpPubSub, IGcpPubSubTopic } from '../types'
import { GcpPubSubTopicMock } from './gcp-pub-sub-topic'

export class GcpPubSubMock implements IGcpPubSub {
  public topic(topicName: string): IGcpPubSubTopic {
    return new GcpPubSubTopicMock()
  }
  public getTopics(): Promise<any> {
    return Promise.resolve([[]])
  }
  public createTopic(topicName: string): Promise<any> {
    return Promise.resolve([{ topicName }])
  }
  public getSubscriptions(): Promise<any[][]> {
    return Promise.resolve([[]])
  }
}
