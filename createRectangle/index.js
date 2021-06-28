const { Rectangle, Color, Text, RepeatGrid, SymbolInstance, ImageFill } = require('scenegraph');
const { downloadImage } = require('../util/request');

let dialog = null;
const dialogHtml = `<style>
form {
    width: 360px;
}
.h1 {
    align-items: center;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
}
.icon {
    border-radius: 4px;
    width: 24px;
    height: 24px;
    overflow: hidden;
}
</style>
<form method="dialog">
<h1 class="h1">
    <span>你要填充哪些元素</span>
    <img class="icon" src="../images/icon@1x.png" />
</h1>
<hr />
<p>已忽略组件对象</p>
<ul id="choiceBox">
    <li><input  type="checkbox" name='check' value="23"/> <label>23</label> </li>
</ul>
<footer>
    <button uxp-variant="primary" id="cancel" >取消</button>
    <button uxp-variant="cta" id="done">填充</button>
</footer>
</form>
    `;

dialog = document.createElement('dialog', { is: 'alert' });
dialog.innerHTML = dialogHtml;
document.appendChild(dialog);

const cancel = document.querySelector('#cancel');
const done = document.querySelector('#done');
const choiceBox = document.querySelector('#choiceBox');
let selectionNodeList = [];
cancel.addEventListener('click', () => {
    dialog.close();
});

done.addEventListener('click', () => {
    doneFunc();
});

// const showDialog = () => {
//     if (!dialog) {
//         createDialog();
//     }
//     return dialog.showModal();
// };

/**
 * 循环组内node
 * @param {[]node} nodeList
 * @param {function} callback
 */
function scanGroup(nodeList, callback) {
    nodeList.forEach((node) => {
        if (node.isContainer) {
            console.log('node instanceof SymbolInstance', node instanceof SymbolInstance, node);
            if (!(node instanceof SymbolInstance)) {
                scanGroup(node.children, callback);
            }
        } else {
            callback(node);
        }
    });
}

const createChoiceBox = (data) => {
    const ul = data.map((item) => ` <li><input  type="checkbox" name='check' value="${item}"/> <label>${item}</label> </li>`);

    choiceBox.innerHTML = ul.join('');
};

async function doneFunc() {
    const li = choiceBox.querySelectorAll('input');
    const checked = Array.from(li)
        .filter((ele) => ele.checked)
        .map((ele) => ele.value);

    const imgFile = await downloadImage();
    selectionNodeList.forEach((item, index) => {
        if (checked.includes(item.name)) {
            if (imgFile[index]) {
                item.fill = new ImageFill(imgFile[index]);
            } else {
                item.fill = new ImageFill(imgFile[0]);
            }
        }
    });
    dialog.close();
}

function rectangleHandlerFunction(selection, root) {
    console.log(selection.items, root);
    selectionNodeList = [];
    scanGroup(selection.items, (node) => {
        selectionNodeList.push(node);
    });
    console.log(selectionNodeList);

    const name = [...new Set(selectionNodeList.map((item) => item.name))];

    // console.log(name);
    createChoiceBox(name);

    return dialog.showModal();

    // root.children.forEach((node) => {
    //     console.log(node.name);
    // });
}

module.exports = { rectangleHandlerFunction };
