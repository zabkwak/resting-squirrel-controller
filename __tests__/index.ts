import { expect } from 'chai';
import rs, { Error, Field, IRequest, RouteAuth, Type } from 'resting-squirrel';
import RSConnector from 'resting-squirrel-connector';
import { RequestDto, ResponseDto } from 'resting-squirrel-dto';

import Controller from '../src';
import { get } from '../src/decorators/methods';
import options from '../src/decorators/options';
import version from '../src/decorators/version';

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
class TestController extends Controller {

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

const app = rs({ log: false, responseStrictValidation: true });

new TestController(app).register();

const api = RSConnector({ url: 'http://localhost:8080' });

describe('Server process', () => {

	it('starts the server', (done) => app.start(done));

	it('calls the get endpoint', async () => {
		const { data, statusCode } = await api.v(0).get('/test', { id: 1 }, { 'x-token': 'TOKEN' });
		expect(statusCode).to.be.equal(200);
		expect(data).to.have.all.keys(['status', 'id']);
		expect(data.status).to.be.equal('get');
		expect(data.id).to.be.equal(1);
	});

	it('calls the get endpoint without access token', async () => {
		try {
			await api.v(0).get('/test', { id: 1 });
			throw new Error('The promise should reject', 'required_rejection');
		} catch (error) {
			if (error.code === 'ERR_REQUIRED_REJECTION') {
				throw error;
			}
			expect(error).to.be.an('object');
			expect(error).to.have.all.keys(['message', 'code']);
			expect(error.message).to.be.equal('The access token is missing.');
			expect(error.code).to.be.equal('ERR_MISSING_ACCESS_TOKEN');
			expect(error.statusCode).to.be.equal(401);
			expect(error.meta).to.be.an('object');
		}
	});

	it('calls the put endpoint', async () => {
		const { data, statusCode } = await api.v(0).put('/test', { id: 1 }, { 'x-token': 'TOKEN' });
		expect(statusCode).to.be.equal(200);
		expect(data).to.have.all.keys(['status', 'id']);
		expect(data.status).to.be.equal('put');
		expect(data.id).to.be.equal(1);
	});

	it('calls the put endpoint without access token', async () => {
		try {
			await api.v(0).put('/test', { id: 1 });
			throw new Error('The promise should reject', 'required_rejection');
		} catch (error) {
			if (error.code === 'ERR_REQUIRED_REJECTION') {
				throw error;
			}
			expect(error).to.be.an('object');
			expect(error).to.have.all.keys(['message', 'code']);
			expect(error.message).to.be.equal('The access token is missing.');
			expect(error.code).to.be.equal('ERR_MISSING_ACCESS_TOKEN');
			expect(error.statusCode).to.be.equal(401);
			expect(error.meta).to.be.an('object');
		}
	});

	it('calls the post endpoint', async () => {
		const { data, statusCode } = await api.v(0).post('/test/1', { id: 1 }, { 'x-token': 'TOKEN' });
		expect(statusCode).to.be.equal(200);
		expect(data).to.have.all.keys(['status', 'id']);
		expect(data.status).to.be.equal('post');
		expect(data.id).to.be.equal(1);
	});

	it('calls the post endpoint without access token', async () => {
		try {
			await api.v(0).post('/test/1', { id: 1 });
			throw new Error('The promise should reject', 'required_rejection');
		} catch (error) {
			if (error.code === 'ERR_REQUIRED_REJECTION') {
				throw error;
			}
			expect(error).to.be.an('object');
			expect(error).to.have.all.keys(['message', 'code']);
			expect(error.message).to.be.equal('The access token is missing.');
			expect(error.code).to.be.equal('ERR_MISSING_ACCESS_TOKEN');
			expect(error.statusCode).to.be.equal(401);
			expect(error.meta).to.be.an('object');
		}
	});

	it('calls the delete endpoint', async () => {
		const r = await api.v(0).delete('/test/1', { id: 1 }, { 'x-token': 'TOKEN' });
		expect(r.statusCode).to.be.equal(204);
		// tslint:disable-next-line: no-unused-expression
		expect(r.isEmpty()).to.be.true;
	});

	it('calls the delete endpoint without access token', async () => {
		try {
			await api.v(0).delete('/test/1', { id: 1 });
			throw new Error('The promise should reject', 'required_rejection');
		} catch (error) {
			if (error.code === 'ERR_REQUIRED_REJECTION') {
				throw error;
			}
			expect(error).to.be.an('object');
			expect(error).to.have.all.keys(['message', 'code']);
			expect(error.message).to.be.equal('The access token is missing.');
			expect(error.code).to.be.equal('ERR_MISSING_ACCESS_TOKEN');
			expect(error.statusCode).to.be.equal(401);
			expect(error.meta).to.be.an('object');
		}
	});

	it('stops the server', (done) => app.stop(done));
});
