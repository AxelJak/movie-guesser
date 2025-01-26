export default function Input({ className = "", ...props }) {
  return (
    <input className={`border border-gray-300 rounded-md p-2 ${className}`} {...props} />
  )
}