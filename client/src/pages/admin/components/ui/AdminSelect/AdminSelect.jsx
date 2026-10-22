import { Children, isValidElement, useEffect, useId, useRef, useState } from "react";
import { AdminSelectControl } from "./AdminSelectControl";
import "./AdminSelect.scss";

const optionText = (children) => Children.toArray(children).map((child) => isValidElement(child) ? optionText(child.props.children) : String(child)).join("");
const readOptions = (children) => Children.toArray(children).flatMap((child) => {
  if (!isValidElement(child)) return [];
  if (child.type !== "option") return readOptions(child.props.children);
  const label = optionText(child.props.children);
  return [{ value: String(child.props.value ?? label), label, disabled: !!child.props.disabled }];
});

// Preserve existing callers, native form values/defaults and change-event targets.
export function AdminSelect({ children, className = "", size = "default", fluid = false,
  value, defaultValue, onChange, id, name, disabled = false, required = false, form,
  "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy,
  "aria-invalid": invalid, ...props }) {
  const generatedId = useId();
  const controlId = id || `admin-select-${generatedId}`;
  const native = useRef(null);
  const options = readOptions(children);
  const initialValue = String(defaultValue ?? options[0]?.value ?? "");
  const [localValue, setLocalValue] = useState(initialValue);
  const [validationError, setValidationError] = useState(false);
  const selectedValue = String(value ?? localValue);
  const label = ariaLabel || String(name || "Select option").replace(/([a-z])([A-Z])/g, "$1 $2");
  useEffect(() => {
    const parent = native.current?.form;
    const reset = () => { if (value === undefined) setLocalValue(initialValue); setValidationError(false); };
    parent?.addEventListener("reset", reset);
    return () => parent?.removeEventListener("reset", reset);
  }, [value, initialValue]);
  const change = (nextValue) => {
    if (value === undefined) setLocalValue(nextValue);
    setValidationError(false);
    native.current.value = nextValue;
    onChange?.({ target: native.current, currentTarget: native.current, type: "change" });
  };
  return <span className={`admin-select admin-select--${size} ${fluid ? "admin-select--fluid" : ""} ${className}`.trim()}>
    <select {...props} ref={native} className="admin-select__native" aria-hidden="true" tabIndex={-1}
      name={name} form={form} disabled={disabled} required={required} value={selectedValue} onChange={(event) => change(event.target.value)}
      onInvalid={(event) => { event.preventDefault(); setValidationError(true); document.getElementById(controlId)?.focus(); }}>
      {children}
    </select>
    <AdminSelectControl id={controlId} label={label} value={selectedValue} options={options} onChange={change}
      disabled={disabled} required={required} size={size} searchable={options.length > 7}
      active={!name && selectedValue !== options[0]?.value} aria-labelledby={labelledBy}
      aria-describedby={[describedBy, validationError ? `${controlId}-error` : ""].filter(Boolean).join(" ") || undefined}
      aria-invalid={validationError || invalid} />
    {validationError && <small className="admin-select__error" id={`${controlId}-error`} role="alert">Choose an option.</small>}
  </span>;
}
