export type MenuRequest = {
  id_menu: string
  title: string,
  initFlow: boolean,
  options: OptionRequest[]
}

export type OptionRequest = {
  id_option: string
  id_next_menu: string | null,
  id_menu: string,
  title: string,
  number: number,
  message: string,
  action: 'message' | 'navigation' | 'redirect'
}