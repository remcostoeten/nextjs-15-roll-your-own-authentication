import crypto from 'crypto'
import { copyToClipboard } from './utils.js'

const secret = 'JWT_SECRET=' + crypto.randomBytes(32).toString('hex')
copyToClipboard(secret)
console.log(secret + ' (Copied to clipboard!)')
