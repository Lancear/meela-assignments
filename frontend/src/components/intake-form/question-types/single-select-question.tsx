import { For } from "solid-js";
import { SelectButton } from "../../select-button";

interface SingleSelectQuestionProps {
  question: string;
  value?: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}

export function SingleSelectQuestion(props: SingleSelectQuestionProps) {
  return (
    <div>
      <h1 class="mb-8 text-4xl text-center font-serif text-fuchsia-700">
        {props.question}
      </h1>

      <div class="mb-8 grid grid-cols-2 gap-4">
        <For each={Object.entries(props.options)}>
          {([value, label]) => (
            <SelectButton
              selected={props.value === value}
              onClick={() => props.onChange(value)}
            >
              {label}
            </SelectButton>
          )}
        </For>
      </div>
    </div>
  );
}
