import { displayCity, translateEngagementMessage } from "../engagement.utils";

const maxLengths = {
  restaurant_name: 160,
  city: 120,
  contact_name: 160,
  applicant_name: 160,
  email: 254,
  phone: 40,
  comment: 3000,
  website: 2000,
  resume_url: 2000,
  portfolio_url: 2000,
};

export function ApplicationField({
  field: [key, type, required],
  copy,
  kind,
  vacancy,
  values,
  errors,
  pending,
  preview,
  settings,
  t,
  demo,
  setValue,
}) {
    const [label, defaultPlaceholder] = copy.fields[key];
    const placeholder =
      type === "select" ? copy.selectCity : defaultPlaceholder;
    const isRequired =
      required || (key === "resume_url" && vacancy?.resume_required);
    const id = kind + "-" + key;
    const props = {
      id,
      name: key,
      value: values[key] || "",
      onChange: (event) => setValue(key, event.target.value),
      required: isRequired,
      "aria-invalid": !!errors[key],
      "aria-describedby":
        [errors[key] && id + "-error", key === "resume_url" && id + "-help"]
          .filter(Boolean)
          .join(" ") || undefined,
      disabled: pending || preview,
      maxLength: maxLengths[key],
    };
    return (
      <div
        className={
          "eng-field" + (type === "textarea" ? " eng-field--wide" : "")
        }
        key={key}
      >
        <label htmlFor={id}>
          {label}
          {isRequired ? " *" : <span> ({copy.optional})</span>}
        </label>
        {type === "textarea" ? (
          <textarea {...props} placeholder={placeholder} rows={4} />
        ) : type === "select" ? (
          <select {...props}>
            <option value="">{placeholder}</option>
            {settings.hiring.courier_cities.map((city) => (
              <option key={city} value={city}>
                {displayCity(city, t, demo)}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...props}
            type={type}
            placeholder={placeholder}
            autoComplete={
              key === "email"
                ? "email"
                : key === "phone"
                  ? "tel"
                  : key === "city"
                    ? "address-level2"
                    : key === "restaurant_name"
                      ? "organization"
                      : key.includes("name")
                        ? "name"
                        : "off"
            }
          />
        )}
        {key === "resume_url" && (
          <small id={id + "-help"}>{copy.resumeHelp}</small>
        )}
        {errors[key] && (
          <span className="eng-field__error" id={id + "-error"}>
            {translateEngagementMessage(errors[key], t, "form.errors.invalid")}
          </span>
        )}
      </div>
    );
  }
