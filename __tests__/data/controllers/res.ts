import { Response } from 'resting-squirrel';

import Controller from '../../../src';

@Controller.v(0)
export default class ResController extends Controller {

	@Controller.Endpoint.get('/redirect')
	public async get(req: any, res: any): Promise<null> {
		res.redirect('https://google.com');
		return null;
	}
}
