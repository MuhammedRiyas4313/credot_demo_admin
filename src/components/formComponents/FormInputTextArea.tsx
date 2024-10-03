import { Controller } from "react-hook-form";
import Textarea from "@mui/joy/Textarea";

export const FormInputTextArea = ({ name, control, placeholder, type, variant }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <Textarea minRows={2} onChange={onChange} value={value} name={name} placeholder={placeholder} size="md" />
      )}
    />
  );
};
