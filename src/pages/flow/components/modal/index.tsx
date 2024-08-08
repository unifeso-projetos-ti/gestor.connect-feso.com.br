import { useToast } from '@chakra-ui/react'
import { CreateMenu } from './CreateMenu'
import { CreateOption } from './CreateOption'
import { UpdateMenu } from './UpdateMenu'
import { UpdateOption } from './UpdateOption'

interface ModalFlowProps {
  isOpenCreateMenu: boolean
  onCloseCreateMenu: () => void
  isOpenCreateOption: boolean
  onCloseCreateOption: () => void
  isOpenUpdateMenu: boolean
  onCloseUpdateMenu: () => void
  isOpenUpdateOption: boolean
  onCloseUpdateOption: () => void
}

export const ModalFlow = (props: ModalFlowProps) => {
  const toast = useToast()
  return (
    <>
      <CreateMenu
        toast={toast}
        isOpen={props.isOpenCreateMenu}
        onClose={props.onCloseCreateMenu}
      />
      <CreateOption
        isOpen={props.isOpenCreateOption}
        onClose={props.onCloseCreateOption}
      />
      <UpdateMenu toast={toast} 
        isOpen={props.isOpenUpdateMenu} 
        onClose={props.onCloseUpdateMenu}
      />
      <UpdateOption
        isOpen={props.isOpenUpdateOption}
        onClose={props.onCloseUpdateOption}
      />
    </>
  )
}
