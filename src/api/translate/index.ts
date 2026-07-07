export interface TranslateParams {
  q: string;
  source: string;
  target: string;
}

export const translateText = async (
  params: TranslateParams,
): Promise<string> => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    params.q,
  )}&langpair=${params.source}|${params.target}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Translation request failed");

  const data = await res.json();
  const text = data?.responseData?.translatedText;
  if (!text) throw new Error("No translation returned");

  return text as string;
};
