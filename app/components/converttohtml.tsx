export default function convertToLinks(text: string) {
    const urlRegex = /(\b(https?:\/\/|www\.)[^\s]+(\.[^\s]+)?\b)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-400 hover:underline">${url}</a>`;
    });
}