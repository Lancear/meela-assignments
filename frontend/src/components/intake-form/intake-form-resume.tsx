import type { IntakeFormData } from "../../api";

interface IntakeFormResumeProps {
  formData: IntakeFormData;
  onResume: (skipAnswered: boolean) => void;
}

export function IntakeFormResume(props: IntakeFormResumeProps) {
  return (
    <div class="min-h-full w-full flex flex-col justify-center items-center">
      <h1 class="mb-8 text-5xl text-center font-serif text-fuchsia-700">
        Welcome Back
      </h1>

      <p class="mb-8 w-xl text-center text-xl text-fuchsia-900">
        We got your progress from last time saved and ready. Pick below if you
        want to revise the already given answers or jump straight to the next
        question.
      </p>

      <div class="mt-16 grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <button
          class="py-3 px-9 text-lg border border-fuchsia-700 text-fuchsia-900 bg-fuchsia-50 rounded shadow hover:bg-fuchsia-200 transition-all cursor-pointer"
          onClick={() => props.onResume(false)}
        >
          Review Saved Answers →
        </button>
        <button
          class="py-3 px-9 text-lg bg-fuchsia-700 text-fuchsia-50 rounded shadow hover:bg-fuchsia-800 transition-all cursor-pointer"
          onClick={() => props.onResume(true)}
        >
          Go To Next Question →
        </button>
      </div>
    </div>
  );
}
