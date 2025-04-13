function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const callback = (mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'style')) {
            const target = mutation.target;
            const computedStyle = window.getComputedStyle(target);
            
            if (mutation.type === 'childList' || computedStyle.transform !== 'none') {
                debouncedCopyPageElements();
            }
        }
    });
};

const debouncedCopyPageElements = debounce(() => {
    copyPageElements();
}, 100);

const observer = new MutationObserver(callback);
const config = { 
    attributes: true,
    childList: true,
    subtree: true
};

observer.observe(pages, config);


async function copyPageElements() {
    const pageClones = document.querySelector('.page-clones');
    //const pages = document.querySelector('.pages');

    //united
    // domtoimage.toPng(pages)
    //     .then(function (dataUrl) {
    //         if (pageClones.firstChild) {
    //             pageClones.firstChild.remove();
    //         }

    //         const img = new Image();
    //         img.src = dataUrl;
    //         img.style.width = "100%";
    //         img.style.height = "auto";

    //         pageClones.appendChild(img);
    //     })


    //seperate
    let images = [];
    const pages = document.querySelectorAll('.page');
    for (const page of pages) {
        const pageSettings = page.querySelector('.page-settings');
        pageSettings.style.visibility = 'hidden';

        const dataUrl = await domtoimage.toPng(page);
        img = new Image();
        img.src = dataUrl;
        img.classList.add('page-clone');
        images.push(img);

        if (pageSettings) {
            pageSettings.style.visibility = '';
        }
    }

    Array.from(pageClones.children).forEach(oldPage => {
        oldPage.remove();
    });

    images.forEach(img => {
        pageClones.appendChild(img);
    });}

copyPageElements()