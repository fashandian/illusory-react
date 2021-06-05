/*
 * @Date: 2021-06-05 18:44:02
 * @LastEditors: fashandian
 * @LastEditTime: 2021-06-05 19:27:02
 */
import { isSameType } from './utils';

const createElement = (type, attributes, ...children) => {
    console.log(type, attributes, children);

    const element = document.createElement(type);

    for (const key in attributes) {
        if (Object.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key]);
        }
    }

    for (const item of children) {
        if (isSameType(item, 'String')) {
            element.appendChild(document.createTextNode(item));
        } else {
            element.appendChild(item);
        }
    }

    console.log(element);

    return element;
};

export { createElement };
