import { AdminHeader } from "./components/AdminHeader";
import { AdminSectionContent } from "./AdminSectionContent";
import { adminNavItems } from "./admin.routes";
import { useLiveAdminWorkspace } from "./live/useLiveAdminWorkspace";
import "./Admin.scss";

export function Admin({ section = "dashboard", previewMode = false }) {
  const workspace = useLiveAdminWorkspace({ section, previewMode });

  if (workspace.isLoading && !previewMode) {
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
            previewMode={previewMode}
            workspace={workspace}
          />
        </main>
      </div>
    </div>
  );
}
