import { format } from "date-fns";

const DateComponent = ({ dateString }: { dateString: string }) => <span className="text-slate-300">{format(new Date(dateString), 'MMM d, yyyy')}</span>;

export default DateComponent;