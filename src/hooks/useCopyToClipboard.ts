import { useState } from "react";

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    await sleep(2000);
    setCopied(false);
  }

  return {
    copied,
    copyToClipboard,
  };
}