import { Show, type JSXElement } from "solid-js";
import { cls } from "../styles";

interface SelectButtonProps {
  selected?: boolean;
  onClick?: () => void;
  children: JSXElement;
}

export function SelectButton(props: SelectButtonProps) {
  return (
    <button
      class={cls(
        "relative py-3 px-9 border border-fuchsia-700 text-fuchsia-900 rounded hover:bg-fuchsia-100 transition-all cursor-pointer",
        props.selected && "bg-fuchsia-100"
      )}
      onClick={props.onClick}
    >
      <Show when={props.selected}>
        <span class="absolute top-0 right-0 h-5 w-5 flex justify-center items-center bg-fuchsia-700 text-fuchsia-50 text-xs rounded-bl rounded-tr">
          ✓
        </span>
      </Show>
      {props.children}
    </button>
  );
}
