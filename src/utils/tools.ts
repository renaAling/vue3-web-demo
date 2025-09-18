interface dicts {
	value: string;
	label: string;
}
export const formatDict = (arr: dicts[], value: string) => {
	return arr.filter((item: any) => {
		return item.value == value;
	})[0]?.label;
};

export const hasValues = (obj:any) => {
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] !== '') {
			return true;
		}
	}
	return false;
};
/**
 * 是否是核销员
 */
export function isWriteOffFun() {
	if (localStorage.getItem('storeStaffList')) {
	  let JavaInfo = JSON.parse(Cookies.get('JavaInfo'));
	  let staff = JSON.parse(localStorage.getItem('storeStaffList'));
	  return staff.some((item) => item.avatar === JavaInfo.account);
	}
  }
  
  export function handleDeleteTable(length, tableFrom) {
	if (length === 1 && tableFrom.page > 1) return (tableFrom.page = tableFrom.page - 1);
  }
