/**
 * @registry
 * @name button-with-keyboard-shortcut
 * @title Keyboard Shortcut Button
 * @type registry:block
 * @description Button with keyboard shortcut display
 * @categories ["buttons", "keyboard", "shortcuts"]
 * @tags ["keyboard", "shortcuts", "kbd", "accessibility", "power-user", "mac"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonWithKeyboardShortcut() {
	return (
		<Button>
			<span>Save</span>
			<kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
				⌘S
			</kbd>
		</Button>
	);
}
