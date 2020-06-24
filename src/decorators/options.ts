import { ErrorField, Field, IRequest, RouteAuth } from 'resting-squirrel';
import { ArgsDto, BaseDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller, { IStore } from '../controller';

export interface IOptions<IProps = { [key: string]: any }> {
	auth: RouteAuth;
	params: typeof BaseDto | typeof RequestDto;
	response: typeof BaseDto | typeof ResponseDto;
	errors: Array<ErrorField>;
	description: string;
	hideDocs: boolean;
	args: (typeof ArgsDto) | Array<Field>;
	requireApiKey: boolean;
	excludeApiKeys: (() => Promise<Array<string>>) | Array<string>;
	timeout: number;
	props: IProps;
	optionalParams: Array<string>;
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
