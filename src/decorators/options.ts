import { ErrorField, Field, Response, RouteAuth } from 'resting-squirrel';
import { ArgsDto, BaseDto, IRSDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller, { IStore } from '../controller';

export type RSDtoType = new (...args: Array<any>) => IRSDto;

export interface IOptions<IProps = { [key: string]: any }> {
	auth: RouteAuth;
	params: RSDtoType | typeof BaseDto | typeof RequestDto;
	response: RSDtoType | typeof BaseDto | typeof ResponseDto | Response.Base;
	errors: Array<ErrorField>;
	description: string;
	hideDocs: boolean;
	args: (typeof ArgsDto) | Array<Field>;
	requireApiKey: boolean;
	excludedApiKeys: (() => Promise<Array<string>>) | Array<string>;
	timeout: number;
	props: IProps;
	optionalParams: Array<string>;
	omitParams: Array<string>;
	omitResponse: Array<string>;
	redirect: boolean;
}

export default (options: Partial<IOptions>) => {
	return (target: Controller, propertyKey: string, descriptor: PropertyDescriptor) => {
		const t: IStore = target as any;
		if (!t.__options__) {
			t.__options__ = {};
		}
		let props = t.__options__[propertyKey]?.props;
		if (options.props) {
			props = {
				...props,
				...options.props,
			};
		}
		t.__options__[propertyKey] = {
			...t.__options__[propertyKey],
			...options,
			props,
		};
		return descriptor;
	};
};
