let panel;

function create() {
    // [1]
    const html = `
<style>
    .break {
        flex-wrap: wrap;
    }
    label.row > span {
        color: #8E8E8E;
        width: 20px;
        text-align: right;
        font-size: 9px;
    }
    label.row input {
        flex: 1 1 auto;
    }
    form {
        width:90%;
        margin: -20px;
        padding: 0px;
    }
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>

<form method="dialog" id="main">
    <div class="row break">
        <label class="row">
            <span>↕︎</span>
            <input type="number" uxp-quiet="true" id="txtV" value="10" placeholder="Height" />
        </label>
        <label class="row">
            <span>↔︎</span>
            <input type="number" uxp-quiet="true" id="txtH" value="10" placeholder="Width" />
        </label>
    </div>
    <footer><button id="ok" type="submit" uxp-variant="cta">Apply</button></footer>
</form>

<p id="warning">This plugin requires you to select a rectangle in the document. Please select a rectangle.</p>
`;

    function increaseRectangleSize() {
        // [2]
        const { editDocument } = require('application'); // [3]
        const height = Number(document.querySelector('#txtV').value); // [4]
        const width = Number(document.querySelector('#txtH').value); // [5]

        // [6]
        editDocument({ editLabel: 'Increase rectangle size' }, function (selection) {
            const selectedRectangle = selection.items[0]; // [7]
            selectedRectangle.width = width; // [8]
            selectedRectangle.height = height;
        });
    }

    panel = document.createElement('div'); // [9]
    panel.innerHTML = html; // [10]
    panel.querySelector('form').addEventListener('submit', increaseRectangleSize); // [11]

    return panel; // [12]
}

function show(event) {
    if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
    const { Rectangle } = require('scenegraph'); // [2]

    const form = document.querySelector('form'); // [3]
    const warning = document.querySelector('#warning'); // [4]

    if (!selection || !(selection.items[0] instanceof Rectangle)) {
        // [5]
        form.className = 'hide';
        warning.className = 'show';
    } else {
        form.className = 'show';
        warning.className = 'hide';
    }
}

module.exports = {
    panels: {
        enlargeRectangle: {
            show,
            update,
        },
    },
};
