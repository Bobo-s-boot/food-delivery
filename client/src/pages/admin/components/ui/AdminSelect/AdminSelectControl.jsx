import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import "./AdminSelectControl.scss";

export function AdminSelectControl({
  id,
  label,
  value = "",
  options,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  disabled = false,
  active = false,
  className = "",
  size = "default",
  required = false,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
}) {
  const generatedId = useId();
  const controlId = id || `engagement-select-${generatedId}`;
  const listId = `${controlId}-options`;
  const root = useRef(null);
  const trigger = useRef(null);
  const search = useRef(null);
  const menu = useRef(null);
  const list = useRef(null);
  const typeahead = useRef({ value: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [options, query],
  );
  const activeIndex = Math.min(index, Math.max(0, filtered.length - 1));
  const activeId = filtered.length ? `${listId}-${activeIndex}` : undefined;

  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const box = trigger.current?.getBoundingClientRect();
      if (!box || !menu.current || !list.current) return;
      const below = window.innerHeight - box.bottom - 16;
      const above = box.top - 16;
      const searchHeight = searchable ? 57 : 0;
      const flip = below < Math.min(296 + searchHeight, menu.current.scrollHeight) && above > below;
      const available = Math.max(48, (flip ? above : below) - 18 - searchHeight);
      list.current.style.maxHeight = Math.min(280, available) + "px";
      Object.assign(menu.current.style, {
        position: "fixed", width: box.width + "px", left: box.left + "px", right: "auto",
        top: (flip ? Math.max(8, box.top - menu.current.getBoundingClientRect().height - 8) : box.bottom + 8) + "px",
      });
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(trigger.current);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { observer.disconnect(); window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [open, searchable, filtered.length]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    if (searchable) search.current?.focus();
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open, searchable]);
  useEffect(() => {
    if (open && activeId) {
      const option = document.getElementById(activeId), options = list.current;
      if (option && options) {
        const box = option.getBoundingClientRect(), bounds = options.getBoundingClientRect();
        if (box.top < bounds.top) options.scrollTop -= bounds.top - box.top;
        else if (box.bottom > bounds.bottom) options.scrollTop += box.bottom - bounds.bottom;
      }
    }
  }, [activeId, open]);

  const show = () => {
    setQuery("");
    setIndex(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const choose = (option) => {
    if (option.disabled) return;
    onChange(option.value);
    close();
  };
  const keyDown = (event) => {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (!open) show();
      else setIndex((current) => {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        for (let offset = 1; offset <= filtered.length; offset++) {
          const next = (current + direction * offset + filtered.length) % filtered.length;
          if (!filtered[next].disabled) return next;
        }
        return current;
      });
    } else if (
      (event.key === "Enter" || event.key === " ") &&
      event.target === trigger.current
    ) {
      event.preventDefault();
      if (!open) show();
      else if (filtered[activeIndex]) choose(filtered[activeIndex]);
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (filtered[activeIndex]) choose(filtered[activeIndex]);
    } else if (
      open &&
      ["Home", "End"].includes(event.key) &&
      event.target === trigger.current
    ) {
      event.preventDefault();
      const enabled = filtered.map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0);
      setIndex((event.key === "Home" ? enabled[0] : enabled.at(-1)) ?? 0);
    } else if (
      event.key.length === 1 &&
      event.target === trigger.current &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      const now = Date.now();
      const prefix =
        now - typeahead.current.at > 700
          ? event.key
          : typeahead.current.value + event.key;
      typeahead.current = { value: prefix, at: now };
      if (!open) show();
      const match = options.findIndex((option) =>
        !option.disabled && option.label.toLowerCase().startsWith(prefix.toLowerCase()),
      );
      if (match >= 0) setIndex(match);
      if (searchable) {
        setQuery(prefix);
        setIndex(0);
      }
    }
  };

  return (
    <div
      className={`engagement-select ${size === "compact" ? "engagement-select--compact" : ""} ${active ? "is-filtered" : ""} ${open ? "is-open" : ""} ${className}`.trim()}
      ref={root}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    >
      <button
        id={controlId}
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={`${label}: ${selected?.label || placeholder}`}
        aria-labelledby={labelledBy}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-required={required || undefined}
        aria-activedescendant={open && !searchable ? activeId : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={keyDown}
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div
          className="engagement-select__menu"
          ref={menu}
        >
          {searchable && (
            <div className="engagement-select__search">
              <Search size={16} aria-hidden="true" />
              <input
                ref={search}
                role="combobox"
                aria-label={`Search ${label.toLowerCase()}`}
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                value={query}
                placeholder={`Search ${label.toLowerCase()}…`}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setIndex(0);
                }}
                onKeyDown={keyDown}
              />
            </div>
          )}
          <div
            id={listId}
            role="listbox"
            aria-label={label}
            className="engagement-select__options"
            ref={list}
          >
            {filtered.map((option, optionIndex) => (
              <div
                key={option.value}
                id={`${listId}-${optionIndex}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled || undefined}
                className={`engagement-select__option ${activeIndex === optionIndex ? "is-highlighted" : ""}`}
                onPointerMove={() => { if (!option.disabled) setIndex(optionIndex); }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => { event.preventDefault(); choose(option); }}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check size={16} aria-hidden="true" />
                )}
              </div>
            ))}
            {!filtered.length && (
              <p className="engagement-select__empty" role="status">
                No matching options
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
