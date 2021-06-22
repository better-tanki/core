export class BufferHelper {
	private constructor() {}
	
	public static getOctets(buffer: Buffer): number[] {
		let octets: number[] = [];
		for(const octet of buffer) octets.push(octet);
		return octets;
	}
}
