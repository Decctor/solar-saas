import dayjs from 'dayjs'

import ReactDOM from 'react-dom/server'
import { TProductItem } from '@/utils/schemas/kits.schema'
import { ProductItemCategories } from '@/utils/select-options'
import { BsCart } from 'react-icons/bs'
import { IconType } from 'react-icons'
import { AiFillFile } from 'react-icons/ai'
import { fileTypes } from '@/utils/constants'

export function handleRenderIcon(format: string, size?: number) {
  //   useKey('Escape', () => setSelectMenuIsOpen(false))
  const extensionInfo = Object.values(fileTypes).find((f) => f.title == format)
  if (!extensionInfo)
    return (
      <div className="text-lg text-black">
        <AiFillFile />
      </div>
    )
  return <div className="text-lg text-black">{renderIcon(extensionInfo.icon, size || 15)}</div>
}
export function renderIcon(icon: React.ComponentType | IconType, size: number | undefined = 12) {
  const IconComponent = icon
  return <IconComponent size={size} />
}
export function renderCategoryIcon(category: TProductItem['categoria'], size: number | undefined = 12) {
  const CategoryInfo = ProductItemCategories.find((productCategory) => productCategory.value == category)
  if (!CategoryInfo) return <BsCart size={size} />
  return renderIcon(CategoryInfo.icon, size)
}
export function renderDateDiffText(dueDate?: string) {
  if (!dueDate)
    return <p className={'min-w-[170px] break-keep rounded-md text-start text-[0.65rem] font-medium leading-none text-green-500'}>SEM DATA DE VENCIMENTO</p>
  const diffHours = dayjs(dueDate).diff(undefined, 'hour')
  const diffDays = dayjs(dueDate).diff(undefined, 'days')
  var number
  var param
  console.log('HORAS', diffHours)
  if (diffHours > 24) {
    number = Math.abs(diffDays)
    param = number > 1 ? 'DIAS' : 'DIA'
  } else {
    number = Math.abs(diffHours)
    param = number > 1 ? 'HORAS' : 'HORA'
  }
  const preText = diffHours < 0 ? 'VENCIDA HÁ ' : 'VENCE EM '
  const text = preText + number + ' ' + param

  if (diffHours > 24 && diffDays > 1)
    return <p className={'min-w-[170px] break-keep rounded-md text-start text-[0.65rem] font-medium leading-none text-green-500'}>{text}</p>
  if (diffHours > 24 && diffDays < 1)
    return <p className={'min-w-[170px] break-keep rounded-md text-start text-[0.65rem] font-medium leading-none text-orange-500'}>{text}</p>
  return <p className={'min-w-[170px] break-keep rounded-md text-start text-[0.65rem] font-medium leading-none text-red-500'}>{text}</p>
}
