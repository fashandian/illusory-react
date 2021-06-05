/*
 * @Date: 2021-06-05 17:40:50
 * @LastEditors: fashandian
 * @LastEditTime: 2021-06-05 19:31:48
 */

import { createElement } from './iReact';

const b = (
    <div id="111" class="wrapper">
        <span class="span1">1</span>
        <span>2</span>
        <span>4</span>
        <div class="test">
            <span>5</span>
        </div>
    </div>
);

console.log(b);

document.body.appendChild(b);
