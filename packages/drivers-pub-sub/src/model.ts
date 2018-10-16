import * as GcpPubSub from '@google-cloud/pubsub'
import { Subject, Observable } from 'rxjs'
import {
  IPubSub,
  IPubSubSubscriptionMessage,
  IGcpPubSub,
  IGcpPubSubSubscription,
} from './types'

export class PubSub implements IPubSub {
  private projectId: string
  private gcpPubSub: IGcpPubSub

  constructor(projectId: string, mockedGcpPubSub?: IGcpPubSub) {
    if (!projectId) {
      throw new Error('Missing argument projectId in PubSub constructor.')
    }

    this.projectId = projectId

    if (mockedGcpPubSub) {
      this.gcpPubSub = mockedGcpPubSub
    } else {
      this.gcpPubSub = new GcpPubSub({
        projectId: this.projectId,
      })
    }
  }

  public createTopic(name: string): Promise<any> {
    return this.gcpPubSub.getTopics().then((results: any[]) => {
      const topics = results[0]
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
    const dataBuffer = Buffer.from(JSON.stringify(message))
    return this.gcpPubSub
      .topic(topicName)
      .publisher()
      .publish(dataBuffer)
  }

  public createSubscription<T>(
    topicName: string,
    subscriptionName: string
  ): Observable<IPubSubSubscriptionMessage<T>> {
    const subject = new Subject<IPubSubSubscriptionMessage<T>>()
    this.gcpPubSub
      .topic(topicName)
      .createSubscription(subscriptionName)
      .then((results: any[]) => results[0])
      .then(subscription => {
        subscription.on('message', (gcpMessage: any) => {
          const message: IPubSubSubscriptionMessage<T> = {
            gcpMessage,
            ack: () => gcpMessage.ack(),
            parseMessage: () => JSON.parse(gcpMessage.data.toString()),
          }
          subject.next(message)
        })
        subscription.on('error', (e: any) => {
          subject.error(e)
        })
      })
    return subject.asObservable()
  }

  public getSubscriptions(): Promise<any[]> {
    return this.gcpPubSub.getSubscriptions().then(results => results[0])
  }
}
