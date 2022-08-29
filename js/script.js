// interface com as vozes que o sistema suporta
const synth = window.speechSynthesis;

const txtArea = document.querySelector('#your_text');
const iconSpeaker = document.querySelector('#icon_speaker');
const iconMic = document.querySelector('#icon_mic');
const iconStop = document.querySelector('#icon_stop');
const msgStatusVoice = document.querySelector('#status_msg');
const selAvailableVoices = document.querySelector('#available_voices');

// habilitando tooltips do bootstrap
const tooltipsTrigger = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipsTrigger].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// ao passar o mouse nos ícones de áudio, o cursor é alterado
document.querySelector('.icons').style.cursor = 'pointer';

iconStop.style.display = msgStatusVoice.style.display = 'none';
iconMic.style.display = 'block';

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

// vozes disponíveis no sistema
const getAvailableVoices = () => {
    
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

const rec = new webkitSpeechRecognition();

saySomething = () => {
    
    rec.continuous = true;    
    rec.start();

    rec.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {

            let content = e.results[i][0].transcript.trim();
            let arrContent = [];
            // tudo que foi dito é aramazenado num array p/ ser escrito sequencialmente no txt área
            arrContent.push(content);
            // no final de cada frase, há um ponto final
            arrContent += '. ';

            if (e.results[i].isFinal)
                txtArea.textContent += arrContent;
            
            console.log(content);
            console.log(arrContent);
        }
    }
}

stopRecognitionVoice = () => {
    console.log('O reconhecimento de voz foi parado');
    
    setMsgStatusVoiceVisibility();
    setIconStopVisibility();
    setIconMicrophoneVisibility();
    rec.stop();    
}

setVoiceStatus = () => {
    console.log('Mudando o status da mensagem...');
    
    setMsgStatusVoiceVisibility();
    setIconStopVisibility();
}

setIconStopVisibility = () => {

    if(iconStop.style.display == 'block')
        iconStop.style.display = 'none';
    else
        iconStop.style.display = 'block';
}

setIconMicrophoneVisibility = () => {

    if(iconMic.style.display == 'block')
        iconMic.style.display = 'none'
    else
        iconMic.style.display = 'block';
}

setMsgStatusVoiceVisibility = () => {

    if(msgStatusVoice.style.display == 'block')
        msgStatusVoice.style.display = 'none';
    else
        msgStatusVoice.style.display = 'block';
}

iconSpeaker.addEventListener('click', () => {
    readText();
});

iconMic.addEventListener('click', () => {
    saySomething();
    setIconMicrophoneVisibility();
    setIconStopVisibility();
    setVoiceStatus();
});

iconStop.addEventListener('click', () => {
    stopRecognitionVoice();
});

// gravando áudio do microfone
rec.onstart = () => {
    setIconStopVisibility();
    msgStatusVoice.innerHTML = 'Ouvindo...';
}

// quando a gravação é encerrada
rec.onspeechend = () => {
    iconStop.style.display = 'none';
    msgStatusVoice.innerHTML = '';
}