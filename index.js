/*
 * @Date: 2021-06-05 17:40:50
 * @LastEditors: fashandian
 * @LastEditTime: 2021-07-05 19:31:48
 */

import { createElement } from './iReact';
import iReactDOM from './iReactDOM';
import * as full from './full';

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

console.log(c);

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

// setTimeout(() => {
//     renderer('111')
// }, 1000);
renderer('111')

// document.body.appendChild(c);

// iReactDOM.render(c, document.body);
// full.render(b, document.body);


// DSL   GPL   GPPL

// 2周前的日期
// 解法一
// new Date(+new Date() - 2 * 7 * 24 * 60 * 60 * 1000)

// 解法二
// 2 weeks ago

// 解法三
// (2).weeks.ago

// 解法三实现
// const days = 24 * 60 * 60 * 1000;
// const weeks = 7 * days
// const unit = { days, weeks }

// class DT {
//     constructor(type, num) {
//         this.type = type
//         this.num = num;
//     }

//     get ago() {
//         return new Date(+new Date() - this.num * unit[this.type])
//     }
// }

// Object.keys(unit).forEach(item => {
//     Object.defineProperty(Number.prototype, item, {
//         get() {
//             return new DT(item, this)
//         }
//     })
// })


// dev -> jsx -> babel -> react.createElement -> reactelemnt（fiber） -> iReactDOM.render -> real dom