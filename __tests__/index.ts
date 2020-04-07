import { expect } from 'chai';
import * as path from 'path';
import rs, { Error } from 'resting-squirrel';
import RSConnector from 'resting-squirrel-connector';

import Controller from '../src';

RSConnector.cacheTTL = 0;

const app = rs({ log: false, responseStrictValidation: true });

const api = RSConnector({ url: 'http://localhost:8080' });

describe('Server process', () => {

	it('registers the controllers', async () => {
		await Controller.registerDirectory(app, path.resolve(__dirname, './data/controllers'));
	});

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

	it('calls the endpoint without version', async () => {
		const r = await api.get('/no-version');
		expect(r.statusCode).to.be.equal(204);
		// tslint:disable-next-line: no-unused-expression
		expect(r.isEmpty()).to.be.true;
	});

	it('calls the endpoint with multiple defined props', async () => {
		const r = await api.v(0).get('/props');
		expect(r.statusCode).to.be.equal(200);
		expect(r.data).to.be.deep.equal({
			prop01: 'prop_01',
			prop02: 'prop_02',
		});

	});

	it('stops the server', (done) => app.stop(done));
});
