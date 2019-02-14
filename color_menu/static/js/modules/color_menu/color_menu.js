
const menuTemplate = ({id, classes, height, width, zIndex, menu, scroll}) =>
`<div tabindex="-1" role="incontent_menu"
        class="ui-content_menu ui-corner-all ui-widget ui-widget-content ui-front"
        ${id ? `aria-describedby="${id}"` : ''} style="z-index: ${zIndex};">
    <div ${id ? `id="${id}"` : ''} class="ui-content_menu-content ui-widget-content${classes ? ` ${classes}` : ''}${scroll ? ` ui-scrollable` : ''}" style="width: ${width}; height: ${height};">
    <div class="color-menu-header">${gettext("Select color for your Cell(s)")}
    </div>
    <hr class="content-menu-item-divider"/>
    <div>
        <ul class="content-menu-list">
        ${
            menu.content.map((menuItem,index)=>
                menuItem.type == "separator" ?
                    '<hr class="content-menu-item-divider"/>' :
                    `<li data-index="${index}" class="content-menu-item" title='${menuItem.tooltip}'>
                    ${
                        menuItem.title
                    } ${
                        menuItem.color ?
                            `<div class="color-menu-item-icon" style="background-color: ${menuItem.color}"></div>` :
                            ''
                    }
                    </li>`
            ).join('')
        }
        </ul>
    </div>
    </div>
</div>
<div class="ui-widget-overlay ui-front ui-color-menu" style="z-index: ${zIndex-1}"></div>`

export class ColorMenu {
    constructor({
        id = false,
        classes = false,
        menu = [],
        page = false,
        height = false,
        width = false,
        onClose = false,
        scroll = false,
        dialogEl = false,
        backdropEl = false,
        cells = false,
        rect = false
    }) {
        this.id = id
        this.classes = classes
        this.menu = menu
        this.page = page
        this.height = height ? `${height}px` : 'auto'
        this.width = width ? `${width}px` : 'auto'
        this.onClose = onClose
        this.scroll = scroll
        this.dialogEl = dialogEl
        this.backdropEl = backdropEl
        this.cells = cells
        this.rect = rect
    }

    open() {
        if (this.dialogEl) {
            return
        }
        document.body.insertAdjacentHTML(
            'beforeend',
            menuTemplate({
                id: this.id,
                classes: this.classes,
                height: this.height,
                width: this.width,
                zIndex: this.getHighestDialogZIndex() + 2,
                menu: this.menu,
                scroll: this.scroll,
            })
        )
        this.backdropEl = document.body.lastElementChild
        this.dialogEl = this.backdropEl.previousElementSibling
        this.centerDialog()
        this.bind()
    }

    centerDialog() {
        const totalWidth = window.innerWidth,
            totalHeight = window.innerHeight,
            dialogRect = this.dialogEl.getBoundingClientRect(),
            dialogWidth = dialogRect.width + 10,
            dialogHeight = dialogRect.height + 10,
            scrollTopOffset = window.pageYOffset,
            scrollLeftOffset = window.pageXOffset
        this.dialogEl.style.top = `${(totalHeight - dialogHeight)/2 + scrollTopOffset}px`
        this.dialogEl.style.left = `${(totalWidth - dialogWidth)/2 + scrollLeftOffset}px`
    }

    bind() {
        this.backdropEl.addEventListener('click', () => this.close())
        this.dialogEl.addEventListener('click', event => this.onclick(event))
    }

    getHighestDialogZIndex() {
        let zIndex = 100
        document.querySelectorAll('div.ui-content_menu').forEach(dialogEl => zIndex = Math.max(zIndex, dialogEl.style.zIndex))
        return zIndex
    }

    close() {
        if (!this.dialogEl) {
            return
        }
        this.dialogEl.parentElement.removeChild(this.dialogEl)
        this.backdropEl.parentElement.removeChild(this.backdropEl)
        if (this.onClose) {
            this.onClose()
        }
    }

    onclick(event){
        event.preventDefault()
        event.stopImmediatePropagation()
        const target = event.target
        if (target.matches('li.content-menu-item')) {
            const menuNumber = target.dataset.index
            const menuItem = this.menu.content[menuNumber]
            menuItem.action(this.page,this.cells,this.rect)
            this.close()
        }
    }
}
