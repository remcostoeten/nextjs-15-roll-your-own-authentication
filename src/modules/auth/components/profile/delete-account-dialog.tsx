import { ConfirmationDialog } from "ui";

type DeleteAccountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteAccountDialog({ isOpen, onClose, onConfirm }: DeleteAccountDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Account"
      description="Are you sure you want to delete your account? This action cannot be undone."
      verificationText="I am fat majin buu"
    />
  );
} 