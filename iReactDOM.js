// const h1 = <h1 title="this is title">hello world</h1>;
// const container = document.body;

// ReactDOM.render(h1, container);


// const element = {
//     type: 'h1',
//     props: {
//         title: 'this is title',
//         children: 'hello world'
//     }
// }

// const container = document.body;

// const node = document.createElement(element.type);
// node['title'] = element.props.title;

// // one way
// node.innerHTML = element.props.children;

// // another way
// const textNode = document.createTextNode('');
// textNode['nodeValue'] = element.props.children;

// node.appendChild(textNode);

// container.appendChild(node);


// 先写着，到时候再拆出去

/**
 * 创建jsx
 * @param {string} type 元素类型
 * @param {object} props 传入的属性
 * @param  {...any} children 子元素/子内容数组
 * @returns 
 */
const createElement = (type, props, ...children) => {
    console.log('iReactDOM:', type, props);
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child))
        }
    }
}

const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

const createDom = (fiber) => {
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);

    const isProperty = key => key !== 'children';
    Object.keys(element.props).filter(isProperty).forEach(name => {
        dom[name] = fiber.props[name]
    });

    return dom;
}

const render = (element, container) => {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot
    };

    nextUnitOfWork = wipRoot;
}

const commitRoot = () => {
    // add nodes to dom
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
}

const commitWork = (fiber) => {
    if (!fiber) {
        return;
    }

    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;

const workLoop = (deadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = preformUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const preformUnitOfWork = (fiber) => {
    // add dom node
    // create new fibers
    // return next unit of work
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    // 每次处理元素时，我们都会向DOM添加一个新的节点
    // 在我们渲染完整棵树之前，浏览器可能会中断我们的工作。在这种情况下，用户将看到一个不完整的用户界面。我们不想要那个
    // if (fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom);
    // }

    const elements = fiber.props.children;


    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
        const element = elements[index];

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }

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

}

const reconcileChildren = (wipFiber, elements) => {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

    while (index < elements.length || oldFiber !== null) {
        const element = elements[index];
        // compare oldFiber to element
    }
}

const IReactDOM = {
    createElement,
    render
}

export default IReactDOM;