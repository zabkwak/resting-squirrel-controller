import { Response } from 'resting-squirrel';

import Controller from '../../../src';

@Controller.v(0)
export default class CustomResponseController extends Controller {

	@Controller.Endpoint.get('/custom-response')
	@Controller.Endpoint.response(new Response.Custom('text/html'))
	public async get(): Promise<null> {
		return null;
	}
}
