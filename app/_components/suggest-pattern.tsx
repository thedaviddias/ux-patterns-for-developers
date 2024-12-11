import { PROJECT_URL } from '@/app/_constants/project'
import { Button } from './ui/button'

export function SuggestPattern() {
  return (
    <div className="flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-600 rounded-xl">
      <h2 className="text-2xl font-bold mb-5 text-foreground">Got a pattern request?</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Let us know, and we&apos;ll add it!
      </p>
      <Button
        variant="outline"
        className="font-medium"
        asChild
      >
        <a
          href={`${PROJECT_URL}/discussions/new?category=suggestions`}
          target="_blank"
          rel="noopener noreferrer"
          className="plausible-event-name=Suggest+Pattern"
        >
          Send Suggestion
        </a>
      </Button>
    </div>
  )
}
