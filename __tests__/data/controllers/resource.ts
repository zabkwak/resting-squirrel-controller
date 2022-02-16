import { IRequest, IResponse } from 'resting-squirrel';
import Controller from '../../../src';

@Controller.v(0)
@Controller.resource('/resource')
export default class ResourceController extends Controller {

	@Controller.Endpoint.get('/:id')
	public async get(): Promise<null> {
		return null;
	}

	@Controller.Endpoint.post('')
	public async post(): Promise<null> {
		return null;
	}
}
