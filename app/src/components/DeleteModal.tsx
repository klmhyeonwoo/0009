import { useState, useEffect } from 'react';
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
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,
  title: css`
    font-size: 18px;
    font-weight: 700;
    color: var(--color-danger);
  `,
  message: css`
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.6;
    strong {
      color: var(--color-text-primary);
      font-weight: 600;
    }
  `,
  input: css`
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--color-border);
    border-radius: 8px;
    font-size: 14px;
    color: var(--color-text-primary);
    outline: none;
    transition: border-color 0.2s;
    &:focus {
      border-color: var(--color-danger);
    }
  `,
  actions: css`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  `,
  cancelButton: css`
    padding: 10px 20px;
    border: 1.5px solid var(--color-border);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-secondary);
    background: var(--color-bg-primary);
    transition: all 0.2s;
    &:hover:not(:disabled) {
      background: var(--color-bg-secondary);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  deleteButton: css`
    padding: 10px 20px;
    background: var(--color-danger);
    color: var(--color-text-on-primary);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.2s;
    &:hover:not(:disabled) {
      background: var(--color-danger-hover);
    }
    &:disabled {
      background: var(--color-disabled);
      cursor: not-allowed;
    }
  `,
};

interface DeleteModalProps {
  taskId: string | number;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting?: boolean;
}

export default function DeleteModal({ taskId, onConfirm, onClose, isDeleting }: DeleteModalProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const idString = String(taskId);
  const isMatch = inputValue === idString;

  return (
    <div css={styles.overlay} onClick={onClose}>
      <div css={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 css={styles.title}>태스크 삭제</h3>
        <p css={styles.message}>
          이 작업은 되돌릴 수 없습니다. 삭제하려면 태스크 ID (<strong>{idString}</strong>)를 입력해주세요.
        </p>
        <input
          css={styles.input}
          type="text"
          placeholder={`태스크 ID를 입력하세요 (${idString})`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <div css={styles.actions}>
          <button css={styles.cancelButton} onClick={onClose} disabled={isDeleting}>
            취소
          </button>
          <button
            css={styles.deleteButton}
            onClick={onConfirm}
            disabled={!isMatch || isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
