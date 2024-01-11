export function fakeDbCrash(): Promise<Error> {
	return Promise.reject(new Error('Could not connect to DB'))
}
