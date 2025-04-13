
// let stickyElement = document.querySelector('.page-settings');
// let page = document.querySelector('.page');

window.onload = function(){
    if(!document.querySelector('.page')){
        addPage();
    }
};


function deletePage(page){
    page.remove();
}

function movePageUp(page) {
    const previousPage = page.previousElementSibling;
    if (previousPage) {
        page.parentElement.insertBefore(page, previousPage);
    }
}

function movePageDown(page) {
    const nextPage = page.nextElementSibling;
    if (nextPage) {
        page.parentElement.insertBefore(nextPage, page);
    }
}

function editPage(page){
    document.querySelector('.page-settings-popup').style.display = 'flex';
}

function closeEditPage(page){
    document.querySelector('.page-settings-popup').style.display = 'none';
}