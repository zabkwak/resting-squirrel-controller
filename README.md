# resting-squirrel-controller
Controller for defining endpoints in [resting-squirrel](https://www.npmjs.com/package/resting-squirrel).  
Definitions of endpoints can be done with extending the `Controller` class and using decorators.

## Installation
```bash
npm install resting-squirrel-controller --save
```

## Usage
### Javascript
TBD
### Typescript
#### DTO
```typescript

import rs, { Field, IRequest, RouteAuth, Type } from 'resting-squirrel'; // peer dependency
import Controller from 'resting-squirrel-controller';
import RSDto, { IRSDto } from 'resting-squirrel-dto'; // peer dependency

class TestRequestDto implements IRSDto {

	@RequestDto.integer
	@RequestDto.required
	public id: number;
}

class TestResponseDto implements IRSDto {

	@ResponseDto.integer
	public id: number;

	@ResponseDto.string
	public status: string;
}

class TestDto implements IRSDto {

	@RSDto.integer
	@RSDto.required
	public id: number;

	@RSDto.string
	@RSDto.response
	public status: string;
}

@Controller.v(0)
class TestController extends Controller {

	@Controller.get('/test')
	@Controller.dto(TestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	public async getTest(req: IRequest<{}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'get', id: req.query.id };
	}

	@Controller.put('/test')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
	public async createTest(req: IRequest<{}, {}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'put', id: req.body.id };
	}

	@Controller.post('/test/:id')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
	@Controller.args([new Field('id', Type.integer)])
	public async updateTest(req: IRequest<{}, {}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'post', id: req.body.id };
	}

	@Controller.delete('/test/:id')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.emptyResponse
	@Controller.args([new Field('id', Type.integer)])
	public async deleteTest(req: IRequest<{}, {}, TestRequestDto>): Promise<null> {
		return null;
	}
}

const app = rs();

new TestController(app).register();

app.start();

```

#### DTO Legacy
```typescript

import rs, { Field, IRequest, RouteAuth, Type } from 'resting-squirrel'; // peer dependency
import Controller from 'resting-squirrel-controller';
import RSDto, { RequestDto, ResponseDto } from 'resting-squirrel-dto'; // peer dependency

class TestRequestDto extends RequestDto {

	@RequestDto.integer
	@RequestDto.required
	public id: number;
}

class TestResponseDto extends RequestDto {

	@ResponseDto.integer
	public id: number;

	@ResponseDto.string
	public status: string;
}

class TestDto extends RSDto {

	@RSDto.integer
	@RSDto.required
	public id: number;

	@RSDto.string
	@RSDto.response
	public status: string;
}

@Controller.v(0)
class TestController extends Controller {

	@Controller.get('/test')
	@Controller.dto(TestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	public async getTest(req: IRequest<{}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'get', id: req.query.id };
	}

	@Controller.put('/test')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
	public async createTest(req: IRequest<{}, {}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'put', id: req.body.id };
	}

	@Controller.post('/test/:id')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
	@Controller.args([new Field('id', Type.integer)])
	public async updateTest(req: IRequest<{}, {}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'post', id: req.body.id };
	}

	@Controller.delete('/test/:id')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.emptyResponse
	@Controller.args([new Field('id', Type.integer)])
	public async deleteTest(req: IRequest<{}, {}, TestRequestDto>): Promise<null> {
		return null;
	}
}

const app = rs();

new TestController(app).register();

app.start();

```

## Classes
### Connector
#### Methods
##### `static registerDirectory(app: Application, directory: string): Promise<void>`
Registers the directory with controllers to the `resting-squirrel` application.
##### `register(): void`
Registers the controller to the `resting-squirrel` application.
#### Decorators
##### Class
Decorators for the `Controller` class.
###### `version(version: number)`
Sets the version of all endpoint in the `Controller`.
###### `v(version: number)`
Alias for `version` decorator.
###### `controllerOptions(options: IRouteOptions)`
Class decorator to set some of route options to all endpoints.
##### Method
Decorators for the `Controller` methods defining endpoint.
###### `put(route: string)`
The endpoint is executed with `PUT` method.
###### `get(route: string)`
The endpoint is executed with `GET` method.
###### `post(route: string)`
The endpoint is executed with `POST` method.
###### `delete(route: string)`
The endpoint is executed with `DELETE` method.
###### `deprecated`
Marks the endpoint as deprecated.
###### `options(options: IRouteOptions)`
Sets the options to the endpoint.
###### `option<K extends keyof IRouteOptions>(option: K, value: IRouteOptions[K])`
Sets specific option to the endpoint.
###### `auth(auth: RouteAuth)`
###### `dto(dto: typeof BaseDto)`
###### `params(params: (new (...args: any[]) => IRSDto) | typeof BaseDto | typeof RequestDto)`
###### `response(response: (new (...args: any[]) => IRSDto) | typeof BaseDto | typeof ResponseDto)`
###### `errors(errors: Array<ErrorField>)`
###### `description(description: string)`
###### `hideDocs`
Sets the `hideDocs` option to `true`.
###### `args(args: Array<Field> | typeof ArgsDto)`
###### `requireApiKey(requireApiKey: boolean)`
###### `excludeApiKeys(excludeApiKeys: (() => Promise<Array<string>>) | Array<string>))`
###### `timeout(timeout: number)`
###### `<IProps = {[key: string]: any}>props(props: IProps)`
###### `emptyResponse`
Sets the endpoint as empty. It returns 204 status code.

## Migration to v2
There are no breaking changes in the v2 except the peer dependency on the `resting-squirrel-dto` module.

## TODO
### v3
- Replace deprecated static endpoint decorators with controller decorators.