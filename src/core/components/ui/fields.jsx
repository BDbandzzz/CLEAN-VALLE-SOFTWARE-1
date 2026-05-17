import {Label} from "@core/components/ui/label"
import { Input } from "@core/components/ui/input";



function ReadOnlyField({
  id,
  label,
  value,
  className = "",
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        readOnly
        tabIndex={-1}
        value={value}
        className={`cursor-default bg-muted/50 ${className}`}
      />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  className = "",
  placeholder = "",
  type = "text",
  onChange,
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export{ReadOnlyField, Field}