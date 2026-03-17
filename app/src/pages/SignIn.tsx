import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { signIn } from "@/api/auth";
import { useAuth } from "@/hooks/api/useAuth";
import Modal from "@/components/Modal";

const styles = {
  container: css`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-secondary);
    padding: 20px;
  `,
  card: css`
    background: var(--color-bg-primary);
    border-radius: 16px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  `,
  header: css`
    text-align: center;
    margin-bottom: 36px;
  `,
  logo: css`
    width: 56px;
    height: 56px;
    background: var(--color-primary);
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 16px;
  `,
  title: css`
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 6px;
  `,
  subtitle: css`
    font-size: 14px;
    color: var(--color-text-secondary);
  `,
  form: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,
  field: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  label: css`
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
  `,
  input: css`
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--color-border);
    border-radius: 8px;
    font-size: 14px;
    color: var(--color-text-primary);
    background: var(--color-bg-primary);
    outline: none;
    transition: border-color 0.2s;
    &:focus {
      border-color: var(--color-primary);
    }
  `,
  inputError: css`
    border-color: var(--color-error);
  `,
  errorText: css`
    font-size: 12px;
    color: var(--color-error);
  `,
  submitButton: css`
    width: 100%;
    padding: 13px;
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    transition: background 0.2s;
    margin-top: 4px;
    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }
    &:disabled {
      background: var(--color-disabled);
      cursor: not-allowed;
    }
  `,
};

function validateEmail(email: string): string {
  if (!email) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "올바른 이메일 형식을 입력해주세요.";
  return "";
}

function validatePassword(password: string): string {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < 8 || password.length > 24)
    return "비밀번호는 8~24자여야 합니다.";
  if (!/^[A-Za-z0-9]+$/.test(password))
    return "비밀번호는 영문자와 숫자만 사용할 수 있습니다.";
  return "";
}

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn: authSignIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);
  const isValid = !emailErr && !passwordErr;

  const handleEmailBlur = useCallback(() => {
    setTouched((t) => ({ ...t, email: true }));
    setEmailError(validateEmail(email));
  }, [email]);

  const handlePasswordBlur = useCallback(() => {
    setTouched((t) => ({ ...t, password: true }));
    setPasswordError(validatePassword(password));
  }, [password]);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (touched.email) {
        setEmailError(validateEmail(e.target.value));
      }
    },
    [touched.email],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (touched.password) {
        setPasswordError(validatePassword(e.target.value));
      }
    },
    [touched.password],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const eErr = validateEmail(email);
      const pErr = validatePassword(password);
      setEmailError(eErr);
      setPasswordError(pErr);
      setTouched({ email: true, password: true });
      if (eErr || pErr) return;

      setIsSubmitting(true);
      try {
        const data = await signIn({ email, password });
        authSignIn(data.accessToken, data.refreshToken);
        navigate("/");
      } catch (err) {
        setModalMessage(
          err instanceof Error ? err.message : "로그인에 실패했습니다.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, authSignIn, navigate],
  );

  return (
    <div css={styles.container}>
      <div css={styles.card}>
        <div css={styles.header}>
          <div css={styles.logo}>KB</div>
          <h1 css={styles.title}>로그인</h1>
          <p css={styles.subtitle}>계정에 로그인하세요</p>
        </div>

        <form css={styles.form} onSubmit={handleSubmit} noValidate>
          <div css={styles.field}>
            <label css={styles.label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              css={[
                styles.input,
                touched.email && emailError && styles.inputError,
              ]}
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="example@email.com"
              autoComplete="email"
            />
            {touched.email && emailError && (
              <span css={styles.errorText}>{emailError}</span>
            )}
          </div>

          <div css={styles.field}>
            <label css={styles.label} htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              css={[
                styles.input,
                touched.password && passwordError && styles.inputError,
              ]}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              placeholder="8~24자의 영문자와 숫자"
              autoComplete="current-password"
            />
            {touched.password && passwordError && (
              <span css={styles.errorText}>{passwordError}</span>
            )}
          </div>

          <button
            type="submit"
            css={styles.submitButton}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>

      {modalMessage && (
        <Modal
          title="로그인 실패"
          message={modalMessage}
          onClose={() => setModalMessage(null)}
        />
      )}
    </div>
  );
}
