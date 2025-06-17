import { getAllColleagues } from '@/actions/organization-actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import UserImage from './user-image'

export async function RequestShiftChangeDialog() {
  const colleagues = await getAllColleagues()

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full">Request Change</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Shift Change</DialogTitle>
            <DialogDescription>
              Send a request to change shift with a colleague
            </DialogDescription>
          </DialogHeader>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Colleagues" />
            </SelectTrigger>
            <SelectContent>
              {colleagues.map((colleague) => (
                <SelectItem value={colleague.id} className="capitalize ">
                  <UserImage
                    className="h-6 w-6 m-auto"
                    firstName={colleague.user.firstName}
                    lastName={colleague.user.lastName}
                  />
                  {colleague.user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Send</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
