/*
 * @Date: 2021-06-05 18:53:23
 * @LastEditors: fashandian
 * @LastEditTime: 2021-06-05 19:26:27
 */

/**
 * 根据值返回相关类型
 * @param {any} val 数据
 * @returns 数据的类型 Object | Array | String | Number | Boolean | Null | Undefined
 */
const getType = (val) => {
    return Object.prototype.toString.call(val).match(/\[.+\s(.+)\]/)?.[1];
};

/**
 * 比较数据的类型是否与期望的类型相同
 * @param {any} val 数据
 * @param {string} type 期望比较的类型字符串
 * @returns 是否相同
 */
const isSameType = (val, type) => getType(val) === type;

export { getType, isSameType };
