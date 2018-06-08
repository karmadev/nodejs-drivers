import { makeReport } from './index'

test('makeReport', () => {
  const { reportDriver } = makeReport({})
  const resultP = reportDriver({ content: '<h1>Test</h1>' })
  return resultP.then(resultStream => {
    let streamResult = ''
    const expectP = new Promise(resolve => {
      resultStream.on('data', data => {
        streamResult += data
      })
      resultStream.on('end', () => {
        expect(streamResult.toString().length).toEqual(3494)
        resolve()
      })
    })
    return expectP
  })
})
