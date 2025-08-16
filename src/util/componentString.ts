
export const classIdent = "indent-5 text-justify"
export const identParagraph = (text: string) => text.replaceAll('<p>', `<p class="${classIdent}">`)