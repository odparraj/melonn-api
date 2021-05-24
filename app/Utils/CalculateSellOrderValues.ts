import { getOffDays, getShippingMethod } from "App/Api/Melonn";
import SellOrder from "Modules/SellOrder/Models/SellOrder";
import { DayType, PromiseCase, PromiseType, PromiseTypeValue, RequestTimeCondition, Rules, SystemPromise } from "Modules/ShippingMethod/Models/Rules";
import moment from 'moment';

export const defaultNextDaysNumberToCalculate = 10

export const defaultValues = {
  packPromiseMin: null,
  packPromiseMax: null,
  shipPromiseMin: null,
  shipPromiseMax: null,
  deliveryPromiseMin: null,
  deliveryPromiseMax: null,
  readyPickupPromiseMin: null,
  readyPickupPromiseMax: null,
}

export const promiseToResolve = [
  'packPromise',
  'shipPromise',
  'deliveryPromise',
  'readyPickUpPromise',
]

export const isBusinessDay = (offDays: string[], date: moment.Moment): boolean => {
  const dateFormatted = date.format('YYYY-MM-DD')
  return !offDays.includes(dateFormatted)
}

export const calculateNextBusinessDays = (offDays: string[], n: number = 10, date: moment.Moment): moment.Moment[] => {
  const days: moment.Moment[] = [];
  let i = 1;
  while (days.length < n) {
    const nextDay = moment(date)
      .add(i, 'days')
      .startOf('day');

    if (isBusinessDay(offDays, nextDay)) {
      days.push(nextDay);
    }
    i++;
  }
  return days
}

export const weightAvailability = (sellOrder: SellOrder, rules: Rules) => {
  const minWeight = rules.availability.byWeight.min
  const maxWeight = rules.availability.byWeight.max
  const orderWeight = sellOrder.totalWeight
  const validateWeight = minWeight <= orderWeight && orderWeight <= maxWeight

  const data = (!validateWeight) ? defaultValues : null
  return {
    success: validateWeight,
    data
  }
}
export const requestTimeAvailability = (requestTimeCondition: RequestTimeCondition, currentDateTime: moment.Moment, isBusinessDay: boolean) => {
  const dayType = requestTimeCondition.dayType
  const fromTimeOfDay = requestTimeCondition.fromTimeOfDay
  const toTimeOfDay = requestTimeCondition.toTimeOfDay

  const invalidBusinessDayType = (dayType == DayType.BUSINESS && !isBusinessDay)
  if (invalidBusinessDayType) {
    return {
      success: false,
      data: defaultValues
    }
  }
  const currentTimeHour = currentDateTime.hour();
  const validTimeOfDay = fromTimeOfDay <= currentTimeHour && currentTimeHour <= toTimeOfDay
  const data = (!validTimeOfDay) ? defaultValues : null
  return {
    success: validTimeOfDay,
    data
  }
}

export const caseByPriority = (cases: PromiseCase[], priority: number) => {
  return cases.find((current: PromiseCase) => current.priority == priority)
}

export const resolvePromiseType = (promiseType: PromiseType, key: string, currentDateTime: moment.Moment, nextBusinessDays: moment.Moment[]) => {
  const { type, deltaHours, deltaBusinessDays, timeOfDay } = promiseType
  if (type == PromiseTypeValue.DELTA_HOURS) {
    const promiseTypeValue = moment(currentDateTime).add(deltaHours, 'hours')
    return {
      [key]: promiseTypeValue
    }
  } else if (type == PromiseTypeValue.DELTA_BUSINESSDAYS) {
    const indexDay = (deltaBusinessDays as number) - 1
    const nextBusinessDay = nextBusinessDays[indexDay]
    const promiseTypeValue = moment(nextBusinessDay).set({ hour: timeOfDay })
    return {
      [key]: promiseTypeValue
    }
  }

  return {
    [key]: null
  }
}
export const resolvePromiseValues = (promiseCase: PromiseCase, promiseKey: string, currentDateTime: moment.Moment, nextBusinessDays: moment.Moment[]) => {

  const minKey = `${promiseKey}Min`
  const maxKey = `${promiseKey}Max`

  const promiseResolve = promiseCase[promiseKey] as SystemPromise
  const min = resolvePromiseType(promiseResolve.min, minKey, currentDateTime, nextBusinessDays)
  const max = resolvePromiseType(promiseResolve.max, maxKey, currentDateTime, nextBusinessDays)

  return { ...min, ...max }
}
export const resolveAllPromiseValues = (promiseCase: PromiseCase, currentDateTime: moment.Moment, nextBusinessDays: moment.Moment[]) => {
  let response = {}
  promiseToResolve.forEach((promiseKey: string) => {
    const resolvedPromise = resolvePromiseValues(promiseCase, promiseKey, currentDateTime, nextBusinessDays)
    response = { ...response, ...resolvedPromise }
  });

  return response
}

export const calculatePromises = (rules: Rules, currentDateTime: moment.Moment, isBusinessDay: boolean, nextBusinessDays: moment.Moment[]) => {
  const cases = rules.promisesParameters.cases || []
  let priority = 1
  let canContinue = true
  while (canContinue) {
    const currentByPriority = caseByPriority(cases, priority)
    if (currentByPriority) {
      const requestTimeCondition = currentByPriority.condition.byRequestTime
      const requestTimeAvailabilityResult = requestTimeAvailability(requestTimeCondition, currentDateTime, isBusinessDay)
      if (!requestTimeAvailabilityResult.success) {
        priority++
      } else {
        const promisesResolved = resolveAllPromiseValues(currentByPriority, currentDateTime, nextBusinessDays)
        return promisesResolved
      }
    }
  }

  return defaultValues
}

export const getPrimisesData = async (sellOrder: SellOrder, currentDateTime: moment.Moment) => {
  const shippingMethod = (await getShippingMethod(sellOrder.shippingMethod)).data

  const weightAvailabilityResult = weightAvailability(sellOrder, shippingMethod.rules)
  if (!weightAvailabilityResult.success) {
    return weightAvailabilityResult.data
  }

  const offDays = (await getOffDays()).data
  const businessDayFlag = isBusinessDay(offDays, currentDateTime)

  const requestTimeCondition = shippingMethod.rules.availability.byRequestTime
  const requestTimeAvailabilityResult = requestTimeAvailability(requestTimeCondition, currentDateTime, businessDayFlag)
  if (!requestTimeAvailabilityResult.success) {
    return requestTimeAvailabilityResult.data
  }
  const nextBusinessDays = calculateNextBusinessDays(offDays, defaultNextDaysNumberToCalculate, currentDateTime)

  return calculatePromises(shippingMethod.rules, currentDateTime, businessDayFlag, nextBusinessDays)
}

export const caclculateOrderNumber = (creationDate: moment.Moment): string => {
  const datimeEpoch = creationDate.unix()
  const ramdom = Math.floor(Math.random() * 101)
  return `MSE${datimeEpoch}${ramdom}`
}
export const getInternalOrderNumber = (sellOrder: SellOrder, creationDate: moment.Moment): string => {
  const internalOrderNumber = sellOrder.internalOrderNumber ?
    sellOrder.internalOrderNumber :
    caclculateOrderNumber(creationDate)

  return internalOrderNumber
}

export const calculateSellOrderValues = async (sellOrder: SellOrder) => {
  const creationDate = moment()
  const internalOrderNumber = getInternalOrderNumber(sellOrder, creationDate)
  const promisesData = await getPrimisesData(sellOrder, creationDate)

  return {
    ...promisesData,
    creationDate,
    internalOrderNumber
  }
}