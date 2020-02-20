import * as nfs from 'fs';

export const fs = {
	...nfs,
	readdir(path: nfs.PathLike): Promise<Array<string>> {
		return new Promise((resolve, reject) => {
			nfs.readdir(path, (err, files) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(files);
			});
		});
	},
	stat(path: nfs.PathLike): Promise<nfs.Stats> {
		return new Promise((resolve, reject) => {
			nfs.stat(path, (err, stats) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(stats);
			});
		});
	},
};

export const requireModule = <T>(path: string): T => {
	const requiredModule: any = require(path);
	return requiredModule.default || requiredModule;
};
