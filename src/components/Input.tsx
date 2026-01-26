const Input = (
  props: React.JSX.IntrinsicElements["input"],
): React.JSX.Element => (
  <input
    {...props}
    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150
                light:bg-white light:border-gray-300 light:placeholder-gray-400 light:text-gray-900 light:focus:border-blue-500 light:focus:ring-2 light:focus:ring-blue-200 light:shadow-sm"
    placeholder="••••••••"
  />
);

export default Input;