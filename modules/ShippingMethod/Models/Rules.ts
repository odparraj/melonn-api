export enum DayType {
    ANY = "ANY",
    BUSINESS = "BUSINESS",
    NON_BUSINESS = "NON-BUSINESS",
    WEEKEND = "WEEKEND",
}

export enum PromiseTypeValue {
    NULL = "NULL",
    DELTA_HOURS = "DELTA-HOURS",
    DELTA_BUSINESSDAYS = "DELTA-BUSINESSDAYS"
}
export interface PromiseType {
    type: PromiseTypeValue
    deltaHours?: number
    deltaBusinessDays?: number
    timeOfDay?: number
}
export interface SystemPromise {
    min: PromiseType
    max: PromiseType
}

export interface RequestTimeCondition {
    dayType: DayType,
    fromTimeOfDay: number,
    toTimeOfDay: number
}
export interface PromiseCase {
    priority: number,
    condition: {
        byRequestTime: RequestTimeCondition
    }
    packPromise: SystemPromise,
    shipPromise: SystemPromise,
    deliveryPromise: SystemPromise,
    readyPickUpPromise: SystemPromise,
}
export interface Rules {
    availability: {
        byWeight: {
            min: number,
            max: number,
        }
        byRequestTime: RequestTimeCondition
        byWarehouseCoverage: {
            type: string
        }
    }
    promisesParameters: {
        cases: PromiseCase[]
    }
}
