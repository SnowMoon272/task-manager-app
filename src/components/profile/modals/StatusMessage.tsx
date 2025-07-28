interface StatusMessageProps {
  error?: string;
  success?: string;
  className?: string;
}

export default function StatusMessage({ error, success, className = "mb-4" }: StatusMessageProps) {
  if (!error && !success) return null;

  return (
    <div className={className}>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {success && <div className="text-green-400 text-sm">{success}</div>}
    </div>
  );
}

