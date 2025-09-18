export enum LinkTypeEnum {
	'SHOP_PAGES' = 'shop',
	'CUSTOM_LINK' = 'custom',
}

export interface Link {
	path: string;
	name?: string;
	type: string;
	query?: Record<string, any>;
}
export declare namespace Form {
	type ItemType = 'password' | 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'date' | 'datetime';
	// 当FiledItem的type === 'radio' | 'checkbox'时，options的参数类型
	interface IFieldOptions {
		labelkey?: string;
		valueKey?: string;
		placeholder?: string;
		data: Recode<string, any>[];
	}
	interface Options {
		labelWidth?: string | number;
		labelPosition?: 'left' | 'right' | 'top';
		disabled?: boolean;
		size?: 'large' | 'small' | 'default';
		showResetButton?: boolean; // 是否展示重置按钮
		showCancelButton?: boolean; // 是否展示取消按钮
		submitButtonText?: string;
		resetButtonText?: string;
		cancelButtonText?: string;
	}
	interface FieldItem {
		label: string;
		field: string;
		type?: ItemType;
		value?: any;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		options?: IFieldOptions;
		rules?: RuleItem[];
		showPassword?: boolean;
		clearable?: boolean;
		enterable?: boolean;
	}
	interface RuleItem {
		type?: RuleType;
		required?: boolean;
		pattern?: RegExp | string;
		min?: number;
		max?: number;
		len?: number;
		enum?: Array<string | number | boolean | null | undefined>;
		whitespace?: boolean;
		fields?: Record<string, Rule>;
		options?: ValidateOption;
		defaultField?: Rule;
		transform?: (value: Value) => Value;
		message?: string | ((a?: string) => string);
		asyncValidator?: (
			rule: InternalRuleItem,
			value: Value,
			callback: (error?: string | Error) => void,
			source: Values,
			options: ValidateOption
		) => void | Promise<void>;
		validator?: (
			rule: InternalRuleItem,
			value: Value,
			callback: (error?: string | Error) => void,
			source: Values,
			options: ValidateOption
		) => SyncValidateResult | void;
		trigger?: 'blur' | 'change';
	}
}
