import * as makeJsReport from 'jsreport-core'
import * as makeJsReportJsRender from 'jsreport-jsrender'
import * as makeJsReportPhantomPdf from 'jsreport-phantom-pdf'

export const makeReport = config => {
  const jsReport = makeJsReport({ tasks: { strategy: 'in-process' } })
  const reportInitP = jsReport.init()
  const reportDriver = args => {
    jsReport.use(makeJsReportJsRender())
    jsReport.use(makeJsReportPhantomPdf())
    return reportInitP
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
    reportDriver,
    reportInitP,
  }
}
