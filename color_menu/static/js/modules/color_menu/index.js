import {
    TableMap,
    selectionCell,
    CellSelection,
    toggleHeaderCell
} from "prosemirror-tables"
import {
    ColorMenu
} from './color_menu'
import {
    ColorMenuModel
} from './model'
import {
    Schema
} from "prosemirror-model"

export class ColorMenuPlugin {
    constructor(editor) {
        this.editor = editor
    }
    init() {

        document.head.insertAdjacentHTML(
            'beforeend',
            `<link rel="stylesheet" href="${this.editor.staticUrl}css/color_menu.css" />`
        )


        const specNodes = this.editor.schema.spec.nodes
        const tableCellSpec = specNodes.get("table_cell")
        this.editor.schema = new Schema({
            marks: this.editor.schema.spec.marks,
            nodes: specNodes.update(
                "table_cell",
                Object.assign({}, tableCellSpec, {
                    attrs: Object.assign({
                        color: {
                            default: ''
                        }
                    }, tableCellSpec.attrs),
                    parseDOM: [{
                        tag: "td",
                        getAttrs: (dom) => {
                            const attr = tableCellSpec.parseDOM[0].getAttrs(dom)
                            const col = dom.dataset.color
                            attr.color = col
                            return attr
                        }
                    }],
                    toDOM: (node) => {
                        const obj = tableCellSpec.toDOM(node)[1]
                        const attrObj = Object.assign({
                            "data-color": node.attrs.color,
                            "class": `cell-${node.attrs.color}`
                        }, obj)
                        return ["td", attrObj, 0]
                    }
                })
            )
        })
        this.editor.menu.tableMenuModel.content[13].title = gettext('Toggle cell color')
        this.editor.menu.tableMenuModel.content[13].tooltip = gettext('Toggle color of currently selected cells')
        this.editor.menu.tableMenuModel.content[13].action = () => {
            this.toggleColor(this.editor.currentView)
        }
    }

    toggleColor(view) {
        const rect = this.selectedRect(view.state)
        const cells = rect.map.cellsInRect(rect)
        const nodes = cells.map(pos => rect.table.nodeAt(pos))
        let tempColor = ''
        for (let i = 0; i < cells.length; i++) {
            if (nodes[i].type.name === "table_header") {
                toggleHeaderCell(this.editor.currentView.state, this.editor.currentView.dispatch)
            } else if (nodes[i].attrs.color !== '') {
                tempColor = nodes[i].attrs.color
                view.dispatch(view.state.tr.setNodeMarkup(rect.tableStart + cells[i], false, {
                    color: ''
                }))
            }
        }
        if (tempColor === '') {
            const colorMenu = new ColorMenu({
                menu: ColorMenuModel(),
                width: 200,
                page: this.editor,
                cells: cells,
                rect: rect,
                onClose: () => {
                    view.focus()
                }
            })
            colorMenu.open()
        }
    }

    selectedRect(state) {
        const sel = state.selection,
            $pos = selectionCell(state)
        const table = $pos.node(-1),
            tableStart = $pos.start(-1),
            map = TableMap.get(table)
        let rect
        if (sel instanceof CellSelection)
            rect = map.rectBetween(sel.$anchorCell.pos - tableStart, sel.$headCell.pos - tableStart)
        else
            rect = map.findCell($pos.pos - tableStart)
        rect.tableStart = tableStart
        rect.map = map
        rect.table = table
        return rect
    }
}