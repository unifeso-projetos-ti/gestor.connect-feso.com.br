import { Plus } from 'phosphor-react'
import { OptionRequest } from 'src/@types/menu'
import { useAtom } from 'jotai'
import { createOptionDataMenuAtom } from '../../../atoms'

interface CreateOptionNodeProps {
  data: {
    setIsOpenCreateOption: any
    setCreateOptionDataMenu: any
    data: {
      group: {
        id: string
        data: {
          id_menu: string
          title: string
          initFlow: boolean
          Option: OptionRequest[]
          label: string
        }
        position: {
          x: number
          y: number
        }
        style: {
          background: string
          height: number
          width: number
        }
      }
    }
  }
}
export const CreateOptionNode = (props: CreateOptionNodeProps) => {
  const [_, setCreateOptionDataMenu] = useAtom(createOptionDataMenuAtom)
  const { data } = props

  return (
    <button
      onClick={() => {
        data.setIsOpenCreateOption(true)
        setCreateOptionDataMenu(data.data)
      }}
      className="flex bg-white p-2 text-green-600  hover:text-green-900 hover:border-green-900 rounded-md shadow-md justify-center items-center border-dashed border-2 border-green-600  duration-500"
    >
      <Plus size={22} color="#047857" />
      <p className="font-semibold ml-2 cursor-pointer text-sm">
        Criar nova opção
      </p>
    </button>
  )
}
