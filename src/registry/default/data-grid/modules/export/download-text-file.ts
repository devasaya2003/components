export function downloadTextFile(input: {
  filename: string;
  mimeType: string;
  contents: string;
}) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + input.contents], { type: input.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = input.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
