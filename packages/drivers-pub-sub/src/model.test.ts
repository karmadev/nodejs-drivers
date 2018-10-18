import * as Emulator from 'google-pubsub-emulator'
import { PubSub } from './model'
import { take, map } from 'rxjs/operators'
import { IRpcMessage } from './types'

let emulator
const pubSubProjectId = process.env.PUBSUB_PROJECT_ID

if (!pubSubProjectId) {
  throw new Error('Missing env var PUBSUB_PROJECT_ID.')
}

// If running against GCP Pub/Sub it might take a while to create the topics and subscriptions.
jest.setTimeout(30000)

// TODO: We should add a way to easily cleanup topics and subscriptions when running against a real GCP Pub/Sub.
beforeEach(() => {
  emulator = new Emulator({
    debug: false,
    topic: [],
  })
  return emulator.start()
})

afterEach(() => {
  return emulator.stop()
})

test('createTopic', async () => {
  const pubSub = new PubSub(pubSubProjectId)
  const response = await pubSub.createTopic('topic-name')
  const result = response.name
  expect(result).toEqual(`projects/${pubSubProjectId}/topics/topic-name`)
})

test('publishMessage', async () => {
  const pubSub = new PubSub(pubSubProjectId)
  await pubSub.createTopic('topic-name')
  await pubSub.createSubscription('topic-name', 'subscription-name')
  await pubSub.publish('topic-name', {
    testKey: 'test value',
  })
  const result = await pubSub
    .subscribe('topic-name', 'subscription-name')
    .pipe(
      take(1),
      map(psMsg => psMsg.parseMessage())
    )
    .toPromise()
  expect(result).toEqual({ testKey: 'test value' })
})

test('createSubscription', async () => {
  const pubSub = new PubSub(pubSubProjectId)
  const response = await pubSub.createTopic('topic-name')
  const result = await pubSub.createSubscription(
    'topic-name',
    'subscription-name'
  )
  expect(typeof result.on).toEqual('function')
})

test('getSubscriptions', async () => {
  const pubSub = new PubSub(pubSubProjectId)
  const response = await pubSub.createTopic('topic-name')
  await pubSub.createSubscription('topic-name', 'subscription-name')
  const result = await pubSub.getSubscriptions()
  expect(result.length).toEqual(1)
})

test('request', async () => {
  const replyTo = 'reply-to'
  const requestName = 'request'
  const pubSub = new PubSub(pubSubProjectId)
  await pubSub.createTopic(requestName)
  await pubSub.createSubscription(requestName, requestName)
  pubSub
    .subscribe(requestName, requestName)
    .pipe(take(1))
    .toPromise()
    .then(async subMsg => {
      await pubSub.publish(replyTo, {
        meta: {
          correlationId: (subMsg.parseMessage() as IRpcMessage).meta
            .correlationId,
        },
        method: 'SUCCEEDED',
      })
      subMsg.ack()
    })

  const message: IRpcMessage = {
    meta: {
      correlationId: '11111111-1111-1111-1111-111111111111',
      replyTo,
    },
  }
  const result = await pubSub.request(requestName, message)
  result.ack()
  expect(result.parseMessage()).toEqual({
    meta: {
      correlationId: '11111111-1111-1111-1111-111111111111',
    },
    method: 'SUCCEEDED',
  })
})
