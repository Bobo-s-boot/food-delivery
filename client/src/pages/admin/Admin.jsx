import { AdminHeader } from "./components/AdminHeader";
import { AdminSectionContent } from "./AdminSectionContent";
import { adminNavItems } from "./admin.routes";
import { useLiveAdminWorkspace } from "./live/useLiveAdminWorkspace";
import "./Admin.scss";

export function Admin({ section = "dashboard" }) {
  const workspace = useLiveAdminWorkspace({ section });

  if (workspace.isLoading) {
    return (
      <div className="admin-layout__loading">Загрузка панели управления...</div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-layout__container">
        <div className="admin-layout__header-group">
          <AdminHeader navItems={adminNavItems} activeSection={section} />
        </div>

        <main
          className={
            section === "dashboard"
              ? "admin-layout__main-grid"
              : "admin-layout__main-full"
          }
        >
          <AdminSectionContent
            section={section}
            workspace={workspace}
          />
        </main>
      </div>
    </div>
  );
}
