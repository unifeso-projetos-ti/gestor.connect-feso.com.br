
interface ButtonFlowProps {
  onClick: () => void
  Icon?: any
  color?: string
}

export function ButtonFlow(props: ButtonFlowProps) {
  const { onClick, Icon, color } = props
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-600 p-2 rounded-md hover:bg-${color}-900 duration-500`}
    >
      <Icon size={24} color="#fff" />
    </button>
  )
}
