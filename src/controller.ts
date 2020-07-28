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
import RSDto, { ArgsDto, BaseDto, IRSDto, RequestDto, ResponseDto } from 'resting-squirrel-dto';

import controllerOptions, { IOptions as IControllerOptions } from './decorators/controller-options';
import deprecated from './decorators/deprecated';
import { del, get, post, put } from './decorators/methods';
import optionsDecorator, { IOptions, RSDtoType } from './decorators/options';
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

class E {
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

	/**
	 * Defines options to the endpoint.
	 */
	public static options = optionsDecorator;

	/**
	 * Define specific option to the endpoint.
	 */
	public static option = <K extends keyof IOptions>(
		option: K, value: IOptions[K],
	) => E.options({ [option]: value })

	/**
	 * Sets the `auth` option of the endpoint.
	 */
	public static auth = (auth: RouteAuth) => E.options({ auth });

	/**
	 * Sets the `params` option to the endpoint using DTO classes.
	 */
	public static params = (
		params: RSDtoType | typeof BaseDto | typeof RequestDto,
		optionalParams: Array<string> = [],
		omit: Array<string> = [],
	) => E.options({ params, optionalParams, omitParams: omit })

	/**
	 * Sets the `response` option to the endpoint using DTO classes.
	 */
	public static response = (
		response: RSDtoType | typeof BaseDto | typeof ResponseDto,
		omit: Array<string> = [],
	) => E.options({ response, omitResponse: omit })

	/**
	 * Sets the `params` and `response` options to the endpoint using DTO classes.
	 */
	public static dto = (
		dto: RSDtoType | typeof BaseDto,
		optionalParams: Array<string> = [],
		omitParams: Array<string> = [],
		omitResponse: Array<string> = [],
	) => E.options({ params: dto, response: dto, optionalParams, omitParams, omitResponse })

	/**
	 * Sets the `errors` option to the endpoint.
	 */
	public static errors = (errors: Array<ErrorField>) => E.options({ errors });

	/**
	 * Sets the `description` option to the endpoint.
	 */
	public static description = (description: string) => E.options({ description });

	/**
	 * Sets the `hideDocs` option to `true` to the endpoint.
	 */
	// tslint:disable-next-line: member-ordering
	public static hideDocs = E.option('hideDocs', true);

	/**
	 * Sets the `args` option to the endpoint.
	 */
	public static args = (args: Array<Field> | typeof ArgsDto) => E.options({ args });

	/**
	 * Sets the `requireApiKey` option to the endpoint.
	 */
	public static requireApiKey = (requireApiKey: boolean) => E.options({ requireApiKey });

	/**
	 * Sets the `excludedApiKey` option to the endpoint.
	 */
	public static excludedApiKeys = (excludedApiKeys: (
		() => Promise<Array<string>>) | Array<string>,
	) => E.options({ excludedApiKeys })

	/**
	 * Sets the `timeout` option to the endpoint.
	 */
	public static timeout = (timeout: number) => E.options({ timeout });

	/**
	 * Sets the `props` option to the endpoint.
	 */
	public static props = <IProps = { [key: string]: any }>(props: IProps) => E.options({ props });

	/**
	 * Sets the endpoint as empty. It returns 204 status code.
	 */
	// tslint:disable-next-line: member-ordering
	public static emptyResponse = E.response(null);
}

