import { ErrorField, Field, IRequest, IRouteOptions, RouteAuth, RSError } from 'resting-squirrel';
import { ArgsDto, BaseDto, IRSDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller, { IStore } from '../controller';

export type RSDtoType = new (...args: Array<any>) => IRSDto;

export interface IOptions<IProps = { [key: string]: any }> {
	auth: RouteAuth;
	errors: IRouteOptions['errors'],
	hideDocs: boolean;
	requireApiKey: boolean;
	excludedApiKeys: (() => Promise<Array<string>>) | Array<string>;
	timeout: number;
	props: IProps;
}

export default (options: Partial<IOptions>) => {
	return (target: typeof Controller) => {
		const t = target as any;
		if (!t.__options__) {
			t.__options__ = {};
		}
		let props = t.__options__.props;
		if (options.props) {
			props = {
				...props,
				...options.props,
			};
		}
		t.__options__ = {
			...t.__options__,
			...options,
			props,
		};
	};
};
