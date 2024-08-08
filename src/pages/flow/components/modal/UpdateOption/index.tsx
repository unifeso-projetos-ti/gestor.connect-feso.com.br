import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MenuRequest } from 'src/@types/menu'
import { api } from '../../../../../api'
import { refreshFlowAtom, selectedOptionAtom } from '../../../../../atoms'
import { useAtom } from 'jotai'

interface CreateOptionProps {
  isOpen: boolean
  onClose: () => void
}

export const UpdateOption = (props: CreateOptionProps) => {
  const { isOpen, onClose } = props
  const [menus, setMenus] = useState([] as MenuRequest[])
  const [navigationMenus, setNavigationMenus] = useState('')
  const [selectedOption] = useAtom(selectedOptionAtom)
  const [_, setRefreshFlow] = useAtom(refreshFlowAtom)

  const toast = useToast()

  const [dataCreateOption, setDataCreateOption] = useState({
    title: '',
    number: 0,
    message: '',
    action: '',
  })

  useEffect(() => {
    setDataCreateOption({
      title: selectedOption.title,
      number: selectedOption.number,
      message: selectedOption.message,
      action: selectedOption.action,
    })
    setNavigationMenus(selectedOption.id_next_menu || '')
  }, [selectedOption])

  const selectAction = async (e: any) => {
    setDataCreateOption({ ...dataCreateOption, action: e.target.value })

    const { data } = await api.get('/menu')
    setMenus(data)
  }


  const submitUpdateMenu = async (e: any) => {
    e.preventDefault()
    try {
      if (dataCreateOption.action === 'navigation') {
        await api.patch('/option/' + selectedOption.id_option, {
          id_next_menu: navigationMenus,
          data_option: {
            title: dataCreateOption.title,
            number: dataCreateOption.number,
            action: dataCreateOption.action,
            message: 'navigation',
          },
        })
        onClose()
      } else {
        await api.patch('/option/' + selectedOption.id_option, {
          data_option: {
            title: dataCreateOption.title,
            number: dataCreateOption.number,
            action: dataCreateOption.action,
            message: dataCreateOption.message,
          },
        })
      }

      setRefreshFlow((state) => !state)
      toast({
        title: 'Opção criada com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Erro ao criar opção',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const deleteMenu = async () => {
    try {
      await api.delete('/option/' + selectedOption.id_option)
      toast({
        title: 'Opção deletada com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setRefreshFlow((state) => !state)
      onClose()
    } catch (error) {
      toast({
        title: 'Erro ao deletar opção',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="white" p={4} display="flex" flexDirection="column">
        <ModalHeader>Atualizar Opção</ModalHeader>
        <form onSubmit={submitUpdateMenu}>
          <Input
            value={dataCreateOption.title}
            required
            onChange={(e) =>
              setDataCreateOption({
                ...dataCreateOption,
                title: e.target.value,
              })
            }
            mb={4}
            placeholder="Nome da opção"
          />
          <NumberInput
            value={dataCreateOption.number}
          >
            <NumberInputField
              required
              type="number"
              placeholder="Numero da opção"
              onChange={(e) =>
                setDataCreateOption({
                  ...dataCreateOption,
                  number: Number(e.target.value),
                })
              }
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            value={dataCreateOption.action}
            required
            my={4}
            onChange={selectAction}
            placeholder="Ação da opção"
          >
            <option value="message">Mensagem</option>
            <option value="navigation">Navegação</option>
            <option value="redirect">Falar com atendente</option>
            <option value="finish">Encerrar sessão</option>

          </Select>

          {dataCreateOption.action === 'navigation' && (
            <Select
              value={navigationMenus}
              onChange={(e) => setNavigationMenus(e.target.value)}
              required
              placeholder="Navegação"
            >
              {menus.map((menu) => (
                <option key={menu.id_menu} value={menu.id_menu}>
                  {menu.title}
                </option>
              ))}
            </Select>
          )}
          {dataCreateOption.action === 'message' && (
            <Input
              value={dataCreateOption.message}
              onChange={(e) =>
                setDataCreateOption({
                  ...dataCreateOption,
                  message: e.target.value,
                })
              }
              required
              mb={4}
              placeholder="Mensagem de resposta"
            />
          )}

          {dataCreateOption.action === 'redirect' && (
            <Input
              value={dataCreateOption.message}
              onChange={(e) =>
                setDataCreateOption({
                  ...dataCreateOption,
                  message: e.target.value,
                })
              }
              required
              mb={4}
              placeholder="Mensagem de resposta"
            />
          )}

          <ModalFooter>
            <Button colorScheme="orange" onClick={onClose}>
              Fechar
            </Button>
            <Button colorScheme="red" mx={3} type='button' onClick={deleteMenu}>
              Apagar
            </Button>
            <Button colorScheme="green" type='submit' >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
