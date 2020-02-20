
import { Field, IRequest, RouteAuth, Type } from 'resting-squirrel';
import { RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller from '../../../src';

class TestRequestDto extends RequestDto {

	@RequestDto.integer
	@RequestDto.required
	public id: number;
}

// tslint:disable-next-line: max-classes-per-file
class TestResponseDto extends RequestDto {

	@ResponseDto.integer
	public id: number;

	@ResponseDto.string
	public status: string;
}

// tslint:disable-next-line: max-classes-per-file
@Controller.v(0)
export default class TestController extends Controller {

	@Controller.get('/test')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
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
