"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Separator } from "ui";
import { Loader2 } from "lucide-react";

import { updateProfile, deleteAccount } from "../../api/mutations";
import { profileSchema } from "../../api/models/schemas";
import { TProfileFormProps, TProfileFormState } from "../../api/models/types";
import { ProfileHeader } from "./profile-header";
import { ProfileFields } from "./profile-fields";
import { PasswordSection } from "./password-section";
import { FormAlert } from "./form-alert";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function ProfileForm({ user }: TProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formState, setFormState] = useState<TProfileFormState>({
    error: null,
    success: null,
    isLoading: false,
  });

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ error: null, success: null, isLoading: true });
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const validatedData = profileSchema.parse(data);

      startTransition(async () => {
        try {
          await updateProfile(validatedData);
          setFormState({
            error: null,
            success: "Profile updated successfully",
            isLoading: false,
          });
          router.refresh();
        } catch (err) {
          setFormState({
            error: {
              code: "SERVER_ERROR",
              message: err instanceof Error ? err.message : "An error occurred while updating the profile"
            },
            success: null,
            isLoading: false,
          });
        }
      });
    } catch (error) {
      setFormState({
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check your input",
          errors: error instanceof Error ? { form: [error.message] } : undefined
        },
        success: null,
        isLoading: false,
      });
    }
  }

  async function handleDeleteAccount() {
    startTransition(async () => {
      try {
        await deleteAccount();
        router.push("/login");
      } catch (err) {
        setFormState({
          error: {
            code: "SERVER_ERROR",
            message: err instanceof Error ? err.message : "An error occurred while deleting the account"
          },
          success: null,
          isLoading: false,
        });
        setIsDeleteDialogOpen(false);
      }
    });
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <FormAlert error={formState.error} success={formState.success} />
        <ProfileHeader user={user} onAvatarUpdate={updateProfile} setFormState={setFormState} />
        <Separator />
        
        <form onSubmit={handleProfileUpdate} className="space-y-8" aria-live="polite">
          <ProfileFields user={user} isPending={isPending} />
          <PasswordSection isDisabled={isPending} />

          <div className="flex justify-between">
            <Button type="submit" className="w-32" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isPending}
            >
              Delete Account
            </Button>
          </div>
        </form>

        <DeleteAccountDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </CardContent>
    </Card>
  );
} 