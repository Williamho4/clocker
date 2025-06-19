import { cn } from "@/lib/utils";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";

type UserImageProps = {
  firstName: string;
  lastName: string;
  className?: string;
};

export default function UserImage({
  firstName,
  lastName,
  className,
}: UserImageProps) {
  return (
    <Avatar>
      <AvatarImage
        className={cn("h-8 w-8", className)}
        src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&rounded=true&font-size=0.33`}
      />
      <AvatarFallback>USER</AvatarFallback>
    </Avatar>
  );
}
