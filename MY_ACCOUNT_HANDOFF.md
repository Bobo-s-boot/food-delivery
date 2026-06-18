# Defilicious My Account Handoff

Short context file for the next AI/developer. This describes the current My Account implementation and the UX rules that should be preserved.

## Entry Point

- Page URL in dev: `http://localhost:5173/#/my-account`
- Router path: `/my-account` with the existing `HashRouter`.
- Main page: `client/src/pages/account/Account.jsx`
- Main styles: `client/src/pages/account/Account.scss`
- Mock data: `client/src/pages/account/const.js`
- Helpers/tests: `client/src/pages/account/accountUtils.js`, `client/src/pages/account/accountUtils.test.js`
- Section components: `client/src/pages/account/components/`

## Global Behavior

- The account page uses local React state tabs, not nested routes.
- Sections: `dashboard`, `orders`, `favorites`, `addresses`, `payments`, `settings`, `support`.
- Sidebar switches sections with `setActiveSection`.
- Header profile icon is the only main entry point:
  - if `localStorage.user` exists, it goes to `/my-account`;
  - if not, it goes to `/auth`.
- Account is not added to the top navigation menu.
- Logout is inside the account sidebar and opens a confirmation modal.
- Delete Account opens a dangerous confirmation modal only. No backend delete is implemented.
- First version is mock frontend data only. No backend schema/API changes.

## Cart And Reorder Logic

- Reorder, Order again, and Try again use the existing cart context `addItem`.
- These actions only add items to the cart flow. They must never place an order immediately.
- Buttons inside clickable cards must use `event.stopPropagation()` so the parent card click does not also open details.

## Sidebar

- Profile block is horizontal:
  - DK circle on the left.
  - `Denus Korguc` and `Student Discount` stacked on the right.
- Email is intentionally removed from the sidebar.
- The sidebar badge text is `Student Discount`, not `Student Discount Active`.

## Dashboard

- Dashboard is the default section.
- Stats are limited to 4 cards:
  - Total Orders
  - Spent This Month
  - Favorite Restaurant
  - Saved Favorites
- Hero must not show `Student Discount Active` or default address chips.
- Active Delivery has the step progress: Confirmed, Preparing, On the way, Delivered.
- Quick Actions must look clickable and include small action labels.
- Recent Orders:
  - whole card is clickable and opens Orders/details;
  - visible Details button was removed;
  - Delivered/Refunded button label: `Order again`;
  - Cancelled button label: `Try again`;
  - action button starts cart/reorder flow only.
- Dashboard action links such as `View menu`, `View all orders`, and `View all favorites` use the lightweight text + arrow-up-right style, no fill, underline on hover.

## Orders

- Layout: Active Order banner, search/filter, All Orders list on the left, Order Details panel on the right.
- Active Order banner actions: `Track order` and `View details`.
- Active order cards must not show Reorder/Order again.
- All order list cards are clickable, keyboard accessible, and select the details panel.
- The visible Details button was removed from order cards.
- Card title is `Order #...`; restaurant name is secondary text.
- Non-active order card action labels:
  - Delivered: `Order again`
  - Cancelled: `Try again`
  - Refunded: `Order again`
- Card action button sits in a right-side column near the status badge, not at the far bottom.
- Selected card has a clear selected state: border/background/focus/left accent.
- Details panel actions are status-based:
  - Active: `Track order` + grey secondary `Get help`
  - Delivered: `Order again` + `View receipt`
  - Cancelled: `Try again` + grey secondary `Get help`
  - Refunded: `Order again` + `View refund`
- Details bottom actions are two equal-width buttons. `Get help` has no arrow icon.

## Favorites

- Tabs: Restaurants and Dishes.
- The `Recently saved / Ready for your next order` block was removed.
- Favorites use the existing `ProductCard` component from the menu code.
- `ProductCard` now supports a minimal variant for account favorites.
- In minimal favorite cards, keep only:
  - top chips/action like `View`, time, price, or discount;
  - title/name.
- Hide extra meta, rating, area, description, and dense text in favorite cards.
- Dish cards should use the same compact visual size as restaurant cards.

## Addresses

- Addresses is a polished delivery address management screen, not a plain list.
- Page header:
  - eyebrow `Addresses`;
  - title `Delivery Addresses`;
  - subtitle `Manage where your orders should be delivered.`
- Active delivery notice is global and sits directly under the page header, above all address cards:
  - `You have an active delivery. Changes to saved addresses will not affect your current order.`
- Layout stays stacked:
  - Default Address card first;
  - Saved Addresses card second.
