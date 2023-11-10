interface DatabaseStatusProps {
  system: any
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ system }) => {
  return (
    <div>
      <p className="text-zinc-400 text-xs">
        <span className="font-semibold text-zinc-600">Connected: </span>
        <span>mysql://</span>
        <span>{system?.user}@</span>
        <span>{system?.host}/</span>
        <span>{system?.database_name}</span>
      </p>
    </div>
  )
}

export { DatabaseStatus }
