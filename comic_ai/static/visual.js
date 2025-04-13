
const messageBoxesButton = document.querySelector('.message-boxes-button');
const shapes = document.querySelector('.shapes-button');
const texts = document.querySelector('.texts-button');
const images = document.querySelector('.images-button');
const effects = document.querySelector('.effects-button');
const messageBoxesButtonIcon = document.querySelector('.message-boxes-button iconify-icon');
const shapesIcon = document.querySelector('.shapes-button iconify-icon');
const textsIcon = document.querySelector('.texts-button iconify-icon');
const imagesIcon = document.querySelector('.images-button iconify-icon');
const effectsIcon = document.querySelector('.effects-button iconify-icon');

messageBoxesButton.addEventListener('mouseover', () => {
    messageBoxesButtonIcon.setAttribute('icon', 'mingcute:message-2-fill');
});

messageBoxesButton.addEventListener('mouseout', () => {
    if (!messageBoxesButton.classList.contains('active-category')) {
        messageBoxesButtonIcon.setAttribute('icon', 'mingcute:message-2-line');
    }
});

shapes.addEventListener('mouseover', () => {
    shapesIcon.setAttribute('icon', 'material-symbols:shapes');
});

shapes.addEventListener('mouseout', () => {
    if (!shapes.classList.contains('active-category')) {
        shapesIcon.setAttribute('icon', 'material-symbols:shapes-outline');
    }
});

texts.addEventListener('mouseover', () => {
    textsIcon.setAttribute('icon', 'icon-park-solid:text');
});

texts.addEventListener('mouseout', () => {
    if (!texts.classList.contains('active-category')) {
        textsIcon.setAttribute('icon', 'icon-park-outline:text');
    }
});

images.addEventListener('mouseover', () => {
    imagesIcon.setAttribute('icon', 'fluent:image-multiple-32-filled');
});

images.addEventListener('mouseout', () => {
    if (!images.classList.contains('active-category')) {
        imagesIcon.setAttribute('icon', 'fluent:image-multiple-32-regular');
    }
});

effects.addEventListener('mouseover', () => {
    effectsIcon.setAttribute('icon', 'icon-park-solid:effects');
});

effects.addEventListener('mouseout', () => {
    if (!effects.classList.contains('active-category')) {
        effectsIcon.setAttribute('icon', 'icon-park-outline:effects');
    }
});

function resetCategories(){
    if(document.querySelector('.active-category')){
        document.querySelector('.active-category').classList.remove('active-category');
    }
    messageBoxesButtonIcon.setAttribute('icon', 'mingcute:message-2-line');
    shapesIcon.setAttribute('icon', 'material-symbols:shapes-outline');
    textsIcon.setAttribute('icon', 'icon-park-outline:text');
    imagesIcon.setAttribute('icon', 'fluent:image-multiple-32-regular');
    effectsIcon.setAttribute('icon', 'icon-park-outline:effects');
}

function openCategory(feature){
    if(document.querySelector('.active')){
        document.querySelector('.active').classList.remove('active');
    }
    const category = document.querySelector(feature);
    category.classList.add('active');
}

messageBoxesButton.addEventListener('click', () => {
    if(messageBoxesButton.classList.contains('active-category')){
        resetCategories();
        document.querySelector('.active').classList.remove('active');
    }else{
        resetCategories();
        messageBoxesButton.classList.add('active-category');
        messageBoxesButtonIcon.setAttribute('icon', 'mingcute:message-2-fill');
        openCategory(".message-boxes");
    }
});

shapes.addEventListener('click', () => {
    if(shapes.classList.contains('active-category')){
        resetCategories();
        document.querySelector('.active').classList.remove('active');
    }else{
        resetCategories();
        shapes.classList.add('active-category');
        shapesIcon.setAttribute('icon', 'material-symbols:shapes');
        openCategory(".shapes");
    }
});

texts.addEventListener('click', () => {
    if(texts.classList.contains('active-category')){
        resetCategories();
        document.querySelector('.active').classList.remove('active');
    }else{
        resetCategories();
        texts.classList.add('active-category');
        textsIcon.setAttribute('icon', 'icon-park-solid:text');
        openCategory(".texts");
    }
});

images.addEventListener('click', () => {
    if(images.classList.contains('active-category')){
        resetCategories();
        document.querySelector('.active').classList.remove('active');
    }else{
        resetCategories();
        images.classList.add('active-category');
        imagesIcon.setAttribute('icon', 'fluent:image-multiple-32-regular');
        openCategory(".images");
    }
});

effects.addEventListener('click', () => {
    if(effects.classList.contains('active-category')){
        resetCategories();
        document.querySelector('.active').classList.remove('active');
    }else{
        resetCategories();
        effects.classList.add('active-category');
        effectsIcon.setAttribute('icon', 'icon-park-solid:effects');
        openCategory(".effects");
    }
});

// document.addEventListener('click', function(event) {
//     if (event.target.classList.contains('active-category')) {
//         resetCategories();
//     }
// });
  
  

// if (isCorner) {
//     if (newWidth / newHeight > aspectRatio) {
//         newWidth = newHeight * aspectRatio;
//     } else {
//         newHeight = newWidth / aspectRatio;
//     }
// }
