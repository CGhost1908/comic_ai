
document.addEventListener('mouseover', function(event) {
    if (event.target.classList.contains('canvas-image')){
        showSettings(event.target);
    }
});

document.addEventListener('mouseout', function(event) {
    if (event.target.classList.contains('canvas-image')){
        hideSettings(event.target);
    }
});

const itemSettings = document.querySelector('.item-settings');
function showSettings(item){
    // const itemRect = item.getBoundingClientRect();

    // itemSettings.style.top = `${itemRect.top - itemSettings.offsetHeight}px`;
    // itemSettings.style.left = `${itemRect.left}px`;
    item.appendChild(itemSettings);

}

function hideSettings(){
    // itemSettings.style.display = 'none';
}
