// interface com as vozes que o sistema suporta
const synth = window.speechSynthesis;

const txtArea = document.querySelector('#your_text');
const iconSpeaker = document.querySelector('#icon_speaker');
const selAvailableVoices = document.querySelector('#available_voices');

// habilitando tooltips do bootstrap
const tooltipsTrigger = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipsTrigger].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// ao passar o mouse nos ícones de áudio, o cursor é alterado
document.querySelector('.icons').style.cursor = 'pointer';

window.onload = () => {
    listAvailableVoices();
}

const listAvailableVoices = () => {

    let availableVoices = getAvailableVoices();

    // populando o select com as opções de vozes disponíveis
    for(let i=0; i < availableVoices.length; i++) {
        let optVoice = availableVoices[i];
        let elOption = document.createElement('option');

        elOption.textContent = optVoice['name'];
        elOption.value = optVoice['lang'];

        selAvailableVoices.appendChild(elOption);
        console.log(optVoice)
    }
}

const getAvailableVoices = () => {
    // vozes disponíveis no sistema
    const availableVoices = synth.getVoices();
    return availableVoices;
}

readText = () => {
    // posssibilita que o valor digitado no txt área seja lido pelo sistema
    const textToRead = new SpeechSynthesisUtterance(txtArea.value);
    const selectedVoice = selAvailableVoices.options[selAvailableVoices.selectedIndex].text;

    let availableVoices = getAvailableVoices();

    console.log(textToRead)

    // faz a troca do idioma, ao selecionar uma opção no select
    availableVoices.forEach(el => {
        if(el.name === selectedVoice)
            textToRead.voice = el;
    });

    // lê o conteúdo digitado
    synth.speak(textToRead);
}

iconSpeaker.addEventListener('click', () => {
    readText();
});
