'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ActivityChartProps {
	data: {
		notes: Array<{ date: string; count: number }>;
		tickets: Array<{ date: string; count: number }>;
	};
}

export function ActivityChart({ data }: ActivityChartProps) {
	const combinedData = data.notes.map((note) => {
		const ticket = data.tickets.find((t) => t.date === note.date);
		return {
			date: note.date,
			notes: note.count,
			tickets: ticket?.count || 0,
		};
	});

	return (
		<Card className="md:col-span-5">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Activity</CardTitle>
					<Tabs defaultValue="notes">
						<TabsList>
							<TabsTrigger value="notes">Notes</TabsTrigger>
							<TabsTrigger value="tickets">Tickets</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={combinedData}>
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Area
								type="monotone"
								dataKey="notes"
								stackId="1"
								stroke="#8884d8"
								fill="#8884d8"
								name="Notes"
							/>
							<Area
								type="monotone"
								dataKey="tickets"
								stackId="1"
								stroke="#82ca9d"
								fill="#82ca9d"
								name="Tickets"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
