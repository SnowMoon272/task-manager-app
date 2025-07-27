interface ProfileHeaderProps {
  title: string;
}

export default function ProfileHeader({ title }: ProfileHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-purple-500/20 bg-gray-800/30 backdrop-blur-sm">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        {title}
      </h2>
    </div>
  );
}

