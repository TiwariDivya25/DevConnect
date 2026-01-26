const Container = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className="flex items-center text-sm text-slate-400">{children}</div>
  );
};
export default Container;