import { IRequest, IResponse } from 'resting-squirrel';
import Controller from '../../../src';

@Controller.v(0)
export default class HeadController extends Controller {

	@Controller.Endpoint.head('/head')
	public async headTest(req: IRequest, res: IResponse): Promise<null> {
		res.setHeader('x-test', 'test');
		return null;
	}
}
