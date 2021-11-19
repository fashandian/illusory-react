/*
 * @Date: 2021-06-05 17:40:50
 * @LastEditors: fashandian
 * @LastEditTime: 2021-06-05 19:31:48
 */

import { createElement } from './iReact';
import iReactDOM from './iReactDOM';

const c = (
    <div id="222" class="wrapper">
        <span class="span1">2</span>
        <span>3</span>
        <span>6</span>
        <div class="test">
            <span>7</span>
        </div>
    </div>
);

const b = (
    /** @jsx iReactDOM.createElement */
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

console.log(c);

// document.body.appendChild(c);

iReactDOM.render(c, document.body);
