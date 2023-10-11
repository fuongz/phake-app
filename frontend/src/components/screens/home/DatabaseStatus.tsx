import { useSystemInfo } from 'src/hooks/useSystem'

interface DatabaseStatusProps {
  system: any
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ system }) => {
  return (
    <div className="pl-4 border-l">
      <p className="text-zinc-400 text-xs">
        <span className="font-semibold text-zinc-600">Connected: </span>
        <span>mysql://</span>
        <span>{system?.data?.database.user}/***@</span>
        <span>{system?.data?.database.host}/</span>
        <span>{system?.data?.database.name}</span>
      </p>
    </div>
  )
}

export { DatabaseStatus }
