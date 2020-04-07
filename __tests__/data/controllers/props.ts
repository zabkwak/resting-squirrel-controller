import { IRequest } from 'resting-squirrel';
import { ResponseDto } from 'resting-squirrel-dto';

import Controller from '../../../src';

class PropsDto extends ResponseDto {

	@ResponseDto.string
	public prop01: string;

	@ResponseDto.string
	public prop02: string;
}

// tslint:disable-next-line: max-classes-per-file
@Controller.v(0)
export default class NoVersionController extends Controller {

	@Controller.get('/props')
	@Controller.option('props', { prop01: 'prop_01' })
	@Controller.option('props', { prop02: 'prop_02' })
	public async get(req: IRequest): Promise<Partial<PropsDto>> {
		const { props } = req.getEndpoint();
		return props;
	}
}
