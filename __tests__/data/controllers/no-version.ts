import Controller from '../../../src';

export default class NoVersionController extends Controller {

	@Controller.get('/no-version')
	@Controller.emptyResponse
	public async get(): Promise<null> {
		return null;
	}
}
