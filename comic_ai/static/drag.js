//canvas images
interact('.canvas-image')
.draggable({
    listeners: {
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.translate = `${x}px ${y}px`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    },
    restrict: {
        restriction: 'parent',
      },
});

interact('.canvas-image')
.resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
        move(event) {
            let { target } = event;
            let newWidth = event.rect.width;
            let newHeight = event.rect.height;
            const aspectRatio = target.offsetWidth / target.offsetHeight;
            const isCorner = (event.edges.left && event.edges.top) || 
                             (event.edges.right && event.edges.top) || 
                             (event.edges.left && event.edges.bottom) || 
                             (event.edges.right && event.edges.bottom);
            if (isCorner) {
                if (newWidth / newHeight > aspectRatio) {
                    newWidth = newHeight * aspectRatio;
                } else {
                    newHeight = newWidth / aspectRatio;
                }
            }
            target.style.width = `${newWidth}px`;
            target.style.height = `${newHeight}px`;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            target.style.translate = `${x}px ${y}px`;
        }
    }
});



//canvas text
interact('.canvas-text')
.draggable({
    listeners: {
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.translate = `${x}px ${y}px`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    },
    restrict: {
        restriction: 'parent',
      },
});



//items
let originalParent = null;
interact('.item')
.draggable({
    listeners: {
    start(event){
        originalParent = event.target.parentNode;
        const currentWidth = event.target.offsetWidth;
        const currentHeight = event.target.offsetHeight;

        const rect = event.target.getBoundingClientRect();
        const currentLeft = rect.left;
        const currentTop = rect.top;

        event.target.style.width = `${currentWidth}px`;
        event.target.style.height = `${currentHeight}px`;
        event.target.style.position = 'absolute';
        event.target.style.left = `${currentLeft}px`;
        event.target.style.top = `${currentTop}px`;
        event.target.style.zIndex = '1000';

        document.body.appendChild(event.target);
    },
    move(event){
        const { target } = event;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    },
    end(event){
        if (originalParent) {
            originalParent.appendChild(event.target);
            event.target.style = '';
            event.target.removeAttribute('data-x');
            event.target.removeAttribute('data-y');
            originalParent = null;
        }
    }
    }
});

interact('.page')
.dropzone({
    accept: '.item, .text-item, generated-image',
    ondrop(event){
        if(event.target.classList.contains('page')){
            if(event.relatedTarget.classList.contains('generated-image')){
                addImage(event.relatedTarget, event.target);
            }else if(event.relatedTarget.classList.contains('text-item')){
                addText(event.relatedTarget, event.target);
            }else if(event.relatedTarget.classList.contains('item')){
                addItem(event.relatedTarget, event.target);
            }
        }
    },
    ondragenter(event){
        event.target.style.boxShadow = '0 0 8px 4px rgb(100, 100, 255)';
    },
    ondragleave(event){
        event.target.style.boxShadow = 'none';
    },
});



//minimap
interact('.drag-area')
.draggable({
    listeners: {
        start(event) {
            var box = event.target.parentElement;
            var rect = box.getBoundingClientRect();
            box.setAttribute('data-center-x', rect.left + rect.width / 2);
            box.setAttribute('data-center-y', rect.top + rect.height / 2);
        },
        move(event) {
            var box = event.target.parentElement;
            var pos = {
            x: (parseFloat(box.getAttribute('data-x')) || 0) + event.dx,
            y: (parseFloat(box.getAttribute('data-y')) || 0) + event.dy
          };
  
          box.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
          box.setAttribute('data-x', pos.x);
          box.setAttribute('data-y', pos.y);
        },
    },
    restrict: {
        restriction: '.inner',
    },
})

//minimap
interact('.page-settings-drag-area')
.draggable({
    listeners: {
        start(event) {
            var box = event.target.parentElement.parentElement;
            var rect = box.getBoundingClientRect();
            box.setAttribute('data-center-x', rect.left + rect.width / 2);
            box.setAttribute('data-center-y', rect.top + rect.height / 2);
        },
        move(event) {
            var box = event.target.parentElement.parentElement;
            var pos = {
            x: (parseFloat(box.getAttribute('data-x')) || 0) + event.dx,
            y: (parseFloat(box.getAttribute('data-y')) || 0) + event.dy
          };
  
          box.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
          box.setAttribute('data-x', pos.x);
          box.setAttribute('data-y', pos.y);
        },
    },
    restrict: {
        restriction: '.inner',
    },
})


//properties
interact('.properties-drag-area')
.draggable({
    listeners: {
        start(event) {
            var box = event.target.parentElement.parentElement;
            var rect = box.getBoundingClientRect();
            box.setAttribute('data-center-x', rect.left + rect.width / 2);
            box.setAttribute('data-center-y', rect.top + rect.height / 2);
        },
        move(event) {
            var box = event.target.parentElement.parentElement;
            var pos = {
            x: (parseFloat(box.getAttribute('data-x')) || 0) + event.dx,
            y: (parseFloat(box.getAttribute('data-y')) || 0) + event.dy
          };
  
          box.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
          box.setAttribute('data-x', pos.x);
          box.setAttribute('data-y', pos.y);
        },
    },
    restrict: {
        restriction: '.inner',
    },
})

//page clone drag dropu
// interact('.page-clone')
// .draggable({
//     listeners: {
//         start(event) {
//             var box = event.target.parentElement;
//             var rect = box.getBoundingClientRect();
//             box.setAttribute('data-center-x', rect.left + rect.width / 2);
//             box.setAttribute('data-center-y', rect.top + rect.height / 2);
//         },
//         move(event) {
//             var box = event.target.parentElement;
//             var pos = {
//             x: (parseFloat(box.getAttribute('data-x')) || 0) + event.dx,
//             y: (parseFloat(box.getAttribute('data-y')) || 0) + event.dy
//           };
  
//           box.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
//           box.setAttribute('data-x', pos.x);
//           box.setAttribute('data-y', pos.y);
//         },
//     },
//     restrict: {
//         restriction: '.inner',
//     },
// })



interact('.text-item')
.draggable({
    listeners: {
    start(event){
        originalParent = event.target.parentNode;
        const currentWidth = event.target.offsetWidth;
        const currentHeight = event.target.offsetHeight;

        const rect = event.target.getBoundingClientRect();
        const currentLeft = rect.left;
        const currentTop = rect.top;

        event.target.style.width = `${currentWidth}px`;
        event.target.style.height = `${currentHeight}px`;
        event.target.style.position = 'absolute';
        event.target.style.left = `${currentLeft}px`;
        event.target.style.top = `${currentTop}px`;
        event.target.style.zIndex = '1000';

        document.body.appendChild(event.target);
    },
    move(event){
        const { target } = event;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    },
    end(event){
        if (originalParent) {
            originalParent.appendChild(event.target);
            event.target.style = '';
            event.target.removeAttribute('data-x');
            event.target.removeAttribute('data-y');
            originalParent = null;
        }
    }
    }
});

