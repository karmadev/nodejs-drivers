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
  close(): Promise<void>
}

export interface ITopic {
  name: string
  delete(): Promise<IDeleteTopicResponse>
  exists(): Promise<ITopicExistsResponse>
  subscription(subscriptionName): ISubscription
  publishJSON(message: any): Promise<string>
}

export interface IPubSub {
  createTopic(topicName: string): Promise<ICreateTopicResponse>
  topic(topicName: string): ITopic
  getTopics(): Promise<IGetTopicsResponse>
  getSubscriptions(): Promise<IGetSubscriptionsResponse>
}
