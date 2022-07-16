/*
 * @Date: 2021-06-05 17:40:50
 * @LastEditors: fashandian
 * @LastEditTime: 2021-07-05 19:31:48
 */

import { createElement } from './iReact';
import iReactDOM from './iReactDOM';
import * as full from './full';

// const c = (
//     <div id="222" class="wrapper">
//         <span class="span1">2</span>
//         <span>3</span>
//         <span>6</span>
//         <div class="test">
//             <span>7</span>
//         </div>
//     </div>
// );

const b = (
    /** @jsx full.createElement */
    <div id="111" class="wrapper">
        <span class="span1">1</span>
        <span>2</span>
        <span>4</span>
        <div class="test">
            <span>5</span>
        </div>
        <div>
            <span>6</span>
        </div>
    </div>
);

console.log(b);

// console.log(c);

const handleInput = (e) => {
    renderer(e.target.value);
}

const renderer = value => {
    const ele = (
        <div>
            <input onInput={handleInput} value={value}/>
            <span>输入到文字：{value}</span>
        </div>
    )
    full.render(ele, document.body);
}

// 用于测试协调阶段的更新
setTimeout(() => {
    renderer('111');
}, 1000);
full.render(b, document.body);