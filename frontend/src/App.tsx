import { createSignal, Match, Switch } from "solid-js";
import { createIntakeForm, updateIntakeForm, type IntakeFormData } from "./api";
import { IntakeForm } from "./components/intake-form/intake-form";
import { IntakeFormCompletion } from "./components/intake-form/intake-form-completion";
import { IntakeFormIntro } from "./components/intake-form/intake-form-intro";
import { IntakeFormResume } from "./components/intake-form/intake-form-resume";
import { OpenSessions } from "./components/intake-form/open-sessions";

type Screen = "OpenSessions" | "Intro" | "Resume" | "Form" | "Complete";

export function App() {
  const [autosaveEnabled, setAutosaveEnabled] = createSignal(false);
  const [skipAnswered, setSkipAnswered] = createSignal(false);
  const [formData, setFormData] = createSignal<IntakeFormData>({});
  const [screen, setScreen] = createSignal<Screen>("OpenSessions");

  return (
    <div class="min-h-screen bg-topography">
      <div class="h-screen p-8 max-lg:p-2 flex items-center justify-center">
        <div class="h-full overflow-y-auto overflow-x-hidden bg-neutral-50 py-8 px-16 max-lg:py-3 max-lg:px-4 rounded max-md:w-full">
          <Switch>
            <Match when={screen() === "OpenSessions"}>
              <OpenSessions
                onContinue={(data) => {
                  setFormData(data);
                  setAutosaveEnabled(true);
                  setScreen("Resume");
                }}
                onCreate={() => {
                  setScreen("Intro");
                }}
              />
            </Match>

            <Match when={screen() === "Intro"}>
              <IntakeFormIntro
                onStart={async () => {
                  const data = {};

                  if (autosaveEnabled()) {
                    setFormData(await createIntakeForm(data));
                  } else {
                    setFormData(data);
                  }

                  setScreen("Form");
                }}
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
                onSave={async (email) => {
                  const completedFormData = {
                    ...formData(),
                    email,
                    submitted_at: new Date().toISOString(),
                  };

                  if (formData().id && autosaveEnabled()) {
                    await updateIntakeForm(formData().id!, completedFormData);
                  } else {
                    await createIntakeForm(completedFormData);
                  }

                  setAutosaveEnabled(false);
                  setScreen("OpenSessions");
                }}
              />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
