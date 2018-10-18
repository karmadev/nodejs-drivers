import { Observable } from 'rxjs'

export interface IPubSubSubscriptionMessage {
  /** GCP's own data structure for the subscription message.  */
  gcpMessage: any
  /** Acknowledge that you have processed the message so PubSub doesn't try to send it again.
   * Make sure that you always handle the message before calling ack(), and that you are always prepared to get the same message twice.
   */
  ack(): void
  /** Tries to parse the message data as JSON and return it as type T.  */
  parseMessage(): any
}

export interface IRpcMessage {
  meta: {
    correlationId: string
    replyTo: string
  }
}

export interface IPubSub {
  /** Creates a topic if one with the given name doesn't exist. Returns the internal GCP Topic data structure for the given name. */
  createTopic(name: string): Promise<any>
  /** Publishes a message of type T to the named topic. Returns the internal GCP response type. */
  publishMessage<T extends {}>(topicName: string, message: T): Promise<any>
  /** Creates a subscription if one with the given names doesn't already exist. Returns an rxjs Observable stream for consuming the incoming messages. */
  subscribe(
    topicName: string,
    subscriptionName: string
  ): Observable<IPubSubSubscriptionMessage>
  createSubscription(
    topicName: string,
    subscriptionName: string,
    options: object
  ): Promise<any>
  getSubscriptions(): Promise<any[]>
  /** Issue an RPC (request/response) message. */
  request(topicName: string, message: IRpcMessage): Promise<any>
}
