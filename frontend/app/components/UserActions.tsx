import { useRouter } from "next/navigation"

interface Props {
  userId: number
  isDarkMode: boolean
}

export const UserActions = ({ userId, isDarkMode }: Props) => {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/edit?id=${userId}`)
  }

  // Add more actions as needed (e.g., delete)

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleEdit}
        className={`px-3 py-1 rounded-md text-white font-semibold transition duration-300 ${
          isDarkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Edit
      </button>
      {/* Add more buttons here for other actions */}
    </div>
  )
}

