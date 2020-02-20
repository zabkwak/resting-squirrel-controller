import { ErrorField, Field, IRequest, RouteAuth } from 'resting-squirrel';
import { ArgsDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller, { IStore } from '../controller';

export default (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__deprecated__) {
			t.__deprecated__ = [];
		}
		t.__deprecated__.push(propertyKey);
		return descriptor;
};
