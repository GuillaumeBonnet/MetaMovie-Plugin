import axios, { AxiosError } from 'axios';

const removeElemIf = <T>(
	list: Array<T>,
	predicate: (value: T, index: number, obj: T[]) => unknown
) => {
	const index = list.findIndex(predicate);
	if (index != -1) {
		list.splice(index, 1);
	}
};

const axiosErrorMessage = (err: unknown) => {
	if (!(err instanceof Error)) {
		throw Error('Unexpected err object');
	}
	if (!axios.isAxiosError(err)) {
		// Something happened in setting up the request that triggered an Error
		console.error(err.message);
		return 'Error';
	}
	const castedErr = err as AxiosError<{ message: string }>;
	if (castedErr.response?.data.message) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		return castedErr.response.data.message;
	} else if (castedErr.request) {
		// The request was made but no response was received
		// `err.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.error(castedErr.request);
		return 'No response received from the server';
	} else {
		return 'Error';
	}
};
export { removeElemIf, axiosErrorMessage };
