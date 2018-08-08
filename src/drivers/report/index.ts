import * as makeJsReport from 'jsreport-core'
import * as makeJsReportJsRender from 'jsreport-jsrender'
import * as makeJsReportPhantomPdf from 'jsreport-phantom-pdf'
import * as cT from '../../config/types'

export const makeReport = (config: cT.IConfig) => {
  const jsReport = makeJsReport({ tasks: { strategy: 'in-process' } })
  const initP = jsReport.init()
  const driver = args => {
    jsReport.use(makeJsReportJsRender())
    jsReport.use(makeJsReportPhantomPdf())
    return initP
      .then(() => {
        return jsReport
          .render({
            data: {},
            template: {
              content: args.content,
              engine: 'jsrender',
              recipe: 'phantom-pdf',
            },
          })
          .then(res => res.stream)
      })
      .catch(err => {
        throw err
      })
  }

  return {
    driver,
    initP,
  }
}
