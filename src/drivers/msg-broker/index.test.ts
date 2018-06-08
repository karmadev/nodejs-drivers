import { internal } from './index'
const { makeOngoingMsgs } = internal

test('makeOngoingMsgs', () => {
  const correlationId = '123'
  const mockCon = { ack: () => Promise.resolve() }
  const mockConnectionP = Promise.resolve(mockCon)
  const timeoutMs = 0
  const mockMsg = {
    content: Buffer.from(JSON.stringify({ value: 'foo' })),
    properties: { correlationId },
  }
  const mockLogger = {
    info: () => null,
  }

  const ongoingMsgs = makeOngoingMsgs(mockConnectionP, timeoutMs, mockLogger)

  const resultP = ongoingMsgs.registerReq(correlationId)
  ongoingMsgs.resolveReq(mockMsg)

  return resultP.then(msgResult => {
    const result = JSON.parse(msgResult.content.toString())
    return expect(result).toEqual({ value: 'foo' })
  })
})
