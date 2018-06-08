export interface IMsgBrokerRequest {
  exchangeName: string
  replyTo: string
  routingKey: string
  type: 'request'
}

export interface IMsgBrokerCommand {
  exchangeName: string
  routingKey: string
  type: 'command'
}
