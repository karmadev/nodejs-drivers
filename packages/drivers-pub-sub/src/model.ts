import * as GcpPubSub from '@google-cloud/pubsub'
import { Subject, Observable } from 'rxjs'
import { map, take, filter, tap, share } from 'rxjs/operators'
import {
  ISubscriptionMessage,
  IPubSub,
  IRpcMessage,
  IRequestState,
} from './types'
import * as Gcp from './gcp-types'

export class PubSub implements IPubSub {
  private projectId: string
  private gcpPubSub: Gcp.IPubSub
  private topics: { [topicName: string]: Gcp.ITopic }
  private subscriptions: {
    [topicName: string]: { [subscriptionName: string]: Observable<any> }
  }
  private replyTos: {
    [topicName: string]: { [subscriptionName: string]: Observable<any> }
  }

  constructor(projectId: string) {
    if (projectId === '') {
      throw new Error('Missing argument projectId in PubSub constructor.')
    }

    this.projectId = projectId
    this.gcpPubSub = new GcpPubSub({ projectId })
    this.topics = {}
    this.subscriptions = {}
    this.replyTos = {}
  }

  public async createTopic(topicName: string): Promise<void> {
    const [topics] = await this.gcpPubSub.getTopics()
    const found = topics.find(
      topic => topic.name === `projects/${this.projectId}/topics/${topicName}`
    )
    if (found) {
      this.topics[topicName] = found
    }
    const [result] = await this.gcpPubSub.createTopic(topicName)
    this.topics[topicName] = result
  }

  public async publish(topicName: string, message: any): Promise<void> {
    if (!this.topics[topicName]) {
      throw new Error(
        `Expected topicName <${topicName}> to be in the cache, but did not find it. Please call createTopic before publishing.`
      )
    }
    const dataBuffer = Buffer.from(JSON.stringify(message), 'utf8')
    await this.topics[topicName].publisher().publish(dataBuffer)
  }

  public async request(
    topicName: string,
    reqMessage: IRpcMessage
  ): Promise<any> {
    const { replyTo } = reqMessage.meta
    if (!this.topics[topicName]) {
      throw new Error(
        `Expected topicName <${topicName}> to be in the cache, but did not find it. Please call createTopic before making a request.`
      )
    }
    if (!this.replyTos[replyTo] || !this.replyTos[replyTo][replyTo]) {
      throw new Error(
        `Expected the cache to contain a subscription for topicName <${topicName}> and replyTo <${replyTo}>. Please call createSubscription before making a request.`
      )
    }
    const result = this.replyTos[replyTo][replyTo]
      .pipe(
        filter(
          (resMessage: IRpcMessage) =>
            resMessage.meta.correlationId === reqMessage.meta.correlationId
        ),
        take(1)
      )
      .toPromise()
    await this.publish(topicName, reqMessage)
    return result
  }

  public getSubscription(
    topicName: string,
    subscriptionName: string
  ): Observable<ISubscriptionMessage> {
    if (
      !this.subscriptions[topicName] ||
      !this.subscriptions[topicName][subscriptionName]
    ) {
      throw new Error(
        `Expected the cache to contain a subscription for topicName <${topicName}> and subscriptionName <${subscriptionName}>. Please call createSubscription before calling getSubscription.`
      )
    }
    return this.subscriptions[topicName][subscriptionName]
  }

  public createSubscription(
    topicName: string,
    subscriptionName: string
  ): Promise<void> {
    return this.createSubscriptionOrReplyToSubscription(
      topicName,
      subscriptionName,
      false
    )
  }

  public createReplyToSubscription(replyTo: string): Promise<void> {
    return this.createSubscriptionOrReplyToSubscription(replyTo, replyTo, true)
  }

  private async createSubscriptionOrReplyToSubscription(
    topicName: string,
    subscriptionName: string,
    replyTo: boolean
  ): Promise<void> {
    if (!this.topics[topicName]) {
      throw new Error(
        `Expected the cache to contain a topic for topicName <${topicName}>. Please call createTopic before creating a subscription.`
      )
    }

    const cacheName = replyTo ? 'replyTos' : 'subscriptions'
    const cache = this[cacheName]

    if (!cache[topicName]) {
      cache[topicName] = {}
    }
    const [gcpSubscription] = await this.gcpPubSub
      .topic(topicName)
      .subscription(subscriptionName)
      .get({ autoCreate: true })
    const messageStream = new Subject<ISubscriptionMessage>()

    gcpSubscription.on('message', (gcpMessage: any) => {
      const message: ISubscriptionMessage = {
        gcpMessage,
        ack: () => gcpMessage.ack(),
        parseMessage: () => JSON.parse(gcpMessage.data.toString()),
      }
      messageStream.next(message)
    })

    gcpSubscription.on('error', (e: any) => {
      messageStream.error(e)
    })

    if (replyTo) {
      cache[topicName][subscriptionName] = messageStream.pipe(
        tap(subMsg => subMsg.ack()),
        map(subMsg => subMsg.parseMessage()),
        share()
      )
    } else {
      cache[topicName][subscriptionName] = messageStream.asObservable()
    }
  }
}
