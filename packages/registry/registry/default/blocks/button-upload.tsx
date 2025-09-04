import { Button } from "../ui/button"

export default function ButtonUpload() {
  return (
    <Button variant="outline" className="h-auto p-4">
      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <div className="text-left">
        <div className="font-medium">Upload image</div>
        <div className="text-xs text-muted-foreground">No image uploaded</div>
      </div>
    </Button>
  )
}
