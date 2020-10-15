import { IRequest } from 'resting-squirrel';
import Controller, { IStore } from '../controller';

export const put = (endpoint: string) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__endpoints__) {
			t.__endpoints__ = [];
		}
		t.__endpoints__.push({
			callback: (req: IRequest, res: any) => descriptor.value.apply(target, [req, res]),
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
			callback: (req: IRequest, res: any) => descriptor.value.apply(target, [req, res]),
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
			callback: (req: IRequest, res: any) => descriptor.value.apply(target, [req, res]),
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
			callback: (req: IRequest, res: any) => descriptor.value.apply(target, [req, res]),
			method: 'delete',
			propertyKey,
			route: endpoint,
		});
		return descriptor;
	};
};
