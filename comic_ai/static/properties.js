const properties = document.querySelector('.properties');

properties.addEventListener('mousedown', function (event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === 'LABEL' && clickedElement.querySelector('input[type="number"]') || clickedElement.tagName === 'LABEL' && clickedElement.querySelector('input[type="range"]')) {
        const input = clickedElement.querySelector('input');
        
        let isDragging = false;
        let startX = event.clientX;
        let initialValue = parseInt(input.value, 10);

        clickedElement.style.cursor = 'grabbing';

        const mouseMoveHandler = (event) => {
            if (isDragging) {
                const deltaX = event.clientX - startX;
                const sensitivity = 1;
                const newValue = initialValue + deltaX * sensitivity;

                const clampedValue = Math.max(input.min, Math.min(input.max, newValue));
                input.value = clampedValue;
                const changeEvent = new Event('change', { bubbles: true });
                input.dispatchEvent(changeEvent);
            }
        };

        document.addEventListener('mousemove', mouseMoveHandler);

        const mouseUpHandler = () => {
            isDragging = false;
            clickedElement.style.cursor = 'grab';
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mouseup', mouseUpHandler);

        isDragging = true;
    }
});

let lastSelectedElement = null;

pages.addEventListener('mousedown', function (event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('canvas-image') || clickedElement.classList.contains('canvas-text')) {
        if (lastSelectedElement && lastSelectedElement !== clickedElement) {
            lastSelectedElement.classList.remove('selected');
        }

        clickedElement.classList.add('selected');
        
        showCurrentProperties(clickedElement, clickedElement.classList.contains('canvas-text'));
        
        lastSelectedElement = clickedElement;
    }else{
        if (lastSelectedElement) {
            lastSelectedElement.classList.remove('selected');
            lastSelectedElement = null;

            properties.querySelectorAll('label').forEach(label => {
                label.style.opacity = '';
                label.style.pointerEvents = '';
            });
            
            document.querySelector('.delete-item-button').style.opacity = '';
            document.querySelector('.delete-item-button').style.pointerEvents = '';
        }
    }
});

