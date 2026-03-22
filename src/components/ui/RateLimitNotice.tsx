interface Props {
  message: string;
}

export default function RateLimitNotice({ message }: Props) {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <span className="text-xl flex-shrink-0">⚠️</span>
      <p className="text-sm text-amber-800">{message}</p>
    </div>
  );
}
