import { createSignal, Match, Show, Switch } from "solid-js";
import {
  createIntakeForm,
  updateIntakeForm,
  type IntakeFormData,
} from "../../api";
import { ProgressBar } from "../progress-bar";
import { MultiSelectQuestion } from "./question-types/multi-select-question";
import { SingleSelectQuestion } from "./question-types/single-select-question";

interface IntakeFormStep {
  category:
    | "personal situation"
    | "therapist preferences"
    | "session preferences";
  field: keyof IntakeFormData;
  question: string;
  multiselect?: boolean;
  optional?: boolean;
  options: Record<string, string>;
}

const INTAKE_FORM_STEPS: IntakeFormStep[] = [
  {
    category: "personal situation",
    field: "reasons_for_therapy",
    question: "What do you need help with?",
    multiselect: true,
    options: {
      Abortion: "Abortion",
      Addicition: "Addicition",
      Adoption: "Adoption",
      Anxiety: "Anxiety",
      Bullying: "Bullying",
      Cancer: "Cancer",
      Climate: "Climate",
      Death: "Death",
      Depression: "Depression",
      Discrimination: "Discrimination",
      DomesticViolence: "Domestic Violence",
      EatingDisorder: "Eating Disorder",
      Family: "Family",
      Gambling: "Gambling",
      GenderIdentity: "Gender Identity",
      Hoarding: "Hoarding",
      Loneliness: "Loneliness",
      Money: "Money",
      NegativeThoughts: "Negative Thoughts",
      PanicAttacks: "Panic Attacks",
      PetLoss: "Pet Loss",
      Racism: "Racism",
      SelfHarm: "SelfHarm",
      Sexuality: "Sexuality",
      SocialMedia: "Social Media",
      Trauma: "Trauma",
      War: "War",
      WorldEvents: "World Events",
    },
  },
  {
    category: "personal situation",
    field: "goals_in_therapy",
    question: "What do you want to work on or learn in therapy?",
    multiselect: true,
    options: {
      Acceptance: "Acceptance",
      BoundarySetting: "Boundary Setting",
      Communication: "Communication",
      ConflictManagement: "Conflict Management",
      FindBalance: "Find Balance",
      GetInTouchWithFeelings: "Get In Touch With Feelings",
      HandleDiscrimination: "Handle Discrimination",
      HandleNegativeThoughts: "Handle Negative Thoughts",
      HandleRacism: "Handle Racism",
      ImpulseControl: "Impulse Control",
      MoodManagement: "Mood Management",
      SelfUnderstanding: "Self-Understanding",
      StructureAndPlanning: "Structure And Planning",
      TraumaHealing: "Trauma Healing",
      DontKnow: "I Don't Know",
    },
  },
  {
    category: "personal situation",
    field: "age_group",
    question: "How old are you?",
    options: {
      "18-25": "18 - 25",
      "26-35": "26 - 35",
      "36-45": "36 - 45",
      "46-56": "46 - 56",
      "56-65": "56 - 65",
      "66+": "Over 66",
    },
  },
  {
    category: "therapist preferences",
    field: "therapist_knowledge",
    question:
      "Do you want your therapist to have knowledge in any of these areas? (optional)",
    multiselect: true,
    optional: true,
    options: {
      "LGBTQ+": "LGBTQ+",
      MinorityStress: "Minority Stress",
      Neurodivergent: "Neurodivergent",
      PolyamorousRelationships: "Polyamorous Relationships",
      RacebasedTraumaticStress: "Race-based Traumatic Stress",
      TransgenderKnowledge: "Transgender Knowledge",
    },
  },
  {
    category: "therapist preferences",
    field: "therapist_gender",
    question: "What would you prefer your therapist to identify as?",
    options: {
      Woman: "Woman",
      Man: "Man",
      NonBinary: "Non-Binary",
      Any: "Doesn't Matter",
    },
  },
  {
    category: "session preferences",
    field: "session_activeness",
    question: "How active do you want your therapist to be?",
    options: {
      Active: "Active - Your therapist will take the lead and guide you",
      Passive:
        "Passive - Your therapist will listen and follow your exploration",
      Any: "Doesn't Matter",
    },
  },
];

