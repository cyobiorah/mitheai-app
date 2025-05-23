import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function DeleteDialog({
  config,
  setConfig,
  handleDelete,
  message,
  title,
}: any) {
  return (
    <Dialog
      open={config.isOpen}
      onOpenChange={(open) => setConfig({ isOpen: open, id: "" })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setConfig({ isOpen: false, id: "" })}
          >
            Cancel
          </Button>
          <Button onClick={() => handleDelete()}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
