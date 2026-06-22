import { useBillingStore } from "@/stores/billing.store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const DEFAULT_MAX_DICTIONARIES = 2;
const DEFAULT_MAX_WORDS_PER_DICT = 100;

export const usePlanLimits = () => {
  const { currentPlan } = storeToRefs(useBillingStore());

  const maxDictionaries = computed(
    () => currentPlan.value?.maxDictionaries ?? DEFAULT_MAX_DICTIONARIES,
  );

  const maxWordsPerDict = computed(
    () => currentPlan.value?.maxWordsPerDict ?? DEFAULT_MAX_WORDS_PER_DICT,
  );

  return { currentPlan, maxDictionaries, maxWordsPerDict };
};
