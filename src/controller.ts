import { Application, ErrorField, Field, IRequest, IRouteOptions, RouteAuth } from 'resting-squirrel';
import { RequestDto, ResponseDto } from 'resting-squirrel-dto';

import deprecated from './decorators/deprecated';
import { del, get, post, put } from './decorators/methods';
import optionsDecorator, { IOptions } from './decorators/options';
import versionDecorator from './decorators/version';

export interface IStore {
	__endpoints__: Array<IEndpoint>;
	__options__: { [propertyKey: string]: IOptions };
	__deprecated__: Array<string>;
}

export interface IEndpoint {
	method: 'get' | 'put' | 'post' | 'delete';
	route: string;
	callback: (req: IRequest) => void | Promise<any>;
	propertyKey: string;
}

export default class Controller {

	// #region Decorators

	public static version = versionDecorator;

	public static v = Controller.version;

	public static deprecated = deprecated;

	// #region Methods

	public static put = put;

	public static get = get;

	public static post = post;

	public static delete = del;

	// #endregion

	// #region Options

	public static options = optionsDecorator;

	public static option = <K extends keyof IOptions>(
		option: K, value: IOptions[K],
	) => Controller.options({ [option]: value })

	public static auth = (auth: RouteAuth) => Controller.options({ auth });

	public static params = (params: typeof RequestDto) => Controller.options({ params });

	public static response = (response: typeof ResponseDto) => Controller.options({ response });

	public static errors = (errors: Array<ErrorField>) => Controller.options({ errors });

	public static description = (description: string) => Controller.options({ description });

	// tslint:disable-next-line: member-ordering
	public static hideDocs = Controller.option('hideDocs', true);

	public static args = (args: Array<Field> | typeof ResponseDto) => Controller.options({ args });

	public static requireApiKey = (requireApiKey: boolean) => Controller.options({ requireApiKey });

	public static excludeApiKeys = (excludeApiKeys: (
		() => Promise<Array<string>>) | Array<string>,
	) => Controller.options({ excludeApiKeys })

	public static timeout = (timeout: number) => Controller.options({ timeout });

	public static props = <IProps = { [key: string]: any }>(props: IProps) => Controller.options({ props });

	// tslint:disable-next-line: member-ordering
	public static emptyResponse = Controller.response(null);

	// #endregion

	// #endregion

	private _app: Application;

	constructor(app: Application) {
		this._app = app;
	}

	public register(): void {
		const version = this.getVersion();
		for (const endpoint of this.getEndpoints()) {
			// TODO option without version
			const e = this._app.registerRoute(
				endpoint.method,
				version,
				endpoint.route,
				this.getOptions(endpoint.propertyKey),
				endpoint.callback,
			);
			if (this.isDeprecated(endpoint.propertyKey)) {
				e.deprecate();
			}
		}
	}

	protected getEndpoints(): Array<IEndpoint> {
		return (this as unknown as IStore).__endpoints__ || [];
	}

	protected getVersion(): number {
		return (this.constructor as any).version;
	}

	protected getOptions(propertyKey: string): IRouteOptions {
		const t = this as unknown as IStore;
		if (!t.__options__) {
			return {};
		}
		if (!t.__options__[propertyKey]) {
			return {};
		}
		const options = t.__options__[propertyKey];
		const { args, params, response } = options;
		return {
			...options,
			args: args
				? args instanceof Array
					? args
					: args.toArray() as Array<Field>
				: undefined,
			params: params ? params.toArray() : undefined,
			response: response ? response.toArray() : undefined,
		};
	}

	protected isDeprecated(propertyKey: string): boolean {
		const t = this as unknown as IStore;
		if (!t.__deprecated__) {
			return false;
		}
		return t.__deprecated__.includes(propertyKey);

	}

}
