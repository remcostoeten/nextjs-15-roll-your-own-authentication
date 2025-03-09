export function Divider({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-5 mt-8 whitespace-nowrap text-stone-500">
            <div className="flex shrink-0 self-stretch my-auto h-px bg-neutral-800 w-[173px]" />
            <div className="self-stretch">{text}</div>
            <div className="flex shrink-0 self-stretch my-auto h-px bg-neutral-800 w-[173px]" />
        </div>
    );
}
