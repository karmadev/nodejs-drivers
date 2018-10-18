import * as GcpPubSub from '@google-cloud/pubsub'
import { Subject, Observable } from 'rxjs'
import { map, take, filter } from 'rxjs/operators'
import { ISubscriptionMessage, IPubSub, IRpcMessage } from './types'
import * as Gcp from './gcp-types'

export class PubSub implements IPubSub {
  private projectId: string
  private gcpPubSub: Gcp.IPubSub

  constructor(projectId: string) {
    if (projectId === '') {
      throw new Error('Missing argument projectId in PubSub constructor.')
    }

    this.projectId = projectId
    this.gcpPubSub = new GcpPubSub({ projectId })
  }

  public async createTopic(name: string): Promise<Gcp.ITopic> {
    const [topics] = await this.gcpPubSub.getTopics()
    const found = topics.find(
      topic => topic.name === `projects/${this.projectId}/topics/${name}`
    )
    if (found) {
      return found
    }
    const [result] = await this.gcpPubSub.createTopic(name)
    return result
  }

  public publish(topicName: string, message: any): Promise<any> {
    const dataBuffer = Buffer.from(JSON.stringify(message), 'utf8')
    return this.gcpPubSub
      .topic(topicName)
      .publisher()
      .publish(dataBuffer)
  }

  public subscribe(
    topicName: string,
    subscriptionName: string
  ): Observable<ISubscriptionMessage> {
    const subject = new Subject<ISubscriptionMessage>()
    this.createSubscription(topicName, subscriptionName).then(subscription => {
      subscription.on('message', (gcpMessage: any) => {
        const message: ISubscriptionMessage = {
          gcpMessage,
          ack: () => gcpMessage.ack(),
          // TODO: Add validation function injection.
          // TODO: Return IParseError if JSON.parse fails.
          parseMessage: () => JSON.parse(gcpMessage.data.toString()),
        }
        return subject.next(message)
      })
      subscription.on('error', (e: any) => {
        return subject.error(e)
      })
    })
    return subject.asObservable()
  }

  public async createSubscription(
    topicName: string,
    subscriptionName: string
  ): Promise<Gcp.ISubscription> {
    const [result] = await this.gcpPubSub
      .topic(topicName)
      .subscription(subscriptionName)
      .get({ autoCreate: true })
    return result
  }

  public async getSubscriptions(): Promise<Gcp.ISubscription[]> {
    const [result] = await this.gcpPubSub.getSubscriptions()
    return result
  }

  public async request(
    requestTopicName: string,
    message: IRpcMessage
  ): Promise<ISubscriptionMessage> {
    const { replyTo } = message.meta
    await this.createTopic(replyTo)
    await this.createSubscription(replyTo, replyTo)
    await this.publish(requestTopicName, message)
    return this.subscribe(replyTo, replyTo)
      .pipe(
        filter(
          response =>
            response.parseMessage().meta.correlationId ===
            message.meta.correlationId
        ),
        take(1)
      )
      .toPromise()
  }
}
