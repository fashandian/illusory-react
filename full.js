function createElement(type, props, ...childrens) {
    return {
        type,
        props: {
            ...props,
            children: childrens?.map(child => typeof child === 'object' ? child : createTextElement(child))
        },
    }
}

function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

// function render(element, container) {
//     const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);

//     const isProperty = key => key !== 'children';
//     Object.keys(element.props).filter(isProperty).forEach(name => dom[name] = element.props[name])

//     element?.props?.children?.forEach(child => render(child, dom));

//     container.appendChild(dom)
// }

// Step 2: 工作单元(fiber)
// 在render方法中直接通过递归的方式渲染元素，但是这样有个问题，因为递归过程是无法打断的，如果是大型应用，元素众多，可能会导致性能问题，因此，需要进行可中断的更新
// 因此需要将更新任务拆分（时间切片）成一个又一个的任务块，称之为工作单元
// 在react中，通过fiber来组织工作单元，形成一颗fiber树，其中，每一个react element就是一个fiber，每一个fiber就是工作单元
// 因此，对render方法改造一下
let nextUnitOfWork = null;

// function workLoop(deadline) {
//     let shouldYield = false;
//     while (nextUnitOfWork && !shouldYield) {
//         nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
//         // 得到浏览器当前帧剩余时间，理论应该精确到5微妙级别，但如果浏览器或其所在的操作系统不具备精确到微妙级别的时钟时，则只能精确到毫秒
//         // 浏览器首选项可以设置降低时间精度（防止时序攻击和记录指纹）
//         shouldYield = deadline.timeRemaining() < 1;
//     }
//     requestIdleCallback(workLoop);
// }
requestIdleCallback(workLoop);

/**
 * 执行任务单元，并返回下一个任务单元
 * 
 * <div>
 *      <h1>
 *          <p></p>
 *          <span></span>
 *      </h1>
 *      <h2>
 *          <a></a>
 *      </h2>
 * </div>
 * 
 * root
 * ↓↑
 * div
 * ↓     ↖
 * h1    →     h2
 * ↓  ↖        ↓↑
 * p → span    a
 * 
 * 从root往下查找，先找子节点，当无子节点，此时找兄弟节点，当无兄弟节点，此时找父节点的兄弟节点，按照该顺序直到所有节点查找完成
 * 
 * @param {ReactElement} fiber 当前任务单元
 * @returns 下一个任务单元
 */
// function performUnitOfWork(fiber) {
//     // react element 转换成真实dom
//     if (!fiber.dom) {
//         fiber.dom = createDom(fiber);
//     }
//     if (fiber.parent) {
//         fiber.parent.dom.appendChild(fiber.dom);
//     }

//     // 为当前fiber创建其子节点的fiber
//     const reactElements = fiber?.props?.children;
//     let prevSibling = null;
//     reactElements.forEach((element, index) => {
//         const newFiber = {
//             type: element.type,
//             props: element.props,
//             parent: fiber,
//             dom: null
//         };
//         if (index === 0) {
//             fiber.child = newFiber;
//         } else {
//             prevSibling.sibling = newFiber;
//         }

//         prevSibling = newFiber;
//     })

//     // 返回下一个任务单元
//     if (fiber.child) {
//         return fiber.child;
//     }

//     let nextFiber = fiber;
//     while(nextFiber) {
//         if (nextFiber.sibling) {
//             return nextFiber.sibling;
//         }

//         nextFiber = nextFiber.parent;
//     }

//     return null;
// }

// function createDom(element) {
//     const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);

//     const isProperty = key => key !== 'children';
//     Object.keys(element.props).filter(isProperty).forEach(name => dom[name] = element.props[name])

//     return dom;
// }

// function render(element, container) {
//     nextUnitOfWork = {
//         dom: container,
//         props: {
//             children: [element]
//         }
//     }
// }

// Step 3: render and commit
// 在第二步中，每一帧performUnitOfWork都会转换成真实的dom，并挂载在父节点上（一边遍历fiber（新的架构已经没有虚拟dom这个说法了），一边生成新的dom，并挂载在父节点上），
// 当dom嵌套层级较深时，浏览器可能无法在一帧中完成，出现中断，因此，用户可能看到不完整的UI
let wipRoot = null;

// function commitWork(fiber) {
//     if (!fiber) {
//         return;
//     }

//     const parentDom = fiber.parent.dom;
//     parentDom.appendChild(fiber.dom);
//     commitWork(fiber.child);
//     commitWork(fiber.sibling);
// }

// function commitRoot() {
//     commitWork(wipRoot.child);
//     wipRoot = null;
// }

