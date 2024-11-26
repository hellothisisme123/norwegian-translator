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
    translateText(english.value, "no", norwegian)
  }
})

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