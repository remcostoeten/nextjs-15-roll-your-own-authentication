'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import { useState } from 'react';
import { addComment } from '../server/mutations/add-comments';

export function useComments() {
	const [isAddingComment, setIsAddingComment] = useState(false);
	const [comment, setComment] = useState('');
	const { toast } = useToast();

	const handleAddComment = async (ticketId: string) => {
		if (!comment.trim()) return;

		setIsAddingComment(true);

		try {
			const result = await addComment({
				ticketId,
				content: comment.trim(),
			});

			if (result.success) {
				toast({
					message: 'Comment added successfully',
					title: 'Comment added',
					description: 'Your comment has been added successfully.',
					open: true,
					onOpenChange: () => {},
				});
				setComment('');
				return result.data;
			} else {
				toast({
					message: 'Failed to add comment',
					title: 'Error',
					description: result.error || 'Failed to add comment',
					open: true,
					onOpenChange: () => {},
				});
				return null;
			}
		} catch (error) {
			toast({
				message: 'An unexpected error occurred',
				title: 'Error',
				description: 'An unexpected error occurred',
				open: true,
				onOpenChange: () => {},
			});
			return null;
		} finally {
			setIsAddingComment(false);
		}
	};

	return {
		comment,
		setComment,
		isAddingComment,
		handleAddComment,
	};
}
