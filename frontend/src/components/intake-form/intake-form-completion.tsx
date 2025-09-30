import { createSignal } from "solid-js";

interface IntakeFormCompletionProps {
  onSave: (email: string) => void;
}

export function IntakeFormCompletion(props: IntakeFormCompletionProps) {
  const [email, setEmail] = createSignal("");

  return (
    <div class="h-full w-full flex flex-col justify-center items-center">
      <h1 class="mb-8 text-4xl text-center font-serif text-fuchsia-700">
        That's all questions!
      </h1>

      <p class="w-xl text-center text-xl text-fuchsia-900">
        Thanks for answering all questions, now we can find the right therapist
        for you. Please enter your email below so we can send your matches.
      </p>

      <input
        type="email"
        placeholder="Email"
        value={email()}
        onChange={(e) => setEmail(e.target.value)}
        class="mt-8 w-sm py-2 px-4 border border-fuchsia-700 text-fuchsia-900 rounded focus:bg-fuchsia-50 transition-all"
      />

      <button
        class="mt-16 w-full py-3 px-9 text-lg bg-fuchsia-700 text-fuchsia-50 rounded shadow hover:bg-fuchsia-800 transition-all cursor-pointer"
        onClick={() => props.onSave(email())}
      >
        Receive Matches →
      </button>
    </div>
  );
}
