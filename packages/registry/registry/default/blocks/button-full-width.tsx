import { Button } from "../ui/button"

export default function ButtonFullWidth() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Full Width Default</h4>
        <Button className="w-full">Full Width Button</Button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Full Width Secondary</h4>
        <Button variant="secondary" className="w-full">
          Secondary Full Width
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Full Width Outline</h4>
        <Button variant="outline" className="w-full">
          Outline Full Width
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Full Width Large</h4>
        <Button size="lg" className="w-full">
          Large Full Width Button
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Stacked Full Width</h4>
        <div className="space-y-2">
          <Button className="w-full">Primary Action</Button>
          <Button variant="outline" className="w-full">
            Secondary Action
          </Button>
        </div>
      </div>
    </div>
  )
}
