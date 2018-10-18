import * as GcpPubSub from '@google-cloud/pubsub'
import { Subject, Observable } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { IPubSubSubscriptionMessage, IPubSub, IRpcMessage } from './types'
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

  public createTopic(name: string): Promise<any> {
    return this.gcpPubSub.getTopics().then((results: any[]) => {
      const [topics] = results
      const found = topics.find(
        topic => topic.name === `projects/${this.projectId}/topics/${name}`
      )
      return found
        ? found
        : this.gcpPubSub
            .createTopic(name)
            .then(createResults => createResults[0])
    })
  }

  public publishMessage<T extends {}>(
    topicName: string,
    message: T
  ): Promise<any> {
    const dataBuffer = Buffer.from(JSON.stringify(message), 'utf-8')
    return this.gcpPubSub
      .topic(topicName)
      .publisher()
      .publish(dataBuffer)
  }

  public subscribe(
    topicName: string,
    subscriptionName: string
  ): Observable<IPubSubSubscriptionMessage> {
    const subject = new Subject<IPubSubSubscriptionMessage>()
    this.createSubscription(topicName, subscriptionName)
      .then((results: any[]) => results[0])
      .then(subscription => {
        subscription.on('message', (gcpMessage: any) => {
          const message: IPubSubSubscriptionMessage = {
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

  public createSubscription(
    topicName: string,
    subscriptionName: string
  ): Promise<any> {
    return this.gcpPubSub
      .topic(topicName)
      .subscription(subscriptionName)
      .get({ autoCreate: true })
  }

  public getSubscriptions(): Promise<any[]> {
    return this.gcpPubSub.getSubscriptions().then(results => results[0])
  }

  public request(topicName: string, message: IRpcMessage): Promise<any> {
    const { replyTo } = message.meta
    return this.createSubscription(topicName, replyTo)
      .then(_ => this.publishMessage(topicName, message))
      .then(_ =>
        this.subscribe(topicName, replyTo)
          .pipe(
            filter(
              (response: any) =>
                response.meta.correlationId === message.meta.correlationId
            ),
            take(1)
          )
          .toPromise()
      )
  }
}
