import { Input, Label } from "ui";

type TPasswordSectionProps = {
  isDisabled: boolean;
};

export function PasswordSection({ isDisabled }: TPasswordSectionProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="Enter current password to make changes"
          disabled={isDisabled}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password (optional)"
          disabled={isDisabled}
        />
      </div>
    </>
  );
} 