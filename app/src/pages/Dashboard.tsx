import { ListTodo, ClipboardList, CheckCircle2 } from "lucide-react";
import { css } from "@emotion/react";
import { useDashboard } from "@/hooks/api/useDashboard";

const styles = {
  container: css`
    padding: 40px;
    max-width: 900px;
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
    margin-bottom: 36px;
  `,
  title: css`
    font-size: 26px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 6px;
  `,
  subtitle: css`
    font-size: 14px;
    color: var(--color-text-secondary);
  `,
  cards: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  `,
  card: css`
    background: var(--color-bg-primary);
    border-radius: 14px;
    padding: 28px 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-border);
    transition: box-shadow 0.2s;
    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
  `,
  iconWrap: css`
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  iconTotal: css`
    background: rgba(59, 130, 246, 0.12);
    color: var(--color-primary);
  `,
  iconRest: css`
    background: rgba(99, 102, 241, 0.12);
    color: var(--color-secondary);
  `,
  iconDone: css`
    background: rgba(16, 185, 129, 0.12);
    color: var(--color-success);
  `,
  cardContent: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  cardLabel: css`
    font-size: 13px;
    color: var(--color-text-secondary);
    font-weight: 500;
  `,
  cardValue: css`
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1;
  `,
};

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

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
        <div css={styles.error}>데이터를 불러오지 못했습니다.</div>
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h1 css={styles.title}>대시보드</h1>
        <p css={styles.subtitle}>태스크 현황을 확인하세요</p>
      </div>

      <div css={styles.cards}>
        <div css={styles.card}>
          <div css={[styles.iconWrap, styles.iconTotal]}>
            <ListTodo size={24} />
          </div>
          <div css={styles.cardContent}>
            <p css={styles.cardLabel}>전체 일</p>
            <p css={styles.cardValue}>{data.numOfTask}</p>
          </div>
        </div>

        <div css={styles.card}>
          <div css={[styles.iconWrap, styles.iconRest]}>
            <ClipboardList size={24} />
          </div>
          <div css={styles.cardContent}>
            <p css={styles.cardLabel}>해야할 일</p>
            <p css={styles.cardValue}>{data.numOfRestTask}</p>
          </div>
        </div>

        <div css={styles.card}>
          <div css={[styles.iconWrap, styles.iconDone]}>
            <CheckCircle2 size={24} />
          </div>
          <div css={styles.cardContent}>
            <p css={styles.cardLabel}>한 일</p>
            <p css={styles.cardValue}>{data.numOfDoneTask}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
