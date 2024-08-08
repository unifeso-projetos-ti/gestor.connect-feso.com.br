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
import { useState } from 'react'
import { MenuRequest } from 'src/@types/menu'
import { api } from '../../../../../api'
import { createOptionDataMenuAtom, refreshFlowAtom } from '../../../../../atoms'
import { useAtom } from 'jotai'

interface CreateOptionProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateOption = (props: CreateOptionProps) => {
  const { isOpen, onClose } = props
  const [menus, setMenus] = useState([] as MenuRequest[])
  const [navigationMenus, setNavigationMenus] = useState('')
  const [createOptionDataMenu] = useAtom(createOptionDataMenuAtom)
  const [_, setRefreshFlow] = useAtom(refreshFlowAtom)

  const toast = useToast()

  const [dataCreateOption, setDataCreateOption] = useState({
    title: '',
    number: 0,
    message: '',
    action: '',
  })

  const selectAction = async (e: any) => {
    setDataCreateOption({ ...dataCreateOption, action: e.target.value })

    const { data } = await api.get('/menu')
    setMenus(data)
  }

  const submitCreateOption = async (e: any) => {
    e.preventDefault()
    try {
      if (dataCreateOption.action === 'navigation') {
        await api.post('/option', {
          id_menu: createOptionDataMenu.id_menu,
          id_next_menu: navigationMenus,
          data_option: {
            title: dataCreateOption.title,
            number: dataCreateOption.number,
            action: dataCreateOption.action,
            message: 'navigation',
          },
        })
      } else {
        await api.post('/option', {
          id_menu: createOptionDataMenu.id_menu,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="white" p={4} display="flex" flexDirection="column">
        <ModalHeader>Criar Opção</ModalHeader>
        <form onSubmit={submitCreateOption}>
          <Input
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
          <NumberInput>
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
            <Button type="button" colorScheme="red" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button type="submit" colorScheme="green" mr={3}>
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
