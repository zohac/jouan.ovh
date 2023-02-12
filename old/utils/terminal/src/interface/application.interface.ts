export interface ApplicationInterface {
  COMMAND_NAME: string
  description: string

  execute(): HTMLDivElement | null
}