const INTAKE_FORM_STEPS_PER_CATEGORY = INTAKE_FORM_STEPS.reduce(
  (map, step, idx) => {
    map.set(step.category, {
      start: map.get(step.category)?.start ?? idx,
      end: idx,
    });
    return map;
  },
  new Map<string, { start: number; end: number }>()
);

interface IntakeFormProps {
  formData: IntakeFormData;
  setFormData: (data: IntakeFormData) => void;
  skipAnswered: boolean;
  autosave: boolean;
  enableAutosave: () => void;
  onComplete: () => void;
}

export function IntakeForm(props: IntakeFormProps) {
  const [stepIdx, setStepIdx] = createSignal(
    props.skipAnswered
      ? Math.max(
          INTAKE_FORM_STEPS.findIndex((s) => !props.formData[s.field]),
          0
        )
      : 0
  );

  const currentStep = () => INTAKE_FORM_STEPS[stepIdx()];
  const stepValue = () => props.formData[currentStep().field];

  function next() {
    if (stepIdx() === INTAKE_FORM_STEPS.length - 1) {
      props.onComplete();
    } else {
      setStepIdx(Math.min(stepIdx() + 1, INTAKE_FORM_STEPS.length - 1));
    }
  }

  function previous() {
    setStepIdx(Math.max(stepIdx() - 1, 0));
  }

  async function autosave(
    id: string | undefined,
    changes: Record<string, undefined | string | string[]>
  ) {
    if (!props.autosave) return;

    if (!id) {
      props.setFormData(await createIntakeForm(changes));
    } else {
      await updateIntakeForm(id, changes);
    }
  }

  return (
    <div class="w-2xl max-md:w-full">
      <ProgressBar>
        {INTAKE_FORM_STEPS_PER_CATEGORY.entries()
          .toArray()
          .map(([label, stepsRange]) => (
            <ProgressBar.Category
              label={label}
              active={currentStep().category === label}
              completed={stepIdx() > stepsRange.end}
              currentStep={Math.max(stepIdx() - stepsRange.start + 1, 0)}
              totalSteps={stepsRange.end - stepsRange.start + 1}
            />
          ))}
      </ProgressBar>

      <div class="h-[72px] py-6">
        <Show when={stepIdx() > 0}>
          <button
            class="text-fuchsia-900/40 hover:text-fuchsia-700 cursor-pointer"
            onClick={previous}
          >
            ← Previous
          </button>
        </Show>
      </div>

      {currentStep().multiselect ? (
        <MultiSelectQuestion
          question={currentStep().question}
          values={(stepValue() ?? []) as string[]}
          options={currentStep().options}
          onChange={async (value) => {
            props.setFormData({
              ...props.formData,
              [currentStep().field]: value,
            });

            await autosave(props.formData.id, { [currentStep().field]: value });
          }}
        />
      ) : (
        <SingleSelectQuestion
          question={currentStep().question}
          value={stepValue() as undefined | string}
          options={currentStep().options}
          onChange={async (value) => {
            props.setFormData({
              ...props.formData,
              [currentStep().field]: value,
            });
            await autosave(props.formData.id, { [currentStep().field]: value });
            next();
          }}
        />
      )}

      <Show
        when={
          currentStep().optional || (stepValue() && stepValue()!.length > 0)
        }
      >
        <button
          class="w-full py-3 px-9 bg-fuchsia-700 text-fuchsia-50 rounded shadow hover:bg-fuchsia-800 transition-all cursor-pointer"
          onClick={async () => {
            await autosave(props.formData.id, {
              [currentStep().field]:
                stepValue() ?? (currentStep().multiselect ? [] : undefined),
            });

            next();
          }}
        >
          Next →
        </button>
      </Show>

      <Switch>
        <Match when={props.autosave}>
          <p class="mt-6 text-sm text-center text-fuchsia-900/40">
            Feel free to complete the form later! Your progress is saved.
          </p>
        </Match>

        <Match when={!props.autosave}>
          <p class="mt-6 text-sm text-center text-fuchsia-900/40">
            Want to complete the form later?{" "}
            <span
              class="font-semibold text-fuchsia-700/60 cursor-pointer"
              onClick={async () => {
                props.enableAutosave();
                await autosave(props.formData.id, props.formData);
              }}
            >
              Enable autosave
            </span>{" "}
            to save your progress.
          </p>
        </Match>
      </Switch>
    </div>
  );
}
