const Button = ({
  children,
  title,
  ...props
}: {
  children: React.ReactNode;
  title: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
    title={title}
  >
    {children}
  </button>
);

export default Button;