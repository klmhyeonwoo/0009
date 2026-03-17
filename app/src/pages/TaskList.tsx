import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import { css } from "@emotion/react";
import { useTaskList } from "@/hooks/api/useTaskList";

const styles = {
  container: css`
    padding: 40px;
    max-width: 800px;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  header: css`
    margin-bottom: 24px;
    flex-shrink: 0;
  `,
  title: css`
    font-size: 26px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 4px;
  `,
  subtitle: css`
    font-size: 13px;
    color: var(--color-text-secondary);
  `,
  listContainer: css`
    flex: 1;
    height: calc(100vh - 160px);
    overflow-y: auto;
  `,
  card: css`
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 18px 20px;
    cursor: pointer;
    border: 1px solid var(--color-border);
    height: 108px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition:
      box-shadow 0.2s,
      border-color 0.2s;
    overflow: hidden;
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border-color: var(--color-primary);
    }
  `,
  cardTop: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  `,
  cardTitle: css`
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  badge: css`
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    flex-shrink: 0;
  `,
  badgeTodo: css`
    background: rgba(99, 102, 241, 0.12);
    color: var(--color-secondary);
  `,
  badgeDone: css`
    background: rgba(16, 185, 129, 0.12);
    color: var(--color-success);
  `,
  cardMemo: css`
    font-size: 13px;
    color: var(--color-text-secondary);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  `,
  loader: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 13px;
    color: var(--color-text-secondary);
  `,
  error: css`
    font-size: 15px;
    color: var(--color-error);
    padding: 20px 0;
  `,
};

export default function TaskList() {
  const navigate = useNavigate();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTaskList();

  const tasks = data?.pages.flatMap((page) => page.data) ?? [];

  const containerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => containerRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (virtualItems.length === 0) return;
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem.index >= tasks.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    tasks.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  if (isLoading) {
    return (
      <div css={styles.container}>
        <div css={styles.header}>
          <h1 css={styles.title}>태스크</h1>
        </div>
        <div css={styles.loader}>로딩 중...</div>
      </div>
    );
  }

  if (isError && tasks.length === 0) {
    return (
      <div css={styles.container}>
        <div css={styles.header}>
          <h1 css={styles.title}>태스크</h1>
        </div>
        <div css={styles.error}>데이터를 불러오지 못했습니다.</div>
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h1 css={styles.title}>태스크</h1>
        <p css={styles.subtitle}>총 {tasks.length}개의 태스크</p>
      </div>

      <div css={styles.listContainer} ref={containerRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const task = tasks[virtualRow.index];
            const isLoaderRow = virtualRow.index >= tasks.length;

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: "0 0 12px 0",
                }}
              >
                {isLoaderRow ? (
                  <div css={styles.loader}>
                    {isFetchingNextPage ? "로딩 중..." : ""}
                  </div>
                ) : task ? (
                  <div
                    css={styles.card}
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    <div css={styles.cardTop}>
                      <h3 css={styles.cardTitle}>{task.title}</h3>
                      <span
                        css={[
                          styles.badge,
                          task.status === "DONE"
                            ? styles.badgeDone
                            : styles.badgeTodo,
                        ]}
                      >
                        {task.status === "DONE" ? "완료" : "진행 중"}
                      </span>
                    </div>
                    <p css={styles.cardMemo}>{task.memo}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
