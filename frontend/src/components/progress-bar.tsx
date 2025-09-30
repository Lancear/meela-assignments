import { Show, type JSXElement } from "solid-js";
import { cls } from "../styles";

interface ProgressBarProps {
  children: JSXElement[];
  class?: string;
}

export function ProgressBar(props: ProgressBarProps) {
  return (
    <div
      class={cls("grid gap-2", props.class)}
      style={{
        "grid-template-columns": `repeat(${props.children.length}, minmax(0, 1fr))`,
      }}
    >
      {props.children}
    </div>
  );
}

interface ProgressBarCategoryProps {
  label: string;
  active?: boolean;
  completed?: boolean;
  currentStep: number;
  totalSteps: number;
}

function ProgressBarCategory(props: ProgressBarCategoryProps) {
  return (
    <div>
      <span
        class={cls(
          "text-xs uppercase tracking-wider",
          props.active ? "text-fuchsia-700" : "text-fuchsia-700/40"
        )}
      >
        {props.label}
      </span>
      <div class="h-1 bg-fuchsia-100 rounded">
        <Show when={props.active || props.completed}>
          <div
            class="h-1 bg-fuchsia-700 rounded"
            style={{
              width: `${
                props.completed
                  ? 100
                  : Math.min(
                      Math.max(0, props.currentStep / props.totalSteps),
                      1
                    ) * 100
              }%`,
            }}
          ></div>
        </Show>
      </div>
    </div>
  );
}

ProgressBar.Category = ProgressBarCategory;
