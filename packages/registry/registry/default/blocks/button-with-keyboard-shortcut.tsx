import { Button } from "../ui/button"

export default function ButtonWithKeyboardShortcut() {
  return (
    <Button className="justify-between">
      <span>Save</span>
      <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        ⌘S
      </kbd>
    </Button>
  )
}
