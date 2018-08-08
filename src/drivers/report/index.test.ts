import { makeReport } from './index'

test('makeReport', () => {
  const { driver } = makeReport({})
  const resultP = driver({ content: '<h1>Test</h1>' })
  return resultP.then(resultStream => {
    let streamResult = ''
    const expectP = new Promise(resolve => {
      resultStream.on('data', data => {
        streamResult += data
      })
      resultStream.on('end', () => {
        expect(streamResult.toString().length).toEqual(6498)
        resolve()
      })
    })
    return expectP
  })
})
