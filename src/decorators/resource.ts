import Controller from '../controller';

export default (resource: string) => {
	return (target: typeof Controller) => {
		(target as any).__resource__ = resource;
	};
};
