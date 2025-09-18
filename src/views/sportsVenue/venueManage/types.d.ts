// 场地使用情况相关类型
export interface DateShortcut {
  text: string;
  value: Date;
}

export interface SportType {
  name: string;
  code: string;
}

export interface TimeSlot {
  code: string;
  startTime: string;
  endTime: string;
  status: number;
  isAttendance?: boolean;
}

export interface Venue {
  stadiumConfigSubCode: string;
  stadiumConfigSubName: string;
  siteDetails: TimeSlot[];
  selectAllAvailable: boolean;
  isIndeterminateAvailable: boolean;
  selectAllLocked: boolean;
  isIndeterminateLocked: boolean;
  popoverVisible: boolean[];
  popoverData: any[];
  confirmingAttendance: boolean;
}

export interface SelectedTime {
  row: Venue;
  slot: TimeSlot;
}

export interface ApiResponse {
  timeSlots: string[];
  configSubDetails: Venue[];
}

// API 参数类型
export interface StadiumSiteDetailParams {
  stadiumCode: string;
  stadiumConfigCode: string;
  stadiumDate: string;
}

export interface SiteUpdateStatusParams {
  codes: string[];
  status: number;
}