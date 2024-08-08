import { MenuRequest } from "src/@types/menu"
import { api } from "../../api"

interface FlowServiceProps {
  setNodes: any,
  setEdges: any,

}

export const FlowService = (props: FlowServiceProps) => {
  const { setEdges, setNodes } = props
  const getMenus = async (): Promise<MenuRequest[]> => {
    const { data } = await api.get('/menu')

    return data
  }

  const convertToFlow = async (props: any) => {
    const { setIsOpenCreateOption, setCreateOptionDataMenu } = props
    const menus = await getMenus()

    const groups = menus.map((menu, index) => {
      return {
        id: menu.id_menu,
        data: { label: menu.title, ...menu, type: 'group', options: menu.options},
        position: { x: 250 * index, y: 5  },
        style: {
          background: '#f0f0f0',
          height: menu.options.length * 70 + 30,
          width: 200,
        },
      }
    })

    const children_nodes = groups.reduce((acc: any, menu) => {
      return [...acc, ...menu.data.options.map((option, index) => {
        return {
          id: option.id_option,
          data: { label: `${option.number} - ${option.title}`, ...option },
          position: { x: menu.position.x - 5, y: menu.position.y + 70 * index + 30},
          type: 'default',
          parentId: menu.data.id_menu,
          className: 'light',
          sourcePosition: 'right',
          style: {
            width: 210,
          }
        }
      })]
    }, [])


    const node_create_option = groups.map((group) => {
      return {
        id: `create-option-${group.id}`,
        data: { ...group, setIsOpenCreateOption, setCreateOptionDataMenu },
        position: { x: group.position.x + 20, y: group.style.height + 10},
        parentId: group.id,
        type: 'createOption',
      }
    })

    const nodes = [...groups, ...children_nodes, ...node_create_option]


    const edges = menus.reduce((acc: any, menu) => {
      return [...acc, ...menu.options.map((option) => {
        return {
          id: `${option.id_option}-${option.id_next_menu || 'end'}`,
          source: option.id_option,
          target: option.id_next_menu || 'end',
          animated: true,
        }
      })]
    }, [])

    console.log({ nodes, edges });
    

    setNodes(nodes)
    setEdges(edges)
  }

  return {
    convertToFlow,
  }
}