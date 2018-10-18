export type IApiResponse = any
export type IDeleteTopicResponse = [IApiResponse]
export type ITopicExistsResponse = [boolean]
export type IGetTopicResponse = [ITopic, IApiResponse]
export type ICreateTopicResponse = [ITopic, IApiResponse]
export type IGetSubscriptionResponse = [ISubscription, IApiResponse]
export type IGetSubscriptionsResponse = [ISubscription[], IApiResponse]
export type IGetTopicsResponse = [ITopic[], IApiResponse]
export type IPublisherPublishResponse = [string]

export interface ISubscription {
  get(gaxOpts: { autoCreate: boolean }): Promise<IGetSubscriptionResponse>
  on(eventName: 'message' | 'error', callback: (data: any) => void): void
}

export interface IPublisher {
  publish(dataBuffer: Buffer): Promise<IPublisherPublishResponse>
}

export interface ITopic {
  name: string
  delete(): Promise<IDeleteTopicResponse>
  exists(): Promise<ITopicExistsResponse>
  publisher(): IPublisher
  subscription(subscriptionName): ISubscription
}

export interface IPubSub {
  createTopic(topicName: string): Promise<ICreateTopicResponse>
  topic(topicName: string): ITopic
  getTopics(): Promise<IGetTopicsResponse>
  getSubscriptions(): Promise<IGetSubscriptionsResponse>
}
