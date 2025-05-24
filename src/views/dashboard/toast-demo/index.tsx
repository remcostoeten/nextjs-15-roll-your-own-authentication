'use client';

import { toast } from '@/shared/components/toast';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { useCallback, useEffect, useRef, useState } from 'react';

type TToast = 'success' | 'error' | 'warning' | 'info' | 'neutral';

type TProps = {
	message: string;
	type: TToast;
	duration: number;
}

export function ToastDemoView() {
	const [config, setConfig] = useState<TProps>({
		message: 'This is a test toast message',
		type: 'info',
		duration: 5000,
	});
	const [freezeCount, setFreezeCount] = useState(3);
	const [repeatCount, setRepeatCount] = useState(3);
	const [repeatDelay, setRepeatDelay] = useState(1000);
	const [isInfinite, setIsInfinite] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const showToast = useCallback(() => {
		toast[config.type](config.message, config.duration);
	}, [config]);

	const freezeToasts = useCallback(() => {
		Array.from({ length: freezeCount }).forEach(() => {
			showToast();
		});
	}, [freezeCount, showToast]);

	const startRepeating = useCallback(() => {
		let count = 0;

		const showNext = () => {
			showToast();
			count++;

			if (!isInfinite && count >= repeatCount) {
				clearInterval(intervalRef.current as NodeJS.Timeout);
			}
		};

		showNext(); // Show first immediately
		intervalRef.current = setInterval(showNext, repeatDelay);
	}, [isInfinite, repeatCount, repeatDelay, showToast]);

	const stopRepeating = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current as NodeJS.Timeout);
		}
	}, []);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current as NodeJS.Timeout);
			}
		};
	}, []);

	return (
		<div className="container py-8 space-y-8">
			<h1 className="text-3xl font-bold">Toast Demo</h1>

			<div className="grid gap-8 md:grid-cols-2">
				<Card className="p-6 space-y-6">
					<h2 className="text-xl font-semibold">Toast Configuration</h2>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Message</Label>
							<Input
								value={config.message}
								onChange={(e) =>
									setConfig((prev) => ({ ...prev, message: e.target.value }))
								}
							/>
						</div>

						<div className="space-y-2">
							<Label>Type</Label>
							<Select
								value={config.type}
									onValueChange={(value: TToast) =>
									setConfig((prev) => ({ ...prev, type: value }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="success">Success</SelectItem>
									<SelectItem value="error">Error</SelectItem>
									<SelectItem value="warning">Warning</SelectItem>
									<SelectItem value="info">Info</SelectItem>
									<SelectItem value="neutral">Neutral</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Duration (ms)</Label>
							<Input
								type="number"
								value={config.duration}
								onChange={(e) =>
									setConfig((prev) => ({
										...prev,
										duration: parseInt(e.target.value) || 5000,
									}))
								}
							/>
						</div>

						<Button onClick={showToast} className="w-full">
							Show Single Toast
						</Button>
					</div>
				</Card>

				<Card className="p-6 space-y-6">
					<h2 className="text-xl font-semibold">Multiple Toasts</h2>

					<div className="space-y-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Number of Frozen Toasts</Label>
								<Input
									type="number"
									value={freezeCount}
									onChange={(e) => setFreezeCount(parseInt(e.target.value) || 3)}
								/>
							</div>

							<Button onClick={freezeToasts} className="w-full">
								Freeze {freezeCount} Toasts
							</Button>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Repeat Count</Label>
								<Input
									type="number"
									value={repeatCount}
									onChange={(e) => setRepeatCount(parseInt(e.target.value) || 3)}
									disabled={isInfinite}
								/>
							</div>

							<div className="space-y-2">
								<Label>Repeat Delay (ms)</Label>
								<Input
									type="number"
									value={repeatDelay}
									onChange={(e) => setRepeatDelay(parseInt(e.target.value) || 1000)}
								/>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									checked={isInfinite}
									onCheckedChange={setIsInfinite}
									id="infinite-mode"
								/>
								<Label htmlFor="infinite-mode">Infinite Mode</Label>
							</div>

							<div className="space-x-4">
								<Button onClick={startRepeating} className="w-[calc(50%-8px)]">
									Start {isInfinite ? 'Infinite' : `${repeatCount}x`} Repeat
								</Button>
								<Button
									onClick={stopRepeating}
									variant="outline"
									className="w-[calc(50%-8px)]"
								>
									Stop Repeat
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<div className="prose prose-sm max-w-none">
				<h3>Instructions:</h3>
				<ul>
					<li>
						<strong>Single Toast:</strong> Configure and show individual toasts with custom
						messages, types, and durations.
					</li>
					<li>
						<strong>Freeze Toasts:</strong> Show multiple toasts at once that will stay
						visible for their full duration.
					</li>
					<li>
						<strong>Repeat Toasts:</strong> Automatically show toasts at a specified
						interval, either for a set number of times or infinitely.
					</li>
				</ul>
			</div>
		</div>
	);
}
