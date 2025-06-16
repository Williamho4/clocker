import { format } from 'date-fns'
import { ShiftAndNames } from '@/lib/types'
import RemoveShiftBtn from './remove-shift-btn'

type ShiftProps = {
  shiftData: ShiftAndNames
}

export default function Shift({ shiftData }: ShiftProps) {
  return (
    <div className="flex items-center gap-3 relative group">
      <div className={`w-1.5 h-1.5 rounded-full bg-red-600`}></div>
      <div className="bg-white border-l-2 border-gray-100 pl-2 py-1.5 pr-1 group relative hover:bg-gray-200 transition-colors w-full">
        <div className="text-sm font-medium text-gray-800 truncate max-w-[80px] capitalize">
          {shiftData.user.firstName} {''} {shiftData.user.lastName}
        </div>
        {shiftData.startTime && shiftData.endTime && (
          <div className="text-xs text-gray-500 mt-0.5 ">
            {format(shiftData.startTime, 'HH:mm')} -{' '}
            {format(shiftData.endTime, 'HH:mm')}
          </div>
        )}
      </div>
      <RemoveShiftBtn shiftData={shiftData} />
    </div>
  )
}
