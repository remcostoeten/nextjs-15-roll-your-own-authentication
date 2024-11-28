`
type ThemePreset = {
  name: string;
  colors: {
    [key: string]: string;
  };
};

type ThemePreviewProps = {
  preset: ThemePreset;
  isSelected: boolean;
  onClick: () => void;
};

const ThemePreview = ({ preset, isSelected, onClick }: ThemePreviewProps) => {
  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="relative h-full w-full flex flex-col justify-between">
        <div className="p-3">
          <div className="h-2 w-12 rounded-full bg-white/20" />
        </div>
        <div className="p-3">
          <p className="text-xs font-medium text-white">{preset.name}</p>
          <div className="mt-2 flex gap-1">
            {preset.colors && Object.values(preset.colors).map((color, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
`