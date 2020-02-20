import Controller from '../controller';

export default (version: number) => {
	return (target: typeof Controller) => {
		(target as any).version = version;
	};
};
