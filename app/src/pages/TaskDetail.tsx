import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { css } from "@emotion/react";
import { deleteTask } from "@/api/task";
import DeleteModal from "@/components/DeleteModal";
import { useTaskDetail } from "@/hooks/api/useTaskDetail";

const styles = {
  container: css`
    padding: 40px;
    max-width: 800px;
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
  notFound: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 80px 0;
  `,
  notFoundText: css`
    font-size: 18px;
    color: var(--color-text-secondary);
    font-weight: 500;
  `,
  backButton: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
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
  topBar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  `,
  backBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--color-text-secondary);
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s;
    &:hover {
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
    }
  `,
  deleteBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--color-danger);
    font-weight: 500;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1.5px solid var(--color-danger);
    transition: all 0.2s;
    &:hover {
      background: var(--color-danger);
      color: #fff;
    }
  `,
  card: css`
    background: var(--color-bg-primary);
    border-radius: 14px;
    padding: 36px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-border);
  `,
  title: css`
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  `,
  date: css`
    font-size: 13px;
    color: var(--color-text-secondary);
  `,
  divider: css`
    height: 1px;
    background: var(--color-border);
    margin: 24px 0;
  `,
  memo: css`
    font-size: 15px;
    color: var(--color-text-primary);
    line-height: 1.7;
    white-space: pre-wrap;
  `,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError } = useTaskDetail(id);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteTask(id);
      navigate("/task");
    } catch (err) {
      console.error("Delete failed:", err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div css={styles.container}>
        <div css={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div css={styles.container}>
        <div css={styles.notFound}>
          <p css={styles.notFoundText}>리소스를 찾을 수 없습니다</p>
          <button css={styles.backButton} onClick={() => navigate("/task")}>
            <ArrowLeft size={16} />
            목록으로 돌아가기
          </button>
        </div>
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
      <div css={styles.topBar}>
        <button css={styles.backBtn} onClick={() => navigate("/task")}>
          <ArrowLeft size={18} />
          목록으로
        </button>
        <button css={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
          <Trash2 size={16} />
          삭제
        </button>
      </div>

      <div css={styles.card}>
        <h1 css={styles.title}>{data.title}</h1>
        <p css={styles.date}>{formatDate(data.registerDatetime)}</p>
        <div css={styles.divider} />
        <p css={styles.memo}>{data.memo}</p>
      </div>

      {showDeleteModal && id && (
        <DeleteModal
          taskId={id}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
