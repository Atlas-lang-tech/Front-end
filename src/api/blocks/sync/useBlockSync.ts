import { useMutation } from "@pinia/colada";
import { syncBlocks, type SyncBlocksParams } from ".";

export const useBlockSync = () => {
  return useMutation({
    mutation: (params: SyncBlocksParams) => syncBlocks(params),
  });
};
