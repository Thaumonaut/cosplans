import { derived, get, writable } from "svelte/store";

export interface FormMetadata {
  label?: string;
  routeId?: string;
  blockingMessage?: string;
}

export interface DirtyFormState extends FormMetadata {
  id: string;
  isDirty: boolean;
  touchedFields: string[];
  lastChangedAt: number | null;
}

interface FormsState {
  forms: Record<string, DirtyFormState>;
  lastUpdatedAt: number | null;
}

const initialState: FormsState = {
  forms: {},
  lastUpdatedAt: null,
};

interface RegisterOptions extends FormMetadata {
  initialDirty?: boolean;
  touchedFields?: string[];
}

interface SetDirtyOptions extends FormMetadata {
  field?: string;
  fields?: string[];
}

function normalizeFields(fields: string[] | undefined): string[] {
  return Array.from(new Set((fields ?? []).filter(Boolean))).sort();
}

function createFormsStore() {
  const store = writable<FormsState>(initialState);
  const { subscribe, update, set } = store;

  function ensureForm(formId: string, state: FormsState): DirtyFormState {
    return (
      state.forms[formId] ?? {
        id: formId,
        isDirty: false,
        touchedFields: [],
        lastChangedAt: null,
      }
    );
  }

  function registerForm(formId: string, options?: RegisterOptions) {
    update((state) => {
      const now = Date.now();
      const previous = ensureForm(formId, state);
      const touchedFields = normalizeFields(options?.touchedFields ?? previous.touchedFields);
      const isDirty = options?.initialDirty ?? previous.isDirty;

      const next: DirtyFormState = {
        ...previous,
        id: formId,
        isDirty,
        touchedFields,
        lastChangedAt: isDirty ? now : previous.lastChangedAt,
        label: options?.label ?? previous.label,
        routeId: options?.routeId ?? previous.routeId,
        blockingMessage: options?.blockingMessage ?? previous.blockingMessage,
      };

      return {
        forms: {
          ...state.forms,
          [formId]: next,
        },
        lastUpdatedAt: now,
      };
    });
  }

  function setDirty(formId: string, dirty = true, options?: SetDirtyOptions) {
    update((state) => {
      const now = Date.now();
      const previous = ensureForm(formId, state);
      const touched = new Set(previous.touchedFields);

      if (options?.fields) {
        for (const field of options.fields) {
          if (field) touched.add(field);
        }
      }
      if (options?.field) {
        touched.add(options.field);
      }

      let touchedFields = Array.from(touched).sort();

      if (!dirty) {
        touchedFields = [];
      }

      const next: DirtyFormState = {
        ...previous,
        id: formId,
        isDirty: dirty,
        touchedFields,
        lastChangedAt: dirty !== previous.isDirty || dirty ? now : previous.lastChangedAt,
        label: options?.label ?? previous.label,
        routeId: options?.routeId ?? previous.routeId,
        blockingMessage: options?.blockingMessage ?? previous.blockingMessage,
      };

      if (!dirty && previous.isDirty === false && previous.touchedFields.length === 0) {
        next.lastChangedAt = previous.lastChangedAt;
      }

      return {
        forms: {
          ...state.forms,
          [formId]: next,
        },
        lastUpdatedAt: now,
      };
    });
  }

  function markFieldDirty(formId: string, field: string, metadata?: FormMetadata) {
    if (!field) return;
    setDirty(formId, true, { field, ...metadata });
  }

  function markFieldPristine(formId: string, field: string) {
    if (!field) return;
    update((state) => {
      const previous = state.forms[formId];
      if (!previous) return state;

      const now = Date.now();
      const touchedFields = previous.touchedFields.filter((value) => value !== field);
      const isDirty = touchedFields.length > 0;

      return {
        forms: {
          ...state.forms,
          [formId]: {
            ...previous,
            isDirty,
            touchedFields,
            lastChangedAt: now,
          },
        },
        lastUpdatedAt: now,
      };
    });
  }

  function clearForm(formId: string) {
    update((state) => {
      if (!(formId in state.forms)) return state;
      const nextForms = { ...state.forms };
      delete nextForms[formId];

      return {
        forms: nextForms,
        lastUpdatedAt: Date.now(),
      };
    });
  }

  function clearTouchedFields(formId: string) {
    update((state) => {
      const previous = state.forms[formId];
      if (!previous) return state;

      const now = Date.now();

      return {
        forms: {
          ...state.forms,
          [formId]: {
            ...previous,
            isDirty: false,
            touchedFields: [],
            lastChangedAt: now,
          },
        },
        lastUpdatedAt: now,
      };
    });
  }

  function updateMetadata(formId: string, metadata: FormMetadata) {
    update((state) => {
      const previous = ensureForm(formId, state);
      const now = Date.now();

      return {
        forms: {
          ...state.forms,
          [formId]: {
            ...previous,
            ...metadata,
          },
        },
        lastUpdatedAt: now,
      };
    });
  }

  function reset() {
    set({ forms: {}, lastUpdatedAt: null });
  }

  function getSnapshot() {
    return get(store);
  }

  return {
    subscribe,
    registerForm,
    setDirty,
    markFieldDirty,
    markFieldPristine,
    clearForm,
    clearTouchedFields,
    updateMetadata,
    reset,
    getSnapshot,
  };
}

export const forms = createFormsStore();

export const hasDirtyForms = derived(forms, ($forms) =>
  Object.values($forms.forms).some((form) => form.isDirty)
);

export const dirtyFormCount = derived(
  forms,
  ($forms) => Object.values($forms.forms).filter((form) => form.isDirty).length
);

export const dirtyForms = derived(forms, ($forms) =>
  Object.values($forms.forms).filter((form) => form.isDirty)
);

export const formById = derived(forms, ($forms) => $forms.forms);
