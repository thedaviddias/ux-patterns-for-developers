import { Button } from "../ui/button"

export default function ButtonWithAvatar() {
  return (
    <Button variant="ghost" className="h-auto p-2">
      <img
        src="https://github.com/shadcn.png"
        alt="User avatar"
        className="mr-2 h-6 w-6 rounded-full"
      />
      <span className="text-sm">@georgelucas</span>
    </Button>
  )
}
