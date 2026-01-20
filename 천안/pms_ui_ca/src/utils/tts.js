export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.voice = voices.find(voice => voice.lang === 'ko-KR')
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = function () {
      // console.log('Speech started: ', event.target.text)
    }

    utterance.onend = function () {
      // console.log('Speech ended')
    }

    utterance.onerror = function () {
    }

    speechSynthesis.speak(utterance)
    // console.log('TTS: ', text)
  } else {
    alert('Sorry, your browser does not support text-to-speech.')
  }
}
