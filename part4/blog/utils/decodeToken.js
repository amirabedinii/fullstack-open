import jwt from 'jsonwebtoken'
import config from './config.js'

const decodeToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET)
}

export default decodeToken

