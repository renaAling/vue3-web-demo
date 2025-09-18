// 结账数据接口
export interface Checkout {
	merchantCode: strin;
	paymentType: Number;
	paymentDiscount?:
		| {
				toString: (radix?: number) => string;
		  }
		| undefined
		| null;
	settlementType: Number;
	settlementDiscount?:
		| {
				toString: (radix?: number) => string;
		  }
		| undefined
		| null;
	ruleType: Number;
	availableTimes?:
		| {
				toString: (radix?: number) => string;
		  }
		| undefined
		| null;
	availableAmount?:
		| {
				toString: (radix?: number) => string;
		  }
		| undefined
		| null;
	[key: string]: any;
}
