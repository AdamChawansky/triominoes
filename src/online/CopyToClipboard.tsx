import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

export function CopyToClipboard(props: {
  toCopy: string;
}) {
  const {copied, copyToClipboard} = useCopyToClipboard();
  return (
    <div
      style={{
        cursor: copied ? 'not-allowed' : 'pointer',
        fontSize: copied ? '1rem' : '1.5rem',
        width: '150px',
      }}
      onClick={() => !copied && copyToClipboard("https://adamchawansky.github.io/triominoes/?gameID=" + props.toCopy)}
    >
      {copied ? 'copied to clipboard!' : '🔗: ' + props.toCopy}
    </div>
  )
}