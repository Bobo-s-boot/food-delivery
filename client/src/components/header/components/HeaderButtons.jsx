import handbagIcon from "../../../assets/handbag.svg";
import userIcon from "../../../assets/user.svg";

export function HeaderButtons({
  totals,
  openCart,
  user,
  onLogin,
  onLogout,
  translate,
}) {
  return (
    <div className="header__buttons">
      <button
        type="button"
        onClick={openCart}
        className="header__ghost-button"
        aria-label="Open cart"
      >
        <img src={handbagIcon} alt="Shop" className="header__icon" />
        {totals.itemCount > 0 && (
          <span className="header__cart-badge">{totals.itemCount}</span>
        )}
      </button>

      <button
        type="button"
        onClick={user ? onLogout : onLogin}
        className="header__ghost-button"
        title={
          user
            ? `${translate("nav.logout")} (${user.username})`
            : translate("nav.login")
        }
      >
        <img
          src={userIcon}
          alt={user ? translate("nav.logout") : translate("nav.login")}
          className="header__icon"
        />
      </button>
    </div>
  );
}
