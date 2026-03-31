import { dataLinksForFooter } from "./consts.js";
import { dataSmallLinksForFooter } from "./consts.js";

export function Footer() {
  return (
    <footer className="w-full bg-[#0D1A2D] text-white py-12 px-10 mt-10">
      <div className="w-full max-w-400 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="flex flex-col">
            <span className="text-xl font-medium text-white tracking-wide ">
              Defilicious
            </span>
          </div>

          {dataLinksForFooter.map((column, index) => (
            <div key={index} className=" flex flex-col gap-4">
              <ul className="grid grid-cols-1 gap-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-[#8F9BB1] hover:text-white transition-colors h-10 flex items-center text-sm font-medium"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <h3 className="text-xl">Get exclusive deals & student discounts</h3>
            <p className=" text-sm">
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
          <small>© 2026 Defilicious. All rights reserved.</small>
          <div className="flex flex-row items-center gap-3">
            {dataSmallLinksForFooter.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-white transition-colors text-xs"
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
