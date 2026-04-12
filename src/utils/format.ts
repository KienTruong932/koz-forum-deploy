export function getFormData(formData: FormData) {
  const data = Object.fromEntries(formData) as Record<string, any>;

  Object.keys(data).forEach((key) => {
    if (!(data[key] instanceof File) && typeof data[key] === "string") {
      data[key] = data[key].trim();
    }
  });

  return data;
}
