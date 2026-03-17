import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, CheckSquare, User, LogIn } from "lucide-react";
import { css } from "@emotion/react";
import { useAuth } from "@/hooks/api/useAuth";

const styles = {
  layout: css`
    display: flex;
    height: 100vh;
    width: 100%;
  `,
  sidebar: css`
    width: 64px;
    background: var(--color-bg-nav);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    flex-shrink: 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
  `,
  logo: css`
    width: 40px;
    height: 40px;
    background: var(--color-primary);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  `,
  logoText: css`
    color: #fff;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.5px;
  `,
  navList: css`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  `,
  navItem: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.55);
    transition: all 0.2s;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    &.active {
      background: rgba(59, 130, 246, 0.25);
      color: var(--color-primary);
    }
  `,
  bottomNav: css`
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  main: css`
    flex: 1;
    margin-left: 64px;
    overflow-y: auto;
    background: var(--color-bg-secondary);
  `,
};

export default function AppLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <div css={styles.layout}>
      <nav css={styles.sidebar}>
        <div css={styles.logo}>
          <span css={styles.logoText}>KB</span>
        </div>

        <ul css={styles.navList}>
          <li>
            <NavLink
              to="/"
              end
              css={styles.navItem}
              className={({ isActive }) => (isActive ? "active" : "")}
              title="대시보드"
            >
              <LayoutDashboard size={22} />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/task"
              css={styles.navItem}
              className={({ isActive }) => (isActive ? "active" : "")}
              title="태스크"
            >
              <CheckSquare size={22} />
            </NavLink>
          </li>
        </ul>

        <div css={styles.bottomNav}>
          {isLoggedIn ? (
            <NavLink
              to="/user"
              css={styles.navItem}
              className={({ isActive }) => (isActive ? "active" : "")}
              title="사용자 프로필"
            >
              <User size={22} />
            </NavLink>
          ) : (
            <NavLink
              to="/sign-in"
              css={styles.navItem}
              className={({ isActive }) => (isActive ? "active" : "")}
              title="로그인"
            >
              <LogIn size={22} />
            </NavLink>
          )}
        </div>
      </nav>

      <main css={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
