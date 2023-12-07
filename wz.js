let desktopWidgetOrder = [];

let dragSrcElM = null;

function handleDragStart(e) {
    dragSrcElM = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter() {
    this.classList.add('over');
}

function handleDragLeave() {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    handlePlaceholder(dragSrcElM.parentNode, this.parentNode);

    const srcIndex = Array.from(dragSrcElM.parentNode.children).indexOf(dragSrcElM);
    const targetIndex = Array.from(this.parentNode.children).indexOf(this);

    this.parentNode.insertBefore(dragSrcElM, targetIndex > srcIndex ? this.nextSibling : this);
    
    return false;
}

function handlePlaceholder(parent, targetParent) {
    let parentDomPlaceholder = document?.querySelector(`.${ parent?.className?.replace(' ', '.') } .drag-item-placeholder`);
    if(parent?.childElementCount > 2) {
    } else {
        console.log(parentDomPlaceholder);
        if(parentDomPlaceholder?.classList) {
            parentDomPlaceholder.classList.remove('hide');
        }
    }
    let targetDomPlaceholder = targetParent?.querySelector('.drag-item-placeholder');
    if(targetDomPlaceholder) {
        targetDomPlaceholder.classList.add('hide');
    }
}

function handleDragEnd() {
    const items = document.querySelectorAll('.drag-item');

    desktopWidgetOrder = [];
    items.forEach((item) => {
        item.classList.remove('over')
        desktopWidgetOrder.push(item.id);
    });
}

function reArrangeStart() {
    const itemsL = document.querySelectorAll('.drag-item');
    itemsL.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
}

$('.c-wz-arrange-save-dbtn').click(function() {
    var dragItems = $('.c-wz-box .c-wz-column .drag-item');

    var newDesktopWidgetOrder = [];

    dragItems.each(function () {
        let col = $(this).parent().attr('class').split(' ')[1].split('-')[1];
        newDesktopWidgetOrder.push(col + '-' + $(this).attr('id'));
    });
    localStorage.setItem('DV_WIDGET_ORDER', newDesktopWidgetOrder);
});


var oldDesktopWidgetOrder = localStorage.getItem('DV_WIDGET_ORDER');
var defaultDesktopWidgetOrder = '1-wzd-snapshot,1-wzd-insights,1-wzd-placeholder,2-wzd-trends,2-wzd-debts,2-wzd-cash-flow,2-wzd-recent-transactions,2-wzd-recurring-merchants,2-wzd-placeholder,3-wzd-balance-sheet,3-wzd-budgets,3-wzd-credit-score,3-wzd-placeholder';

if (!oldDesktopWidgetOrder) {
    localStorage.setItem('DV_WIDGET_ORDER', defaultDesktopWidgetOrder);
    oldDesktopWidgetOrder = defaultDesktopWidgetOrder;
}

var widgetOrder = oldDesktopWidgetOrder.split(',');

widgetOrder.forEach(function (widget) {
    var [column, widgetId] = widget.split('-wzd-');
    var columnClass = 'dwzc-' + column;

    var $column = $('.c-wz-column.' + columnClass);
    var spanEl = document.createElement('span');

    if(widgetId.indexOf('placeholder') == 0) {
        spanEl.setAttribute('class', $column.children().length > 0 ? 'hide drag-item drag-item-placeholder' : 'drag-item drag-item-placeholder');
        spanEl.setAttribute('draggable', 'false');
        spanEl.innerHTML = '+';
    } else {
        spanEl.classList.add('drag-item');
        spanEl.setAttribute('draggable', 'true');
        spanEl.innerHTML = widgetId.replace('-', ' ').toLocaleUpperCase();
    }
    
    spanEl.setAttribute('id', 'wzd-' + widgetId)
    var $widget = $(spanEl);
    $widget.appendTo($column);
});
