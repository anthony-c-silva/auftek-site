export function calculateReadingTime(htmlContent: string): number {
    if (!htmlContent) return 1;

    const text = htmlContent.replace(/<[^>]+>/g, ' ');
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const wordCount = cleanText.split(' ').length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes > 0 ? minutes : 1;
}