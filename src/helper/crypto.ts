import * as Bluebird from 'bluebird';
import * as Crypto from 'crypto';

import { Nullable } from './type';

export class CryptoPromise {
	private constructor() {}
	
	public static async scrypt(password: Crypto.BinaryLike, salt: Crypto.BinaryLike, length: number, options: Crypto.ScryptOptions = {}): Promise<Buffer> {
		return new Bluebird((resolve, reject) => {
			Crypto.scrypt(password, salt, length, options, (error: Nullable<Error>, key: Buffer) => {
				if(error) return reject(error);
				return resolve(key);
			});
		});
	}

	public static async randomBytes(size: number): Promise<Buffer> {
		return new Bluebird((resolve, reject) => {
			Crypto.randomBytes(size, (error: Nullable<Error>, buffer: Buffer) => {
				if(error) return reject(error);
				return resolve(buffer);
			});
		});
	}

	public static async pseudoRandomBytes(size: number): Promise<Buffer> {
		return new Bluebird((resolve, reject) => {
			Crypto.pseudoRandomBytes(size, (error: Nullable<Error>, buffer: Buffer) => {
				if(error) return reject(error);
				return resolve(buffer);
			});
		});
	}

	public static async randomInt(min: number, max: number): Promise<number> {
		return new Bluebird((resolve, reject) => {
			Crypto.randomInt(min, max, (error: Nullable<Error>, value: number) => {
				if(error) return reject(error);
				return resolve(value);
			});
		});
	}
}

export class AESHelper {
	private constructor() {}

	public static async generateKey(key: Buffer): Promise<Buffer> {
		return await CryptoPromise.scrypt(key, await CryptoPromise.randomBytes(32), 32);
	}

	public static async encrypt(content: Buffer, key: Buffer): Promise<Buffer> {
		const iv: Buffer = Crypto.randomBytes(16);
		const cipher: Crypto.Cipher = Crypto.createCipheriv('aes-256-ctr', key, iv);
		const encrypted: Buffer = cipher.update(content);

		return Buffer.concat([
			iv,
			encrypted,
			cipher.final()
		]);
	}

	public static async decrypt(encrypted: Buffer, key: Buffer): Promise<Buffer> {
		const iv: Buffer = encrypted.subarray(0, 16);
		const ciphertext: Buffer = encrypted.slice(16);

		const decipher: Crypto.Decipher = Crypto.createDecipheriv('aes-256-ctr', key, iv);
		const decrypted: Buffer = decipher.update(ciphertext);

		return Buffer.concat([
			decrypted,
			decipher.final()
		]);
	}
}
