import { For } from "solid-js";
import { SelectButton } from "../../select-button";

interface MultiSelectQuestionProps {
  question: string;
  values: string[];
  options: Record<string, string>;
  onChange: (values: string[]) => void;
}

export function MultiSelectQuestion(props: MultiSelectQuestionProps) {
  return (
    <>
      <h1 class="mb-8 text-4xl text-center font-serif text-fuchsia-700">
        {props.question}
      </h1>

      <div class="mb-8 grid grid-cols-2 gap-4">
        <For each={Object.entries(props.options)}>
          {([value, label]) => (
            <SelectButton
              selected={props.values.includes(value)}
              onClick={() => {
                const newValues = props.values.includes(value)
                  ? props.values.filter((v) => v !== value)
                  : [...(props.values ?? []), value];

                props.onChange(newValues);
              }}
            >
              {label}
            </SelectButton>
          )}
        </For>
      </div>
    </>
  );
}
