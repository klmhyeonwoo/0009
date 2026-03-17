import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';

const styles = {
  container: css`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
  `,
  content: css`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  `,
  code: css`
    font-size: 80px;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
  `,
  message: css`
    font-size: 20px;
    font-weight: 500;
    color: var(--color-text-secondary);
  `,
  button: css`
    margin-top: 8px;
    padding: 12px 28px;
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    transition: background 0.2s;
    &:hover {
      background: var(--color-primary-hover);
    }
  `,
};

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div css={styles.container}>
      <div css={styles.content}>
        <h1 css={styles.code}>404</h1>
        <p css={styles.message}>페이지를 찾을 수 없습니다</p>
        <button css={styles.button} onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
