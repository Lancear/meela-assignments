export type IntakeFormData = Partial<{
  id: string;
  email: string;
  submitted_at: string;
  reasons_for_therapy: string[];
  goals_in_therapy: string[];
  age_group: string;
  therapist_knowledge: string[];
  therapist_gender: string;
  session_activeness: string;
}>;

export async function listIntakeForms() {
  const res = await fetch(`/api/intake-forms`);
  const jsonBody = await res.text();
  return JSON.parse(jsonBody).data as IntakeFormData[];
}

export async function createIntakeForm(formData: IntakeFormData) {
  const res = await fetch(`/api/intake-forms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const jsonBody = await res.text();
  return JSON.parse(jsonBody).data as IntakeFormData;
}

export async function updateIntakeForm(
  formId: string,
  changes: IntakeFormData
) {
  const res = await fetch(`/api/intake-forms/${formId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  const jsonBody = await res.text();
  return JSON.parse(jsonBody).data as IntakeFormData;
}
