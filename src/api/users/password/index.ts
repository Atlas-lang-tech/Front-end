import { $API } from "@/api";

export interface EditUserPasswordParams {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export const editUserPassword = async ({
  id,
  currentPassword,
  newPassword,
}: EditUserPasswordParams) => {
  return $API.patch(`/auth/user/${id}/password`, {
    currentPassword,
    newPassword,
  });
};
