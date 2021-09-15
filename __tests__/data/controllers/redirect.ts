import { IRequest, IResponse } from 'resting-squirrel';
import Controller from '../../../src';

@Controller.v(0)
export default class RedirectController extends Controller {

	@Controller.Endpoint.get('/redirect')
	@Controller.Endpoint.redirect
	public async redirectTest(): Promise<string> {
		return 'https://google.com';
	}
}
