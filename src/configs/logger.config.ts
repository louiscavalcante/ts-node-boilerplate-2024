import { format, addColors, LoggerTraceability } from 'traceability'

const levelColors = {
	info: 'green',
	warn: 'yellow',
	error: 'red',
}
const colorizer = format.colorize()
addColors(levelColors)

export const loggerConfiguration = LoggerTraceability.getLoggerOptions()

const oldFormat = loggerConfiguration.format || format.combine()
const formatted = format.combine(
	oldFormat,
	format.timestamp(),
	format.simple(),
	format.printf(msg => {
		let logMsg = `${colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}:`)} `
		logMsg += msg.cid ? `cid: ${msg.cid} ` : ''
		logMsg += msg.message ? `${msg.message} ` : ''
		logMsg += msg.name ? `name: ${msg.name} ` : ''
		logMsg += msg.status ? `status: ${msg.status} ` : ''
		logMsg += msg.signalCode ? `signalCode: ${msg.signalCode} ` : ''
		logMsg += msg.exitReason ? `exitReason: ${msg.exitReason} ` : ''
		logMsg += msg.axiosError ? `axiosError: ${JSON.stringify(msg.axiosError)} ` : ''
		logMsg += msg.stack ? `stack: ${JSON.stringify(msg.stack)} ` : ''

		return logMsg
	})
)
loggerConfiguration.format = formatted
