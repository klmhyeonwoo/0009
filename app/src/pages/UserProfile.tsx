import { User } from "lucide-react";
import { css } from "@emotion/react";
import { useUser } from "@/hooks/api/useUser";

const styles = {
  container: css`
    padding: 40px;
    max-width: 700px;
  `,
  loading: css`
    font-size: 15px;
    color: var(--color-text-secondary);
    padding: 40px 0;
  `,
  error: css`
    font-size: 15px;
    color: var(--color-error);
    padding: 40px 0;
  `,
  header: css`
    margin-bottom: 28px;
  `,
  title: css`
    font-size: 26px;
    font-weight: 700;
    color: var(--color-text-primary);
  `,
  card: css`
    background: var(--color-bg-primary);
    border-radius: 14px;
    padding: 36px;
    display: flex;
    align-items: flex-start;
    gap: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-border);
  `,
  avatar: css`
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.12);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  info: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  name: css`
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
  `,
  memo: css`
    font-size: 15px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  `,
};

export default function UserProfile() {
  const { data, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div css={styles.container}>
        <div css={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div css={styles.container}>
        <div css={styles.error}>사용자 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h1 css={styles.title}>사용자 프로필</h1>
      </div>

      <div css={styles.card}>
        <div css={styles.avatar}>
          <User size={36} />
        </div>
        <div css={styles.info}>
          <h2 css={styles.name}>{data.name}</h2>
          <p css={styles.memo}>{data.memo}</p>
        </div>
      </div>
    </div>
  );
}
