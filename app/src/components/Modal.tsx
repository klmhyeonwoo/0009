import { useEffect } from 'react';
import { css } from '@emotion/react';

const styles = {
  overlay: css`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `,
  modal: css`
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  title: css`
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text-primary);
  `,
  message: css`
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  `,
  button: css`
    align-self: flex-end;
    padding: 10px 24px;
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.2s;
    &:hover {
      background: var(--color-primary-hover);
    }
  `,
};

interface ModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

export default function Modal({ title = '알림', message, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div css={styles.overlay} onClick={onClose}>
      <div css={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 css={styles.title}>{title}</h3>
        <p css={styles.message}>{message}</p>
        <button css={styles.button} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
