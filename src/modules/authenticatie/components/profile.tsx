import { trpc } from '@/modules/trpc/provider';
import { useQueryClient } from '@tanstack/react-query';

export function Profile() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = trpc.user.me.useQuery();
  const { mutate: updateProfile } = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user.me'] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.name}</p>
      </div>
      <button
        onClick={() =>
          updateProfile({
            name: 'New Name',
          })
        }
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Update Name
      </button>
    </div>
  );
}
