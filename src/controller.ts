import * as path from 'path';
import {
	Application,
	Endpoint,
	ErrorField,
	Field,
	FieldShape,
	FieldShapeArray,
	IRequest,
	IRouteOptions,
	Param,
	ParamShape,
	ParamShapeArray,
	RouteAuth,
} from 'resting-squirrel';
import BaseDto, { ArgsDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import deprecated from './decorators/deprecated';
import { del, get, post, put } from './decorators/methods';
import optionsDecorator, { IOptions } from './decorators/options';
import versionDecorator from './decorators/version';

import { fs, requireModule } from './utils';

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

	/**
	 * Sets the version to the `Controller` class. All endpoints will have this version.
	 */
	public static version = versionDecorator;

	/**
	 * @alias version
	 */
	public static v = Controller.version;

	/**
	 * Marks the endpoint on the method as deprecated.
	 */
	public static deprecated = deprecated;

	// #region Methods

	/**
	 * The endpoint is executed with `PUT` method.
	 */
	public static put = put;

	/**
	 * The endpoint is executed with `GET` method.
	 */
	public static get = get;

	/**
	 * The endpoint is executed with `POST` method.
	 */
	public static post = post;

	/**
	 * The endpoint is executed with `DELETE` method.
	 */
	public static delete = del;

	// #endregion

	// #region Options

	/**
	 * Defines options to the endpoint.
	 */
	public static options = optionsDecorator;

	/**
	 * Define specific option to the endpoint.
	 */
	public static option = <K extends keyof IOptions>(
		option: K, value: IOptions[K],
	) => Controller.options({ [option]: value })

	/**
	 * Sets the `auth` option of the endpoint.
	 */
	public static auth = (auth: RouteAuth) => Controller.options({ auth });

	/**
	 * Sets the `params` option to the endpoint using DTO classes.
	 */
	public static params = (params: typeof BaseDto | typeof RequestDto) => Controller.options({ params });

	/**
	 * Set the `response` option to the endpoint using DTO classes.
	 */
	public static response = (response: typeof BaseDto | typeof ResponseDto) => Controller.options({ response });

	public static dto = (dto: typeof BaseDto) => Controller.options({ params: dto, response: dto });

	/**
	 * Sets the `errors` option to the endpoint.
	 */
	public static errors = (errors: Array<ErrorField>) => Controller.options({ errors });

	/**
	 * Sets the `description` option to the endpoint.
	 */
	public static description = (description: string) => Controller.options({ description });

	/**
	 * Sets the `hideDocs` option to `true` to the endpoint.
	 */
	// tslint:disable-next-line: member-ordering
	public static hideDocs = Controller.option('hideDocs', true);

	/**
	 * Sets the `args` option to the endpoint.
	 */
	public static args = (args: Array<Field> | typeof ArgsDto) => Controller.options({ args });

	/**
	 * Sets the `requireApiKey` option to the endpoint.
	 */
	public static requireApiKey = (requireApiKey: boolean) => Controller.options({ requireApiKey });

	/**
	 * Sets the `excludeApiKey` option to the endpoint.
	 */
	public static excludeApiKeys = (excludeApiKeys: (
		() => Promise<Array<string>>) | Array<string>,
	) => Controller.options({ excludeApiKeys })

	/**
	 * Sets the `timeout` option to the endpoint.
	 */
	public static timeout = (timeout: number) => Controller.options({ timeout });

	/**
	 * Sets the `props` option to the endpoint.
	 */
	public static props = <IProps = { [key: string]: any }>(props: IProps) => Controller.options({ props });

	/**
	 * Sets the endpoint as empty. It returns 204 status code.
	 */
	// tslint:disable-next-line: member-ordering
	public static emptyResponse = Controller.response(null);

	// #endregion

	// #endregion

	/**
	 * Registers all found controllers in the directory to the application.
	 *
	 * @param app The instance of the application.
	 * @param directory Path to the directory where the controllers are located.
	 */
	public static async registerDirectory(app: Application, directory: string): Promise<void> {
		const files = await fs.readdir(directory);
		for (const file of files) {
			const filename = path.resolve(directory, file);
			if ((await fs.stat(filename)).isDirectory()) {
				await this.registerDirectory(app, filename);
				continue;
			}
			try {
				const M = requireModule<typeof Controller>(filename);
				if (M && M.prototype && M.prototype instanceof this) {
					M.register(app);
				}
			} catch (e) {
				// Skip if module cannot be required
			}
		}
	}

	public static register(app: Application): void {
		new this(app).register();
	}

	private _app: Application;

	constructor(app: Application) {
		this._app = app;
	}

	public register(): void {
		const version = this.getVersion();
		for (const endpoint of this.getEndpoints()) {
			let e: Endpoint;
			if (version !== undefined) {
				e = this._app.registerRoute(
					endpoint.method,
					version,
					endpoint.route,
					this.getOptions(endpoint.propertyKey),
					endpoint.callback,
				);
			} else {
				e = this._app.registerRoute(
					endpoint.method,
					endpoint.route,
					this.getOptions(endpoint.propertyKey),
					endpoint.callback,
				);
			}
			if (this.isDeprecated(endpoint.propertyKey)) {
				e.deprecate();
			}
		}
	}

	protected getEndpoints(): Array<IEndpoint> {
		return (this as unknown as IStore).__endpoints__ || [];
	}

	protected getVersion(): number {
		return (this.constructor as any).__version__;
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
			params: this._getParamsArray(params),
			response: this._getResponseArray(params),
		};
	}

	protected isDeprecated(propertyKey: string): boolean {
		const t = this as unknown as IStore;
		if (!t.__deprecated__) {
			return false;
		}
		return t.__deprecated__.includes(propertyKey);

	}

	private _getParamsArray(params: typeof BaseDto | typeof RequestDto): Array<Param | ParamShape | ParamShapeArray> {
		if (!params) {
			return undefined;
		}
		if (params.prototype instanceof RequestDto) {
			return (params as typeof RequestDto).toArray();
		}
		return (params as typeof BaseDto).toParams();
	}

	private _getResponseArray(params: typeof BaseDto | typeof ResponseDto): Array<Field | FieldShape | FieldShapeArray> {
		if (!params) {
			return undefined;
		}
		if (params.prototype instanceof ResponseDto) {
			return (params as typeof ResponseDto).toArray();
		}
		return (params as typeof BaseDto).toResponse();
	}

}