const rgbToHex = (color) => {
    const rgba = color.match(/\d+/g);
    const [r, g, b] = rgba.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

function showCurrentProperties(item, isText) {
    
    let width = properties.querySelector('.width');
    let setWidth = properties.querySelector('.set-width');
    let height = properties.querySelector('.height');
    let setHeight = properties.querySelector('.set-height');
    let xCoordinate = properties.querySelector('.x-coordinate');
    let setX = properties.querySelector('.set-x');
    let yCoordinate = properties.querySelector('.y-coordinate');
    let setY = properties.querySelector('.set-y');
    let zCoordinate = properties.querySelector('.z-coordinate');
    let setZ = properties.querySelector('.set-z');
    let rotate = properties.querySelector('.rotate');
    let setRotate = properties.querySelector('.set-rotate');
    let opacity = properties.querySelector('.opacity');
    let setOpacity = properties.querySelector('.set-opacity');
    let fontSize = properties.querySelector('.font-size');
    let setFontSize = properties.querySelector('.set-font-size');
    let backgroundColor = properties.querySelector('.bg-color');
    let setBackgroundColor = properties.querySelector('.set-background-color');
    let setBackgroundTransparent = properties.querySelector('.set-background-transparent');
    let setTextColor = properties.querySelector('.set-text-color');
    let textColor = properties.querySelector('.text-color');
    let setTextTransparent = properties.querySelector('.set-text-transparent');

    function checkProperties(){

        width = properties.querySelector('.width');
        setWidth = properties.querySelector('.set-width');
        height = properties.querySelector('.height');
        setHeight = properties.querySelector('.set-height');
        xCoordinate = properties.querySelector('.x-coordinate');
        setX = properties.querySelector('.set-x');
        yCoordinate = properties.querySelector('.y-coordinate');
        setY = properties.querySelector('.set-y');
        zCoordinate = properties.querySelector('.z-coordinate');
        setZ = properties.querySelector('.set-z');
        rotate = properties.querySelector('.rotate');
        setRotate = properties.querySelector('.set-rotate');
        opacity = properties.querySelector('.opacity');
        setOpacity = properties.querySelector('.set-opacity');
        fontSize = properties.querySelector('.font-size');
        setFontSize = properties.querySelector('.set-font-size');
        backgroundColor = properties.querySelector('.bg-color');
        setBackgroundColor = properties.querySelector('.set-background-color');
        setBackgroundTransparent = properties.querySelector('.set-background-transparent');
        setTextColor = properties.querySelector('.set-text-color');
        textColor = properties.querySelector('.text-color');
        setTextTransparent = properties.querySelector('.set-text-transparent');

        setWidth.value = item.offsetWidth;
        setHeight.value = item.offsetHeight;
    
        setX.value = item.getAttribute('data-x');
        setY.value = item.getAttribute('data-y');
        setZ.value = window.getComputedStyle(item).zIndex;
    
    
        setOpacity.value = getComputedStyle(item).opacity * 100;
    
        const transform = getComputedStyle(item).transform;
        let rotation = 0;
    
        if (transform !== 'none') {
            const values = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
            const a = parseFloat(values[0]);
            const b = parseFloat(values[1]);
            rotation = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        setRotate.value = rotation;

        if(isText){
            setFontSize.value = parseFloat(getComputedStyle(item).fontSize);
            setTextColor.value = rgbToHex(getComputedStyle(item).color);
            setBackgroundColor.value = rgbToHex(getComputedStyle(item).backgroundColor);
        }
    }

    width.style.opacity = '1';
    width.style.pointerEvents = 'all';
    height.style.opacity = '1';
    height.style.pointerEvents = 'all';
    xCoordinate.style.opacity = '1';
    xCoordinate.style.pointerEvents = 'all';
    yCoordinate.style.opacity = '1';
    yCoordinate.style.pointerEvents = 'all';
    zCoordinate.style.opacity = '1';
    zCoordinate.style.pointerEvents = 'all';
    rotate.style.opacity = '1';
    rotate.style.pointerEvents = 'all';
    opacity.style.opacity = '1';
    opacity.style.pointerEvents = 'all';
    document.querySelector('.delete-item-button').style.opacity = '1';
    document.querySelector('.delete-item-button').style.pointerEvents = 'all';

    if (!isText) {
        fontSize.style.opacity = '0.6';
        fontSize.style.pointerEvents = 'none';
        textColor.style.opacity = '0.6';
        textColor.style.pointerEvents = 'none';
        backgroundColor.style.opacity = '0.6';
        backgroundColor.style.pointerEvents = 'none';
    } else {
        fontSize.style.opacity = '1';
        fontSize.style.pointerEvents = 'all';
        textColor.style.opacity = '1';
        textColor.style.pointerEvents = 'all';
        backgroundColor.style.opacity = '1';
        backgroundColor.style.pointerEvents = 'all';
    }

    checkProperties();

    function observeItemChanges(item, callback) {
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' || mutation.type === 'characterData') {
                    callback(mutation);
                }
            }
        });
    
        observer.observe(item, {
            attributes: true,
            characterData: true
        });

        
    }
        
    observeItemChanges(item, (mutation) => {
        if(item.classList.contains('selected')){
            checkProperties();
        }
    });

    const inputs = properties.querySelectorAll('input');
    inputs.forEach(input => {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);

        newInput.addEventListener('change', function (event){
            const input = event.target;
            switch (true) {
                case input.classList.contains('set-width'):
                    item.style.width = input.value + 'px';
                    break;
                case input.classList.contains('set-height'):
                    item.style.height = input.value + 'px';
                    break;
                case input.classList.contains('set-x'):
                    item.style.translate = `${input.value}px ${properties.querySelector('.set-y').value}px`;
                    item.setAttribute('data-x', input.value);
                    break;
                case input.classList.contains('set-y'):
                    item.style.translate = `${properties.querySelector('.set-x').value}px ${input.value}px `;
                    item.setAttribute('data-y', input.value);
                    break;
                case input.classList.contains('set-z'):
                    item.style.zIndex = input.value;
                    break;
                case input.classList.contains('set-rotate'):
                    item.style.transform = `rotate(${input.value}deg)`;
                    break;
                case input.classList.contains('set-opacity'):
                    item.style.opacity = input.value / 100;
                    break;
                case input.classList.contains('set-font-size'):
                    item.style.fontSize = input.value + 'px';
                    break;
                case input.classList.contains('set-text-color'):
                    item.style.color = input.value;
                    break;
                case input.classList.contains('set-background-color'):
                    item.style.backgroundColor = input.value;
                    break;
            }
        });
        newInput.addEventListener('input', function (event) {
            const input = event.target;
            switch (true) {
                case input.classList.contains('set-width'):
                    item.style.width = input.value + 'px';
                    break;
                case input.classList.contains('set-height'):
                    item.style.height = input.value + 'px';
                    break;
                case input.classList.contains('set-x'):
                    item.style.translate = `${input.value}px ${properties.querySelector('.set-y').value}px`;
                    item.setAttribute('data-x', input.value);
                    break;
                case input.classList.contains('set-y'):
                    item.style.translate = `${properties.querySelector('.set-x').value}px ${input.value}px `;
                    item.setAttribute('data-y', input.value);
                    break;
                case input.classList.contains('set-z'):
                    item.style.zIndex = input.value;
                    break;
                case input.classList.contains('set-rotate'):
                    item.style.transform = `rotate(${input.value}deg)`;
                    break;
                case input.classList.contains('set-opacity'):
                    item.style.opacity = input.value / 100;
                    break;
                case input.classList.contains('set-font-size'):
                    item.style.fontSize = input.value + 'px';
                    break;
                case input.classList.contains('set-text-color'):
                    item.style.color = input.value;
                    break;
                case input.classList.contains('set-background-color'):
                    item.style.backgroundColor = input.value;
                    break;
            }
        });
    });

    const propertiesPopup = document.querySelector('.properties-popup');
    const buttons = propertiesPopup.querySelectorAll('button');
    buttons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (event) {
            if(button.classList.contains('delete-item-button')){
                if(item){
                    item.remove();
                    lastSelectedElement = null;
                    properties.querySelectorAll('label').forEach(label => {
                        label.style.opacity = '';
                        label.style.pointerEvents = '';
                    });
                    
                    document.querySelector('.delete-item-button').style.opacity = '';
                    document.querySelector('.delete-item-button').style.pointerEvents = '';
                }
            }else if(button.classList.contains('set-text-transparent')){
                item.style.color = 'transparent';
            }else if(button.classList.contains('set-background-transparent')){
                item.style.backgroundColor = 'transparent';
            }
        });
    });
}