// tslint:disable-next-line: max-classes-per-file
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

	public static controllerOptions = controllerOptions;

	public static Endpoint = E;

	/**
	 * Marks the endpoint on the method as deprecated.
	 * @deprecated
	 */
	public static deprecated = deprecated;

	// #region Methods

	/**
	 * The endpoint is executed with `PUT` method.
	 * @deprecated
	 */
	public static put = put;

	/**
	 * The endpoint is executed with `GET` method.
	 * @deprecated
	 */
	public static get = get;

	/**
	 * The endpoint is executed with `POST` method.
	 * @deprecated
	 */
	public static post = post;

	/**
	 * The endpoint is executed with `DELETE` method.
	 * @deprecated
	 */
	public static delete = del;

	// #endregion

	// #region Options

	/**
	 * Defines options to the endpoint.
	 * @deprecated
	 */
	public static options = optionsDecorator;

	/**
	 * Define specific option to the endpoint.
	 * @deprecated
	 */
	public static option = <K extends keyof IOptions>(
		option: K, value: IOptions[K],
	) => Controller.options({ [option]: value })

	/**
	 * Sets the `auth` option of the endpoint.
	 * @deprecated
	 */
	public static auth = (auth: RouteAuth) => Controller.options({ auth });

	/**
	 * Sets the `params` option to the endpoint using DTO classes.
	 * @deprecated
	 */
	public static params = (
		params: RSDtoType | typeof BaseDto | typeof RequestDto,
		optionalParams: Array<string> = [],
		omit: Array<string> = [],
	) => Controller.options({ params, optionalParams, omitParams: omit })

	/**
	 * Sets the `response` option to the endpoint using DTO classes.
	 * @deprecated
	 */
	public static response = (
		response: RSDtoType | typeof BaseDto | typeof ResponseDto,
		omit: Array<string> = [],
	) => Controller.options({ response, omitResponse: omit })

	/**
	 * Sets the `params` and `response` options to the endpoint using DTO classes.
	 * @deprecated
	 */
	public static dto = (
		dto: RSDtoType | typeof BaseDto,
		optionalParams: Array<string> = [],
		omitParams: Array<string> = [],
		omitResponse: Array<string> = [],
	) => Controller.options({ params: dto, response: dto, optionalParams, omitParams, omitResponse })

	/**
	 * Sets the `errors` option to the endpoint.
	 * @deprecated
	 */
	public static errors = (errors: Array<ErrorField>) => Controller.options({ errors });

	/**
	 * Sets the `description` option to the endpoint.
	 * @deprecated
	 */
	public static description = (description: string) => Controller.options({ description });

	/**
	 * Sets the `hideDocs` option to `true` to the endpoint.
	 * @deprecated
	 */
	// tslint:disable-next-line: member-ordering
	public static hideDocs = Controller.option('hideDocs', true);

	/**
	 * Sets the `args` option to the endpoint.
	 * @deprecated
	 */
	public static args = (args: Array<Field> | typeof ArgsDto) => Controller.options({ args });

	/**
	 * Sets the `requireApiKey` option to the endpoint.
	 * @deprecated
	 */
	public static requireApiKey = (requireApiKey: boolean) => Controller.options({ requireApiKey });

	/**
	 * Sets the `excludedApiKey` option to the endpoint.
	 * @deprecated
	 */
	public static excludedApiKeys = (excludedApiKeys: (
		() => Promise<Array<string>>) | Array<string>,
	) => Controller.options({ excludedApiKeys })

	/**
	 * Sets the `timeout` option to the endpoint.
	 * @deprecated
	 */
	public static timeout = (timeout: number) => Controller.options({ timeout });

	/**
	 * Sets the `props` option to the endpoint.
	 * @deprecated
	 */
	public static props = <IProps = { [key: string]: any }>(props: IProps) => Controller.options({ props });

	/**
	 * Sets the endpoint as empty. It returns 204 status code.
	 * @deprecated
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
				if (file.indexOf('.js.map') >= 0 || file.indexOf('.d.ts') >= 0) {
					continue;
				}
				console.error(file, e);
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
		const controllerOptions = (this.constructor as any).__options__;
		if (!t.__options__) {
			return {};
		}
		if (!t.__options__[propertyKey]) {
			return {};
		}
		let options = t.__options__[propertyKey];
		options = {
			...controllerOptions,
			...options,
			errors: [
				...(controllerOptions?.errors || []),
				...(options?.errors || []),
			],
			props: {
				...controllerOptions?.props,
				...options?.props,
			},
		};
		const { args, params, response, optionalParams, omitParams, omitResponse, ...restOptions } = options;
		return {
			...restOptions,
			args: args
				? args instanceof Array
					? args
					: args.toArray() as Array<Field>
				: undefined,
			params: this._getParamsArray(params, optionalParams, omitParams),
			response: this._getResponseArray(response, omitResponse),
		};
	}

	protected isDeprecated(propertyKey: string): boolean {
		const t = this as unknown as IStore;
		if (!t.__deprecated__) {
			return false;
		}
		return t.__deprecated__.includes(propertyKey);

	}

	private _getParamsArray(
		params: RSDtoType | typeof BaseDto | typeof RequestDto,
		optional: Array<string> = [],
		omit: Array<string> = [],
	): Array<Param | ParamShape | ParamShapeArray> {
		if (!params) {
			return undefined;
		}
		if (params.prototype instanceof RequestDto) {
			return (params as typeof RequestDto).toArray(optional, omit);
		}
		return RSDto.toParams(params, optional, omit);
	}

	private _getResponseArray(
		response: RSDtoType | typeof BaseDto | typeof ResponseDto,
		omit: Array<string> = [],
	): Array<Field | FieldShape | FieldShapeArray> {
		if (response === null) {
			return null;
		}
		if (!response) {
			return undefined;
		}
		if (response.prototype instanceof ResponseDto) {
			return (response as typeof ResponseDto).toArray();
		}
		return RSDto.toResponse(response, omit);
	}

}
