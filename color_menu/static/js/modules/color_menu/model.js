export const ColorMenuModel = ()=> ({
    content: [
        {
            title: gettext('Red'),
            type: 'action',
            tooltip: gettext('Red'),
            order: 0,
            color: "red",
            action: (editor,cells,rect) => {
                for (let i = 0; i < cells.length; i++){
                    editor.currentView.dispatch(editor.currentView.state.tr.setNodeMarkup(rect.tableStart + cells[i], false, {color:'red'}))
                }
            }
        },
        {
            type:"separator",
            order: 1,
        },
        {
            title: gettext('Yellow'),
            type: 'action',
            tooltip: gettext('Yellow'),
            order: 2,
            color: "yellow",
            action: (editor,cells,rect) => {
                for (let i = 0; i < cells.length; i++){
                    editor.currentView.dispatch(editor.currentView.state.tr.setNodeMarkup(rect.tableStart + cells[i], false, {color:'yellow'}))
                }
            }
        },
        {
            type:"separator",
            order: 3,
        },
        {
            title: gettext('Green'),
            type: 'action',
            tooltip: gettext('Green'),
            order: 4,
            color: "green",
            action: (editor,cells,rect) => {
                for (let i = 0; i < cells.length; i++){
                    editor.currentView.dispatch(editor.currentView.state.tr.setNodeMarkup(rect.tableStart + cells[i], false, {color:'green'}))
                }
            }
        }
    ]
})
