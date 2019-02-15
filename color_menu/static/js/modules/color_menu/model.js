export const ColorMenuModel = () => ({
    content: [{
            title: gettext('Red'),
            type: 'action',
            tooltip: gettext('Red'),
            order: 0,
            color: "#ff9999", //color code
            action: (editor, cells, rect) => {
                toggleColor(editor, cells, rect, 'red')
            }
        },
        {
            type: "separator",
            order: 1,
        },
        {
            title: gettext('Yellow'),
            type: 'action',
            tooltip: gettext('Yellow'),
            order: 2,
            color: "#ffffcc", //color code
            action: (editor, cells, rect) => {
                toggleColor(editor, cells, rect, 'yellow')
            }
        },
        {
            type: "separator",
            order: 3,
        },
        {
            title: gettext('Green'),
            type: 'action',
            tooltip: gettext('Green'),
            order: 4,
            color: "#ccffcc", //color code
            action: (editor, cells, rect) => {
                toggleColor(editor, cells, rect, 'green')
            }
        }
    ]
})

const toggleColor = (editor, cells, rect, color) => { // change the color of the cells
    for (let i = 0; i < cells.length; i++) {
        editor.currentView.dispatch(editor.currentView.state.tr.setNodeMarkup(rect.tableStart + cells[i], false, {
            color
        }))
    }
}