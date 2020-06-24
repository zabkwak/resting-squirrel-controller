
import { Field, IRequest, RouteAuth, Type } from 'resting-squirrel';
import RSDto, { IRSDto } from 'resting-squirrel-dto';

import Controller from '../../../src';

class TestRequestDto implements IRSDto {

	@RSDto.integer
	@RSDto.required
	public id: number;
}

// tslint:disable-next-line: max-classes-per-file
class TestResponseDto implements IRSDto {

	@RSDto.integer
	public id: number;

	@RSDto.string
	public status: string;
}

// tslint:disable-next-line: max-classes-per-file
class TestDto implements IRSDto {

	@RSDto.integer
	@RSDto.required
	public id: number;

	@RSDto.string
	@RSDto.response
	public status: string;
}

// tslint:disable-next-line: max-classes-per-file
@Controller.v(2)
export default class TestController extends Controller {

	@Controller.get('/dto')
	@Controller.dto(TestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	public async getTest(req: IRequest<{}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'get', id: req.query.id };
	}

	@Controller.put('/dto')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
	public async createTest(req: IRequest<{}, {}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'put', id: req.body.id };
	}

	@Controller.post('/dto/:id')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.response(TestResponseDto)
	@Controller.args([new Field('id', Type.integer)])
	public async updateTest(req: IRequest<{}, {}, TestRequestDto>): Promise<Partial<TestResponseDto>> {
		return { status: 'post', id: req.body.id };
	}

	@Controller.delete('/dto/:id')
	@Controller.params(TestRequestDto)
	@Controller.auth(RouteAuth.REQUIRED)
	@Controller.emptyResponse
	@Controller.args([new Field('id', Type.integer)])
	public async deleteTest(req: IRequest<{}, {}, TestRequestDto>): Promise<null> {
		return null;
	}
}
