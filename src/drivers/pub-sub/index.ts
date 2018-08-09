import * as GcpPubSub from '@google-cloud/pubsub'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

type PubSubResult = any

export class PubSub {
  private projectId: string
  private client: any

  constructor(projectId, logger) {
    this.projectId = projectId
    this.client = new GcpPubSub({
      projectId: this.projectId,
    })
  }

  public createTopic(name: string): Promise<PubSubResult> {
    return this.client.getTopics().then(results => {
      const topics = results[0]
      const found = topics.find(
        topic => topic.name === `projects/${this.projectId}/topics/${name}`
      )
      return found
        ? found
        : this.client.createTopic(name).then(createResults => createResults[0])
    })
  }

  public publishMessage(topicName: string, data: any): Promise<any> {
    const dataBuffer = Buffer.from(JSON.stringify(data))

    return this.client
      .topic(topicName)
      .publisher()
      .publish(dataBuffer)
  }

  public createSubscription(
    topicName: string,
    subscriptionName: string
  ): Promise<Subject<any>> {
    return this.client
      .topic(topicName)
      .createSubscription(subscriptionName)
      .then(results => results[0])
      .then(subscription => {
        const subject = new Subject<any>()
        subscription.on('message', d => subject.next(d))
        subscription.on('error', e => subject.error(e))
        return subject.pipe(map(a => a))
      })
  }

  public getSubscriptions(): Promise<any[]> {
    return this.client.getSubscriptions().then(results => results[0])
  }
}
