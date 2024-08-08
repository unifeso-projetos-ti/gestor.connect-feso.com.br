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
import { useEffect, useState } from 'react'
import { api } from '../../../../../api'
import { refreshFlowAtom, selectedMenuAtom } from '../../../../../atoms'
import { useAtom } from 'jotai'

interface UpdateMenuProps {
  isOpen: boolean
  onClose: () => void
  toast: any
}

export const UpdateMenu = (props: UpdateMenuProps) => {
  const { isOpen, onClose, toast } = props
  const [selectedMenu] = useAtom(selectedMenuAtom)

  const [dataUpdateMenu, setDataUpdateMenu] = useState({
    title: "",
    initFlow: false,
  })

  const [_, setRefreshFlow] = useAtom(refreshFlowAtom)

  useEffect(() => {
    setDataUpdateMenu({
      title: selectedMenu.title,
      initFlow: selectedMenu.initFlow,
    })
  }, [selectedMenu])


  const submitUpdateMenu = async () => {
    try {
      await api.patch('/menu/' + selectedMenu.id_menu, dataUpdateMenu)
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

  const deleteMenu = async () => {
    try {
      await api.delete('/menu/' + selectedMenu.id_menu)
      toast({
        title: 'Menu deletado com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setRefreshFlow((state) => !state)
      onClose()
    } catch (error) {
      toast({
        title: 'Erro ao deletar menu',
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
        <ModalHeader>Atualizar Menu</ModalHeader>
        <Input
          placeholder="Nome do menu"
          value={dataUpdateMenu.title}
          onChange={(e) =>
            setDataUpdateMenu({ ...dataUpdateMenu, title: e.target.value })
          }
        />
        <Checkbox
          isChecked={dataUpdateMenu.initFlow}
          onChange={(e) =>
            setDataUpdateMenu({ ...dataUpdateMenu, initFlow: e.target.checked })
          }
          mt={2}
        >
          Menu inicial
        </Checkbox>
        <ModalFooter>
          <Button colorScheme="orange"  onClick={onClose}>
            Fechar
          </Button>
          <Button colorScheme="red" mx={3} onClick={deleteMenu}>
            Apagar
          </Button>
          <Button colorScheme="green"  onClick={submitUpdateMenu}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
