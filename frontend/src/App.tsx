import { createSignal, Match, Switch } from "solid-js";
import type { IntakeFormData } from "./api";
import { IntakeForm } from "./components/intake-form/intake-form";
import { IntakeFormCompletion } from "./components/intake-form/intake-form-completion";
import { IntakeFormIntro } from "./components/intake-form/intake-form-intro";
import { IntakeFormResume } from "./components/intake-form/intake-form-resume";

type Screen = "OpenSessions" | "Intro" | "Resume" | "Form" | "Complete";

export function App() {
  const [autosaveEnabled, setAutosaveEnabled] = createSignal(false);
  const [skipAnswered, setSkipAnswered] = createSignal(false);
  const [formData, setFormData] = createSignal<IntakeFormData>({
    therapistKnowledge: [],
  });
  const [screen, setScreen] = createSignal<Screen>("Resume");

  return (
    <div class="min-h-screen bg-topography">
      <div class="h-screen p-8 max-lg:p-2 flex items-center justify-center">
        <div class="h-full overflow-y-auto overflow-x-hidden bg-neutral-50 py-8 px-16 max-lg:py-3 max-lg:px-4 rounded max-md:w-full">
          <Switch>
            <Match when={screen() === "Intro"}>
              <IntakeFormIntro
                onStart={() => setScreen("Form")}
                autosaveEnabled={autosaveEnabled()}
                setAutosaveEnabled={setAutosaveEnabled}
              />
            </Match>

            <Match when={screen() === "Resume"}>
              <IntakeFormResume
                formData={formData()}
                onResume={(skip) => {
                  setSkipAnswered(skip);
                  setScreen("Form");
                }}
              />
            </Match>

            <Match when={screen() === "Form"}>
              <IntakeForm
                formData={formData()}
                setFormData={setFormData}
                skipAnswered={skipAnswered()}
                autosave={autosaveEnabled()}
                enableAutosave={() => setAutosaveEnabled(true)}
                onComplete={() => setScreen("Complete")}
              />
            </Match>

            <Match when={screen() === "Complete"}>
              <IntakeFormCompletion
                onSave={(email) => {
                  console.log("Final save", formData(), email);
                  setAutosaveEnabled(false);
                  setScreen("Intro");
                }}
              />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
