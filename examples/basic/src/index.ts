import { main } from './main'
import { Config } from '@karmalicious/drivers-config'
import * as dotenv from 'dotenv'

dotenv.config()

const config = Config('BASIC_', process.env, ['EXTERNAL_LIB_KEY'])
const deps = {
  config,
}

// tslint:disable-next-line:no-console
console.log(JSON.stringify(config, null, 2))

main(deps)
