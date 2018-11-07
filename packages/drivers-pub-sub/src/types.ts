import { Observable } from 'rxjs'
import * as Gcp from './gcp-types'

export interface ISubscriptionMessage {
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

export interface IRequestState {
  [replyTo: string]: {
    [correlationId: string]: Observable<any>
  }
}

export interface IPubSub {
  /** Creates a topic if one with the given name doesn't exist. The topic is then added to the runtime state and used by methods like publish and request. */
  createTopic(name: string): Promise<void>

  /** Creates a GCP subscription if one with the given names doesn't already exist. The subscription is then added to the runtime state and used by methods like subscribe. */
  createSubscription(topicName: string, subscriptionName: string): Promise<void>

  /** Creates a GCP subscription if one with the given names doesn't already exist. The replyTo subscription is then added to the runtime state and used by methods like request. */
  createReplyToSubscription(replyToName: string): Promise<void>

  /** Publishes a message to the named topic. */
  publish(topicName: string, message: any): Promise<void>

  getSubscription(
    topicName: string,
    subscriptionName: string
  ): Observable<ISubscriptionMessage>
  /** Issue an RPC (request/response) message. */
  request(topicName: string, message: IRpcMessage): Promise<any>

  /** Closes all connections */
  close(): Promise<void>
}
