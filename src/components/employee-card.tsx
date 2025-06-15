import Image from 'next/image'

export default function EmployeeCard() {
  return (
    <div className="flex items-center justify-center gap-1 bg-gray-300 h-16 rounded-md w-full shadow-sm ">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src="/pic.webp"
          alt="Profile picture"
          fill
          sizes="40px"
          className="object-cover"
          priority
        />
      </div>
      <h1 className="capitalize font-semibold text-gray-900 truncate">
        William Ho
      </h1>
    </div>
  )
}
