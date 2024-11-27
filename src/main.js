const norwegian = document.querySelector(".norwegian textarea")
const english = document.querySelector(".english textarea")
let activeBox = true

norwegian.addEventListener("focus", () => {
  activeBox = true
})

english.addEventListener("focus", () => {
  activeBox = false
})

norwegian.addEventListener("keyup", () => {
  if (activeBox) {
    translateText(norwegian.value, "en-US", english)
  }
})

english.addEventListener("keyup", () => {
  if (!activeBox) {
    translateText(english.value, "nb-NO", norwegian)
  }
})

document.querySelector(".norwegian img").addEventListener("click", () => {
  pronounceText(norwegian.value, 'nb-NO', 'nb-NO-Standard-A')
})

document.querySelector(".english img").addEventListener("click", () => {
  pronounceText(english.value, 'en-US', 'en-US-Standard-G')
})

function pronounceText(text, code, name) {
  const url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyDLb1jPc74B88K4bn2m0Gplk76bQ5ZkGjc';
  
  // Request body
  const requestData = {
    input: { text: text },
    voice: {
      languageCode: code,  // You can change this to any supported language code
      name: name  // Choose the voice (you can change this to another Wavenet voice)
    },
    audioConfig: {
      audioEncoding: 'MP3'  // You can choose other formats like OGG_OPUS
    }
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    const audioContent = data.audioContent;
    const audioPlayer = document.getElementById('audioPlayer');
    
    // Convert base64 audio content into a blob
    const audioBlob = new Blob([new Uint8Array(atob(audioContent).split("").map(c => c.charCodeAt(0)))], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Set the source of the audio player to the blob URL
    audioPlayer.src = audioUrl;
    audioPlayer.play();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Something went wrong.');
  });
}

async function translateText(text, targetLanguage, targetTextBox) {
  const apiKey = "AIzaSyDLb1jPc74B88K4bn2m0Gplk76bQ5ZkGjc"; // Replace with your Google API key
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const data = {
    q: text,
    target: targetLanguage,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.data && result.data.translations) {
      targetTextBox.value = result.data.translations[0].translatedText;
    } else {
      targetTextBox.value = "Error: Unable to translate.";
    }
  } catch (error) {
    console.error("Error:", error);
    targetTextBox.value = "Error: Something went wrong.";
  }
}