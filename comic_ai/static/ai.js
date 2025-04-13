let generatingImage = false;

const input = document.querySelector('.prompt');

input.addEventListener('input', function(){
    if(input.value.length == 0){
        disableButton();
    }else if(!generatingImage){
        enableButton();
    }
})

function disableButton(){
    const button = document.querySelector('.send-button');
    button.disabled = true;
    button.querySelector('iconify-icon').style.color = '#adadad';
    button.style.pointerEvents = 'none';
}

function enableButton(){
    const button = document.querySelector('.send-button');
    button.disabled = false;
    button.querySelector('iconify-icon').style.color = '#fff';
    button.style.pointerEvents = 'all';
}

disableButton();


document.querySelector('.prompt-section').addEventListener('submit', async function(event) {
    event.preventDefault();
    disableButton();
    generatingImage = true;    

    const prompt = document.getElementById('user_input').value;
    document.getElementById('user_input').value = '';

    const resolution = document.querySelector('input[name="image-aspect-ratio"]:checked').value;

    const chat = document.querySelector('.chat');

    //user bubble
    const createUserBubble = document.createElement('div');
    createUserBubble.classList.add('user-bubble');
    // const createPromptText = document.createElement('h1');
    // createPromptText.textContent = prompt;
    // createUserBubble.appendChild(createPromptText);
    // const createUserLogo = document.createElement('img');
    // createUserLogo.src = "comic_ai/static/src/user-logo.png";
    // createUserLogo.classList.add('user-logo');
    // createUserBubble.appendChild(createUserLogo);
    createUserBubble.innerHTML = `<p>${prompt}</p><img class="user-logo" src="/static/src/user-logo.png">`
    chat.appendChild(createUserBubble);

    //ai bubble
    const createAiBubble = document.createElement('div');
    createAiBubble.classList.add('ai-bubble');
    createAiBubble.innerHTML = `<img class="ai-logo" src=/static/src/ai-logo.png><p>Here is your request!</p>`;
    const createLoader = document.createElement('div');
    createLoader.classList.add('loader');
    createLoader.innerHTML = '<div class="progress"><div>';
    chat.appendChild(createAiBubble);
    chat.appendChild(createLoader);

    try{
        // AJAX isteği gönder
        const response = await fetch('/comic/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                prompt: prompt,
                "image-aspect-ratio": resolution
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error: ${response.status}. Details: ${errorText}`);
        }

        const data = await response.json();

        const createDiv = document.createElement('div');
        createDiv.classList.add('generated-image-div');
        const createImage = document.createElement('img');
        createImage.src = `data:image/png;base64,${data.image_data}`;
        createImage.classList.add('generated-image');
        createImage.classList.add('item');
        createLoader.remove();
        chat.appendChild(createDiv);
        createDiv.appendChild(createImage);

        generatingImage = false;
        enableButton();
    }catch(error){

        createLoader.remove();
        createAiBubble.classList.add('error-bubble');
        createAiBubble.innerHTML = `<img class="ai-logo" src=/static/src/ai-logo.png><p>An error occurred while generating the image. Please try again later.</p>`;

        generatingImage = false;
        enableButton();
    }
});
