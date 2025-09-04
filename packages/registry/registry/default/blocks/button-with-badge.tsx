import { Button } from "../ui/button"

export default function ButtonWithBadge() {
  return (
    <Button>
      Messages
      <span className="ml-2 inline-flex h-5 select-none items-center justify-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
        12
      </span>
    </Button>
  )
}
