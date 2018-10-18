import * as Emulator from 'google-pubsub-emulator'
import { PubSub } from './model'
import { take } from 'rxjs/operators'
// import * as GcpPubsub from '@google-cloud/pubsub'
import { IRpcMessage, IPubSubSubscriptionMessage } from './types'

// Holds a reference to the pubsub emulator
let emulator

const pubSubProjectId = process.env.PUBSUB_PROJECT_ID || 'ERROR_NO_PROJECT_ID'

beforeAll(() => {
  emulator = new Emulator({
    debug: false,
    topic: [], // Predefine a set of topics
  })
  return emulator.start()
})

afterAll(() => {
  return emulator.stop()
})

test('createTopic', async () => {
  const pubSub = new PubSub(pubSubProjectId)
  const response = await pubSub.createTopic('topic-name')
  const result = response.name
  expect(result).toEqual('projects/my-project-id/topics/topic-name')
})

test('publishMessage', async () => {
  const pubSub = new PubSub(pubSubProjectId)
  const result = await pubSub
    .createTopic('topic-name')
    .then(() => pubSub.createSubscription('topic-name', 'subscription-name'))
    .then(() =>
      pubSub.publishMessage('topic-name', {
        testKey: 'test value',
      })
    )
    .then(() =>
      pubSub
        .subscribe('topic-name', 'subscription-name')
        .pipe(take(1))
        .toPromise()
    )
    .then((psMsg: IPubSubSubscriptionMessage) => psMsg.parseMessage())
  expect(result).toEqual({ testKey: 'test value' })
})

// test('createSubscription', async () => {
//   const gcpPubSubMock = new GcpPubSubMock()
//   const pubSub = new PubSub('test-project-id', gcpPubSubMock)
//   const result = await pubSub
//     .createSubscription<{ a: 'b' }>('t', 's')
//     .pipe(take(1))
//     .toPromise()
//   expect(result.parseMessage()).toEqual({ a: 'b' })
// })

// test('getSubscriptions', async () => {
//   const gcpPubSubMock = new GcpPubSubMock()
//   const pubSub = new PubSub('test-project-id', gcpPubSubMock)
//   const result = await pubSub.getSubscriptions()
//   expect(result).toEqual([])
// })

// test('request', async () => {
//   const gcpPubSubMock = new GcpPubSubMock()
//   const pubSub = new PubSub('test-project-id', gcpPubSubMock)
//   const message: IRpcMessage = {
//     meta: {
//       correlationId: '',
//       replyTo: '',
//     },
//   }
//   const request = await pubSub.request('', message)
//   expect(request).toStrictEqual({
//     name: 'Kalle Testson',
//   })
// })