function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        // 得到浏览器当前帧剩余时间，理论应该精确到5微妙级别，但如果浏览器或其所在的操作系统不具备精确到微妙级别的时钟时，则只能精确到毫秒
        // 浏览器首选项可以设置降低时间精度（防止时序攻击和记录指纹）
        shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

// function performUnitOfWork(fiber) {
//     // react element 转换成真实dom
//     if (!fiber.dom) {
//         fiber.dom = createDom(fiber);
//     }

//     // 为当前fiber创建其子节点的fiber
//     const reactElements = fiber?.props?.children;
//     let prevSibling = null;
//     reactElements.forEach((element, index) => {
//         const newFiber = {
//             type: element.type,
//             props: element.props,
//             parent: fiber,
//             dom: null
//         };
//         if (index === 0) {
//             fiber.child = newFiber;
//         } else {
//             prevSibling.sibling = newFiber;
//         }

//         prevSibling = newFiber;
//     })

//     // 返回下一个任务单元
//     if (fiber.child) {
//         return fiber.child;
//     }

//     let nextFiber = fiber;
//     while(nextFiber) {
//         if (nextFiber.sibling) {
//             return nextFiber.sibling;
//         }

//         nextFiber = nextFiber.parent;
//     }

//     return null;
// }

// function render(element, container) {
//     nextUnitOfWork = wipRoot = {
//         dom: container,
//         props: {
//             children: [element]
//         }
//     }
// }

// Step 4: 协调阶段，对新旧的fiber进行diff
// 当前每一帧都是对fiber树进行直接生成dom，在大型应用下，元素众多，可能会产生性能问题
// 因此，需要考虑对旧的dom进行复用
let currentRoot = null;
let deletions = [];
const isEvent = key => key.startsWith('on');
const isProperty = key => key !== 'children' && !isEvent(key);
const isGone = (props) => key => !(key in props);
const isNew = (prev, next) => key => prev[key] !== next[key];

function createDom(fiber) {
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);

    updateDom(dom, {}, fiber.props);

    return dom;
}

function updateDom(dom, prevProps, nextProps) {
    Object.keys(prevProps).filter(isEvent).filter(key => isGone(nextProps)(key) || isNew(prevProps, nextProps)(key)).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    })
    Object.keys(prevProps).filter(isProperty).filter(isGone(nextProps)).forEach(name => dom[name] = '');
    Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(name => dom[name] = nextProps[name]);
    Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    })
}

function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    const parentDom = fiber.parent.dom;

    switch (fiber.effectTag) {
        case 'PLACEMENT':
            !!fiber.dom && parentDom.appendChild(fiber.dom);
            break;
        case 'UPDATE':
            !!fiber.dom && updateDom(fiber.dom, fiber.alternate.props, fiber.props);
            break;
        case 'DELETION':
            !!fiber.dom && parentDom.removeChild(fiber.dom);
            break;
        default:
            break;
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function commitRoot() {
    commitWork(wipRoot.child);
    deletions.forEach(commitWork);
    currentRoot = wipRoot;
    wipRoot = null;
}

function render(element, container) {
    nextUnitOfWork = wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot
    };
    deletions = [];
}

function reconcileChildren(wipFiber, reactElements) {
    let prevSibling = null;
    let oldFiber = wipFiber?.alternate?.child;
    let index = 0;

    while (index < reactElements.length || oldFiber) {

        const childElement = reactElements[index];
        // TODO: 还要考虑下顺序变换的情况，所以react通常推荐给react element加上index标记
        const isSameType = oldFiber && childElement && oldFiber.type === childElement.type;

        let newFiber = null;

        if (isSameType) {
            newFiber = {
                type: oldFiber.type,
                props: childElement.props,
                parent: wipFiber,
                dom: oldFiber.dom,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            };
        }

        if (!isSameType && childElement) {
            newFiber = {
                type: childElement.type,
                props: childElement.props,
                parent: wipFiber,
                dom: null,
                alternate: null,
                effectTag: 'PLACEMENT'
            };
        }

        if (!isSameType && oldFiber) {
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        console.log(newFiber)

        if (newFiber) {
            prevSibling = newFiber;
        }

        index++;
        oldFiber = oldFiber?.sibling;
    }
}

function performUnitOfWork(fiber) {
    // react element 转换成真实dom
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    // 为当前fiber创建其子节点的fiber
    const reactElements = fiber?.props?.children;
    reconcileChildren(fiber, reactElements);

    // 返回下一个任务单元
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }

        nextFiber = nextFiber.parent;
    }

    return null;
}


export { createElement, render };