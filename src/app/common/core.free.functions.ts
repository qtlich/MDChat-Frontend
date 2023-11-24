import {Router} from "@angular/router";
import {Observable, Observer} from "rxjs";
import {SimpleChanges} from "@angular/core";
import {SortEvent} from "primeng-lts";
import {OperationResult} from "./operation.result.model";
//*************************************************************************************************
export function round(value: number, decimals: number)
{
    return toNumber(Math.round(+(value + "e" + decimals)) + "e-" + decimals);
}
//*************************************************************************************************
export function booleanToNumber(value: boolean): number
{
    return value === true ? 1 : value === false ? 0 : -1;
}
//*************************************************************************************************
export function isEmptyArray(array: any): boolean
{
    return !(!isNullOrUndefined(array) && !isNullOrUndefined(array.length) && array.length > 0);
}

//*************************************************************************************************
export function operationResultToString(items: OperationResult[]): string
{
    return items.map(item => item.message).join(", ");
}
//*************************************************************************************************
export function NSD(a: number, b: number): number
{
    while (a * b != 0)
    {
        a >= b ? a = a % b : b = b % a;
    }
    return a + b;
}
//*************************************************************************************************
export function NSK(a: number, b: number): number
{
    return a % b == 0 ? b : NSK(b, a % b);
}
export function isNumber(value): boolean
{
    return typeof value === "number" && isFinite(value);
}
//*************************************************************************************************
export function isNullOrUndefined(value: any): boolean
{
    return value === null || value === undefined;
}
//*************************************************************************************************
export function toNumber(value: any): number
{
    return !isNullOrUndefined(value) && !isNaN(value) ? parseFloat(value) : 0;
}
//*************************************************************************************************
export function isEmptyStringField(value: string, minLen: number = null): boolean
{
    return isNullOrUndefined(value) || isNullOrUndefined(value.length) || (minLen == null ? value.length == 0 : value.length < minLen);
}
//*************************************************************************************************
export function getRouterUrlWithoutForwardSlash(router: Router): string
{
    return !isEmptyStringField(router.url) ? router.url.substring(1, router.url.length) : null;
}
//*************************************************************************************************
export function isEmptyNumberField(value: number): boolean
{
    return isNullOrUndefined(value) || isEmptyStringField(value.toString()) || isNaN(value);
}
//*************************************************************************************************
export function isNull(value: any): boolean
{
    return value === null;
}
//*************************************************************************************************
export function isUndefined(value: any): boolean
{
    return value === undefined;
}
//*********************************************************************************************
export function isAllOperationsSuccess(items: OperationResult[]): boolean
{
    return !isEmptyArray(items) && items.every(item => item.id >= 0);
}
//*********************************************************************************************
export function getErrorsOperations(items: OperationResult[]): OperationResult[]
{
    return !isEmptyArray(items) ? items.filter(item => item.id < 0) : [];
}
//*********************************************************************************************
export function getSuccessOperations(items: OperationResult[]): OperationResult[]
{
    return !isEmptyArray(items) ? items.filter(item => item.id >= 0) : [];
}
//*************************************************************************************************
export function invalidateGetCache(): string
{
    return "?t=" + new Date().getTime();
}
//*********************************************************************************************
export function cloneItemValues<TSource>(source: TSource, newItem: TSource): TSource
{
    for (let prop in source)
    {
        newItem[prop] = source[prop];
    }
    return newItem;
}
//*************************************************************************************************
/**
 * Deep object clone
 */
export function deepClone<TSource>(source: TSource)
{
    return JSON.parse(JSON.stringify(source));
}
//*************************************************************************************************
/**
 * Set all object properties to value
 */
export function setAllObjectProperties<T>(obj: T, value: any): any
{
    Object.keys(obj).forEach(key => (typeof obj[key] !== "object" || isNull(obj[key])) ? obj[key] = value : setAllObjectProperties(obj[key], value));
}
//*************************************************************************************************
/**
 * Deep clone object
 */
export function deepCloneModel<T>(value: T): T
{
    if(typeof value !== "object" || value === null)
    {
        return value
    }
    if(Array.isArray(value))
    {
        return deepArray(value)
    }
    return deepObject(value)
}
//*************************************************************************************************
function deepObject<T>(source: T): T
{
    const result = {} as T;
    Object.keys(source).forEach((key) => result[key as keyof T] = deepCloneModel(source[key as keyof T]), {});
    return result as T;
}
//*************************************************************************************************
function deepArray<T extends any[]>(collection: T): any
{
    return collection.map((value) => deepCloneModel(value));
}
//*************************************************************************************************
export function toString(value: any): string
{
    return JSON.stringify(value);
}
//*************************************************************************************************
export function errorToText(error: any): string
{
    return `Код помилки: ${toString(error ? error : error)}`;
}
//*************************************************************************************************
export function executeIf<V>(condition: boolean, callBackIf: () => V, callBackElse: () => V = () => void 0)
{
    return condition ? callBackIf() : callBackElse();
}
//*************************************************************************************************
export function isChangedField(changes: SimpleChanges, field: string): boolean
{
    return changes.hasOwnProperty(field) && changes[field].previousValue != changes[field].currentValue;
}
//*************************************************************************************************
export function isChangedAndNotNullOrUndefined(changes: SimpleChanges, field: string): boolean
{
    return isChangedField(changes, field) && !isNullOrUndefined(changes[field].currentValue);
}
//*************************************************************************************************
export function isChangedAndNullOrUndefined(changes: SimpleChanges, field: string): boolean
{
    return isChangedField(changes, field) && isNullOrUndefined(changes[field].currentValue);
}
//*************************************************************************************************
export function executeIfWithValue<T, V>(formValueFunc: () => T, conditionFunc: (value: T) => boolean, callBackIf: (value: T) => V, callBackElse: (value: T) => V = (_value: T) => void 0)
{
    return tryExecute(() =>
                      {
                          const value = formValueFunc();
                          return executeIf(conditionFunc(value), () => callBackIf(value), () => callBackElse(value));
                      });
}
//*************************************************************************************************
export function getSafeObservable<T>(callBack: (observer: Observer<T>) => void): Observable<T>
{
    return new Observable(observer => tryExecute(() => callBack(observer), error => observer.error(error)));
}
//*************************************************************************************************
export function unique<T>(items: Array<T>): Array<T>
{
    const arr: Array<T> = [];
    items.forEach(item => executeIf(!arr.includes(item), () => arr.push(item)));
    return arr;
}
//*************************************************************************************************
export function tryExecute<V>(execFunc: () => V, errorCallBack: (error) => any = (error) => console.error(error))
{
    try
    {
        return execFunc();
    }
    catch (error)
    {
        errorCallBack(error);
    }
}
//*************************************************************************************************
export function removeFileExtension(filename: string)
{
    return filename.replace(/\.[^\/.]+$/, "");
}
//*************************************************************************************************
