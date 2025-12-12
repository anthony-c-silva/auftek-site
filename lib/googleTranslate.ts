export async function googleTranslate(text: string, targetLang: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY;

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: "text"
      })
    }
  );

  const json = await res.json();

  if (!json.data) {
    console.error("Erro na tradução:", json);
    return text;
  }

  return json.data.translations[0].translatedText;
}
