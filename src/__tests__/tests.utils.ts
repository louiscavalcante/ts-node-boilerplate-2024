import { Writable } from 'node:stream'
import { LoggerTraceability } from 'traceability'
import winston from 'winston'
import * as Transport from 'winston-transport'

import { loggerConfiguration } from '@configs/logger.config'

export const getLoggerOutput = (): {
	loggerOutputData: string[]
	streamTransport: Transport[] | Transport
} => {
	const loggerOutputData: string[] = []
	const stream = new Writable()
	stream._write = (chunk, encoding, next) => {
		loggerOutputData.push(chunk.toString())
		next()
	}
	const streamTransport = new winston.transports.Stream({ stream })
	loggerConfiguration.transports = [streamTransport]
	LoggerTraceability.configure(loggerConfiguration)

	return { loggerOutputData, streamTransport }
}