- Default Address card:
  - section label `DEFAULT ADDRESS`;
  - title `Default delivery address`;
  - helper `Used first at checkout.`;
  - shows the current default address only.
- Default badge text is `Default at checkout`.
- The default badge uses the lime/yellow accent background but must keep dark readable text and vertically centered label text.
- Address cards include subtle circular address-type icons:
  - Home icon for Home;
  - graduation-cap style icon for University;
  - briefcase style icon for Work.
- Address-type icons are inline SVGs centered inside a 44px circular soft-grey container.
  - Be careful: generic `.account-address-card span` styles can override icon or badge display; use specific selectors for icon/badge alignment.
- Address cards show:
  - address type/title;
  - default badge only on the default address;
  - full address;
  - delivery note;
  - phone;
  - actions.
- Actions:
  - Non-default saved addresses show `Set as default` as the dark navy primary action.
  - All address cards show `Edit address` as a light secondary action with the square-pen inline SVG icon at exactly 20px.
  - `Remove` was intentionally removed from all address cards after user feedback. Do not add it back unless explicitly requested.
- Edit address opens the existing local/mock form with fields:
  - Address title;
  - Street address;
  - Apartment / floor;
  - City;
  - Delivery note;
  - Phone number;
  - checkbox `Make this my default address`.
- Form actions are `Cancel` and `Save address`.
- Empty states exist for no default address and no saved addresses.
- No backend schema/API changes were added.

## Settings

- Settings is an account management center, not one huge form.
- Desktop first row is a two-column grid:
  - left: `Your details`
  - right: `Password and connected accounts`
  - grid idea: `1fr 1.4fr`
- Do not force equal heights.
- `Your details` is read-only by default.
- `Edit profile` opens edit mode with Save/Cancel.
- Under `Your details` there is a separate `Student Benefits` card. It is not inside the Your details card.
- Student Benefits card content:
  - `ACCOUNT BENEFITS`
  - `Student Benefits`
  - `Student Discount Active`
  - short student discount description
  - pills: `15% off next order`, `Student deals`, `Selected restaurants`
  - lightweight `Manage benefits` action
- `Manage benefits` switches to the Payments & Discounts section.
- Notifications use compact toggle-style controls and say changes are saved automatically.
- Food Preferences use grouped chips.
- Regional Preferences + Account Data are separate cards.
- Danger Zone remains full width.

## Payments And Discounts

- Layout:
  - row 1: Payment Methods + Student Discount
  - row 2: Promo Codes + Receipts
- Payment Methods:
  - Visa, Apple Pay, Google Pay are shown.
  - each row has one circular dark navy square-pen icon button, icon size 20px.
  - the visible `Manage` text was removed from method rows.
  - Add Payment Method is a lightweight text + arrow link, no filled pill.
- Manage payment method opens a modal:
  - Card method: Edit details, Set as default, Remove method
  - Wallet method: Manage connection, Set as default, Remove method
- Remove method opens confirmation modal.
- Student Discount is an account benefit/status block, not a subscription upsell.
- Promo Codes:
  - available codes have active Apply button;
  - expired codes show expired state and disabled Apply;
  - manual Apply Code is dark navy primary, but disabled with opacity when input is empty.
- Receipts:
  - compact rows;
  - Download uses lightweight text + arrow style;
  - spacing between helper text and receipt rows should match other cards, not be oversized.

## Visual Rules

- Preserve Defilicious style:
  - light page background;
  - white cards;
  - soft grey inner cards;
  - dark navy primary buttons;
  - lime/yellow accent pills;
  - rounded cards and pill controls;
  - soft borders/shadows.
- Text + arrow actions should look like links, not filled buttons.
- Icon-only edit/manage actions should be circular dark navy buttons with 20px SVG icons.
- Keep cards compact. Avoid adding extra explanatory text unless needed.
- Avoid redesigning full sections when the user asks for a small local fix.

## Verification Notes

- `npm run lint` in `client` has been the main check after changes and passed after the latest Addresses work.
- `node client/src/pages/account/accountUtils.test.js` passed after the latest Addresses work.
- Browser verification on `http://localhost:5173/#/my-account` confirmed on the Addresses tab:
  - address icons centered inside their circles;
  - `Default at checkout` badge uses dark text and centered label alignment;
  - `Remove` buttons count is `0`;
  - `Edit address` buttons count is `3`;
  - `Set as default` buttons count is `2`.
- `npm run build` can fail inside the sandbox with `esbuild spawn EPERM` and may require escalated execution.
- The latest escalated `npm run build` completed successfully after the Addresses polish work, with only the standard Vite large chunk warning.
