//function which extracts certain keys from an object
export const extractFromObject = (array, keys) =>
	Object.fromEntries(
		Object.entries(array).filter(([key]) => !keys.includes(key))
	);
