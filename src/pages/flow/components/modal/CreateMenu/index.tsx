import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'
import { api } from '../../../../../api'
import { refreshFlowAtom } from '../../../../../atoms'
import { useAtom } from 'jotai'

interface CreateMenuProps {
  isOpen: boolean
  onClose: () => void
  toast: any
}

export const CreateMenu = (props: CreateMenuProps) => {
  const { isOpen, onClose, toast } = props
  const [dataCreateMenu, setDataCreateMenu] = useState({
    title: '',
    initFlow: false,
  })
  const [_, setRefreshFlow] = useAtom(refreshFlowAtom)

  const submitCreateMenu = async () => {
    try {
      await api.post('/menu', {
        phone_bot: '15550088571',
        data_menu: dataCreateMenu,
      })
      toast({
        title: 'Menu criado com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setRefreshFlow((state) => !state)
      onClose()
    } catch (error) {
      toast({
        title: 'Erro ao criar menu',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="white" p={4} borderRadius={4}>
        <ModalHeader>Criar Menu</ModalHeader>
        <Input
          placeholder="Nome do menu"
          onChange={(e) =>
            setDataCreateMenu({ ...dataCreateMenu, title: e.target.value })
          }
        />
        <Checkbox
          onChange={(e) =>
            setDataCreateMenu({ ...dataCreateMenu, initFlow: e.target.checked })
          }
          mt={2}
        >
          Menu inicial
        </Checkbox>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Fechar
          </Button>
          <Button colorScheme="green" onClick={submitCreateMenu}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
