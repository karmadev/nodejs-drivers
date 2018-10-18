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

export interface IPubSub {
  /** Creates a topic if one with the given name doesn't exist. Returns the internal GCP Topic data structure for the given name. */
  createTopic(name: string): Promise<Gcp.ITopic>
  /** Publishes a message to the named topic. Returns the internal GCP message ID. */
  publish(topicName: string, message: any): Promise<string>
  /** Creates a subscription if one with the given names doesn't already exist. It then returns an rxjs Observable stream for consuming the incoming messages. */
  subscribe(
    topicName: string,
    subscriptionName: string
  ): Observable<ISubscriptionMessage>
  // Creates a subscription if one with the given names doesn't already exist. Returns the Gcp Subscription object.
  createSubscription(
    topicName: string,
    subscriptionName: string,
    options: object
  ): Promise<Gcp.ISubscription>
  getSubscriptions(): Promise<Gcp.ISubscription[]>
  /** Issue an RPC (request/response) message. */
  request(
    topicName: string,
    message: IRpcMessage
  ): Promise<ISubscriptionMessage>
}
