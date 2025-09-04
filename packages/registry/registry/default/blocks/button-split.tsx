import { Button } from "../ui/button"

export default function ButtonSplit() {
  return (
    <div className="flex">
      <Button className="rounded-r-none">
        Export
      </Button>
      <Button size="icon" variant="outline" className="rounded-l-none border-l-0">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
    </div>
  )
}
