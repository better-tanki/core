export class MathUtils {
	private constructor() { }

	public static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
		return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
	}
}
