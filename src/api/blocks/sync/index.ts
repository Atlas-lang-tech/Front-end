import { $API } from "@/api";
import type { BlockContent, BlockType } from "@/types/block";

export interface BlockItem {
  id?: number;
  type: BlockType;
  title?: string;
  content: BlockContent;
}

export interface SyncBlocksParams {
  lessonId: number;
  blocks: BlockItem[];
}

export const syncBlocks = async (params: SyncBlocksParams) => {
  return $API.put(`/course/private/lesson/${params.lessonId}/blocks`, {
    blocks: params.blocks,
  });
};
