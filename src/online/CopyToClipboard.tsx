import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import styles from '../online/CopyToClipboard.module.css';

export function CopyToClipboard(props: {
  toCopy: string;
}) {
  const {copied, copyToClipboard} = useCopyToClipboard();
  return (
    <div
      className={styles.Copy}
      style={{
        cursor: copied ? 'not-allowed' : 'pointer',
        fontSize: copied ? '1rem' : '2rem',
      }}
      onClick={() => !copied && copyToClipboard(props.toCopy)}
    >
      {copied ? 'copied to clipboard!' : '🔗'}
    </div>
  )
}