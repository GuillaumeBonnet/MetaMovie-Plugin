import { AxiosError } from 'axios';

const removeElemIf = <T>(
	list: Array<T>,
	predicate: (value: T, index: number, obj: T[]) => unknown
) => {
	const index = list.findIndex(predicate);
	if (index != -1) {
		list.splice(index, 1);
	}
};

const axiosErrorMessage = (err: AxiosError) => {
	if (err.response && err.response.data.message) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		return err.response.data.message;
	} else if (err.request) {
		// The request was made but no response was received
		// `err.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.error(err.request);
		return 'No response received from the server';
	} else {
		// Something happened in setting up the request that triggered an Error
		console.error(err.message);
		return 'Error';
	}
};
export { removeElemIf, axiosErrorMessage };
