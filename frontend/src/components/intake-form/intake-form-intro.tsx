import { SelectButton } from "../select-button";

interface IntakeFormIntroProps {
  onStart: () => void;
  autosaveEnabled: boolean;
  setAutosaveEnabled: (enabled: boolean) => void;
}

export function IntakeFormIntro(props: IntakeFormIntroProps) {
  return (
    <div class="min-h-full w-full flex flex-col justify-center items-center">
      <h1 class="mb-8 text-5xl text-center font-serif text-fuchsia-700">
        Match, Choose, Book
      </h1>

      <div class="mb-8 flex flex-col gap-4 items-center">
        <p class="w-xl text-center text-xl text-fuchsia-900">
          We understand that some decisions take time, feel free to complete the
          form in multiple sittings by enabling autosave.
        </p>
        <p class="w-xl text-center text-xl text-fuchsia-900">
          However we also know that these are sensitive mental health questions,
          thus by default nothing is saved till submitted.
        </p>
      </div>

      <div class="flex flex-col items-center gap-1">
        <SelectButton
          selected={props.autosaveEnabled}
          onClick={() => props.setAutosaveEnabled(!props.autosaveEnabled)}
        >
          Enable Autosave
        </SelectButton>
        <p class="text-sm text-fuchsia-700/40">You can also enable it later.</p>
      </div>

      <button
        class="mt-16 w-full py-3 px-9 text-lg bg-fuchsia-700 text-fuchsia-50 rounded shadow hover:bg-fuchsia-800 transition-all cursor-pointer"
        onClick={props.onStart}
      >
        Start Matching →
      </button>
    </div>
  );
}
