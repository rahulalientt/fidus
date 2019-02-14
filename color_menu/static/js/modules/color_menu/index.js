import {TableMap, selectionCell, CellSelection} from "prosemirror-tables"
import {ColorMenu} from './color_menu'
import {ColorMenuModel} from './model'
import {Schema} from "prosemirror-model"

export class Rect {
    constructor(left, top, right, bottom) {
      this.left = left; this.top = top; this.right = right; this.bottom = bottom
    }
}

export class ColorMenuPlugin {
    constructor(editor) {
        this.editor = editor
    }
    init(){

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
                attrs: Object.assign({color:{default:'white'}},tableCellSpec.attrs),
                parseDOM: [{tag: "td",
                            getAttrs:(dom)=>{
                                const attr = tableCellSpec.parseDOM[0].getAttrs(dom)
                                const col = dom.dataset.color
                                attr.color = col
                                return attr
                        }}],
                toDOM: (node)=>{
                    const obj = tableCellSpec.toDOM(node)[1]
                    const attrObj = Object.assign({"data-color":node.attrs.color, "class" :`cell-${node.attrs.color}`},obj)
                    return ["td", attrObj, 0]
                }
            })
        )
        })


        this.editor.menu.tableMenuModel.content[11].action = ()=>{
            this.toggleColor("row",this.editor.currentView)
        }

        this.editor.menu.tableMenuModel.content[12].action = ()=>{
            this.toggleColor("column",this.editor.currentView)
        }

        this.editor.menu.tableMenuModel.content[13].action = ()=>{
            this.toggleColor("cell",this.editor.currentView)
        }
    }

    toggleColor(type,view){
            const rect = this.selectedRect(view.state)
            const cells = rect.map.cellsInRect(type == "column" ? new Rect(rect.left, 0, rect.right, rect.map.height) :
                                             type == "row" ? new Rect(0, rect.top, rect.map.width, rect.bottom) : rect)
            const nodes = cells.map(pos => rect.table.nodeAt(pos))
            let tempColor = 'white'
            for (let i = 0; i < cells.length; i++){
              if (nodes[i].attrs.color !== 'white'){
                tempColor = nodes[i].attrs.color
                view.dispatch(view.state.tr.setNodeMarkup(rect.tableStart + cells[i],false, {color:'white'}))
              }
            }
            if (tempColor === 'white'){
                const colorMenu = new ColorMenu({
                                menu: ColorMenuModel(),
                                width: 200,
                                page: this.editor,
                                cells: cells,
                                rect: rect,
                                onClose: () => {view.focus()}
                            })
                colorMenu.open()
            }
    }

     selectedRect(state) {
        const sel = state.selection, $pos = selectionCell(state)
        const table = $pos.node(-1), tableStart = $pos.start(-1), map = TableMap.get(table)
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

    isInTable(state) {
        const $head = state.selection.$head
        for (let d = $head.depth; d > 0; d--) if ($head.node(d).type.spec.tableRole == "row") return $head.node(d)
        return false
    }

}