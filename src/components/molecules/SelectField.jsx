import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";

const SelectField = ({ label, error, children, ...selectProps }) => {
  return (
    <div>
      <Label>{label}</Label>
      <Select {...selectProps}>
        {children}
      </Select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SelectField;