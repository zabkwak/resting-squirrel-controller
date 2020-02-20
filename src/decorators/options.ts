import { ErrorField, Field, IRequest, RouteAuth } from 'resting-squirrel';
import { ArgsDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller, { IStore } from '../controller';

export interface IOptions<IProps = { [key: string]: any }> {
	auth: RouteAuth;
	params: typeof RequestDto;
	response: typeof ResponseDto;
	errors: Array<ErrorField>;
	description: string;
	hideDocs: boolean;
	args: (typeof ArgsDto) | Array<Field>;
	requireApiKey: boolean;
	excludeApiKeys: (() => Promise<Array<string>>) | Array<string>;
	timeout: number;
	props: IProps;
}

export default (options: Partial<IOptions>) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__options__) {
			t.__options__ = {};
		}
		t.__options__[propertyKey] = {
			...t.__options__[propertyKey],
			...options,
		};
		return descriptor;
	};
};
