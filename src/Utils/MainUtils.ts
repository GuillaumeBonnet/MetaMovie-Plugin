const removeElemIf = <T>(
	list: Array<T>,
	predicate: (value: T, index: number, obj: T[]) => unknown
) => {
	const index = list.findIndex(predicate);
	if (index != -1) {
		list.splice(index, 1);
	}
};
export { removeElemIf };
