import { AvatarImage, Avatar, AvatarFallback } from './ui/avatar'

type UserImageProps = {
  firstName: string
  lastName: string
}

export default function UserImage({ firstName, lastName }: UserImageProps) {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
        src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&rounded=true&font-size=0.33`}
      />
      <AvatarFallback className="rounded-lg">USER</AvatarFallback>
    </Avatar>
  )
}
