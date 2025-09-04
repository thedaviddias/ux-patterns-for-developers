import { Button } from "../ui/button"

export default function ButtonIconLeft() {
  return (
    <Button>
      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 7" />
      </svg>
      Send Email
    </Button>
  )
}
