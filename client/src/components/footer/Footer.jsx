import { NavLink } from "react-router-dom";
import { dataLinksForFooter } from "./consts.js";
import { dataSmallLinksForFooter } from "./consts.js";

const isInternalLink = (to) => typeof to === "string" && to.startsWith("/");

export function Footer() {
  return (
    <footer className="w-full bg-[#0D1A2D] text-white py-12 px-10 mt-10">
      <div className="max-w-400 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="flex flex-col">
            <span className="text-[32px] font-medium text-white tracking-wide ">
              Defilicious
            </span>
          </div>

          {dataLinksForFooter.map((column, index) => (
            <div key={index} className="flex flex-col gap-4">
              <ul className="grid grid-cols-1 gap-y-2">
                {column.links.map((link, linkIndex) => {
                  const linkClasses =
                    "text-xl transition-all h-10 flex items-center font-normal border-b-2 w-max";

                  return (
                    <li key={linkIndex}>
                      {isInternalLink(link.to) ? (
                        <NavLink
                          to={link.to}
                          end={link.to === "/"}
                          className={({ isActive }) =>
                            `${linkClasses} ${
                              isActive
                                ? "text-white box-border px-4 py-2 border border-[#EEEEEE] rounded-full hover:bg-[#EEEEEE] transition-colors"
                                : "text-[#8F9BB1] border-transparent hover:text-white"
                            }`
                          }
                        >
                          {link.name}
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">
              Get exclusive deals & student discounts
            </h3>
            <p className="text-sm font-normal">
              Subscribe to our newsletter and get 15% off your next order.
            </p>

            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              className="w-full align-center rounded-full px-2 py-2 bg-[#EFEFF1] text-base xl:text-lg text-[#0F131680] placeholder:text-[#0F131680] outline-none tracking-[-0.04em] truncate"
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between items-center mt-10  gap-2">
          <small className="text-xs text-[#8F9BB1]">
            © 2026 Defilicious. All rights reserved.
          </small>
          <div className="flex flex-row items-center gap-3">
            {dataSmallLinksForFooter.links.map((link, index) => (
              <a
                key={index}
                href={link.to}
                className="text-[#8F9BB1] hover:text-white transition-colors text-xs"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
