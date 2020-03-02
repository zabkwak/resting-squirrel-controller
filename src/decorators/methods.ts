import { IRequest } from 'resting-squirrel';
import Controller, { IStore } from '../controller';

export const put = (endpoint: string) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__endpoints__) {
			t.__endpoints__ = [];
		}
		t.__endpoints__.push({
			callback: (req: IRequest) => descriptor.value.apply(target, [req]),
			method: 'put',
			propertyKey,
			route: endpoint,
		});
		return descriptor;
	};
};

export const get = (endpoint: string) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__endpoints__) {
			t.__endpoints__ = [];
		}
		t.__endpoints__.push({
			callback: (req: IRequest) => descriptor.value.apply(target, [req]),
			method: 'get',
			propertyKey,
			route: endpoint,
		});
		return descriptor;
	};
};

export const post = (endpoint: string) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__endpoints__) {
			t.__endpoints__ = [];
		}
		t.__endpoints__.push({
			callback: (req: IRequest) => descriptor.value.apply(target, [req]),
			method: 'post',
			propertyKey,
			route: endpoint,
		});
		return descriptor;
	};
};

export const del = (endpoint: string) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__endpoints__) {
			t.__endpoints__ = [];
		}
		t.__endpoints__.push({
			callback: (req: IRequest) => descriptor.value.apply(target, [req]),
			method: 'delete',
			propertyKey,
			route: endpoint,
		});
		return descriptor;
	};
};
