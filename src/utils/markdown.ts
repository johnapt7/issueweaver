
import MarkdownIt from "markdown-it";

export const md = new MarkdownIt();

export const insertText = (
  text: string,
  textArea: HTMLTextAreaElement | null,
  before: string,
  after: string = ""
): string => {
  if (!textArea) return text;

  const start = textArea.selectionStart;
  const end = textArea.selectionEnd;
  const selectedText = text.substring(start, end);
  const newText = text.substring(0, start) + 
                 before + selectedText + after + 
                 text.substring(end);
  
  // Restore cursor position
  setTimeout(() => {
    textArea.focus();
    textArea.setSelectionRange(
      start + before.length,
      end + before.length
    );
  }, 0);

  return newText;
};
