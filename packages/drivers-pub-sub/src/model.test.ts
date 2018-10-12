import { GcpPubSubMock } from './mocks'
import { PubSub } from './model'
import { take } from 'rxjs/operators'

test('createTopic', async () => {
  const gcpPubSubMock = new GcpPubSubMock()
  const pubSub = new PubSub('test-project-id', gcpPubSubMock)
  const result = await pubSub.createTopic('t')
  expect(result).toEqual({ topicName: 't' })
})

test('publishMessage', async () => {
  const gcpPubSubMock = new GcpPubSubMock()
  const pubSub = new PubSub('test-project-id', gcpPubSubMock)
  const result = await pubSub.publishMessage('t', { testKey: 'test value' })
  expect(JSON.parse(result.toString())).toEqual({ testKey: 'test value' })
})

test('createSubscription', async () => {
  const gcpPubSubMock = new GcpPubSubMock()
  const pubSub = new PubSub('test-project-id', gcpPubSubMock)
  const result = await pubSub
    .createSubscription<{ a: 'b' }>('t', 's')
    .pipe(take(1))
    .toPromise()
  expect(result.parseMessage()).toEqual({ a: 'b' })
})

test('getSubscriptions', async () => {
  const gcpPubSubMock = new GcpPubSubMock()
  const pubSub = new PubSub('test-project-id', gcpPubSubMock)
  const result = await pubSub.getSubscriptions()
  expect(result).toEqual([])
})
