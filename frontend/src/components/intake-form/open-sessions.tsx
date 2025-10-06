import { createResource, For, Show } from "solid-js";
import { listIntakeForms, type IntakeFormData } from "../../api";

interface OpenSessionsProps {
  onContinue: (data: IntakeFormData) => void;
  onCreate: () => void;
}

export function OpenSessions(props: OpenSessionsProps) {
  const [intakeForms] = createResource(listIntakeForms);

  return (
    <div class="min-h-full w-full flex flex-col justify-center items-center">
      <h1 class="mb-8 text-5xl text-center font-serif text-fuchsia-700">
        Match, Choose, Book
      </h1>

      <Show when={intakeForms.loading}>
        <p class="text-lg text-fuchsia-900">Loading intake form sessions....</p>
      </Show>

      <Show when={intakeForms.error}>
        <p class="text-lg text-red-800">
          Failed to load the intake forms, please try again later.
        </p>
      </Show>

      <div class="mb-8 flex flex-col gap-4 items-center">
        <h2 class="text-xl text-fuchsia-700">Open Sessions</h2>
        <For each={intakeForms()?.filter((s) => !s.submitted_at)}>
          {(intakeForm) => (
            <button
              class="p-1 flex flex-col gap-1 text-center bg-fuchsia-50/50 rounded transition-all hover:bg-fuchsia-50 cursor-pointer"
              onClick={() => props.onContinue(intakeForm)}
            >
              <span class="text-lg text-fuchsia-900">
                Session #{intakeForm.id?.slice(-6)}
              </span>
              <span class="text-fuchsia-900/40">
                {JSON.stringify(intakeForm, (k, v) => v ?? undefined)}
              </span>
            </button>
          )}
        </For>
      </div>

      <div class="mb-8 flex flex-col gap-4 items-center">
        <h2 class="text-xl text-fuchsia-700">Submitted Sessions</h2>
        <For each={intakeForms()?.filter((s) => s.submitted_at)}>
          {(intakeForm) => (
            <div class="p-1 flex flex-col gap-1 text-center bg-neutral-100/40 rounded">
              <span class="text-lg text-fuchsia-900">
                Session #{intakeForm.id?.slice(-6)}
              </span>
              <span class="text-fuchsia-900/40">
                {JSON.stringify(intakeForm, (k, v) => v ?? undefined)}
              </span>
            </div>
          )}
        </For>
      </div>

      <button
        class="mt-16 w-full py-3 px-9 text-lg bg-fuchsia-700 text-fuchsia-50 rounded shadow hover:bg-fuchsia-800 transition-all cursor-pointer"
        onClick={props.onCreate}
      >
        Create New Session
      </button>
    </div>
  );
}
