export const getUniqueString = (baseString: string) => {
	return `${baseString}${Date.now()}`;
};
