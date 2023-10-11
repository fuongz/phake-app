import { Skeleton, SkeletonItem } from '@fluentui/react-components'

interface BaseSkeletonProps {
  lines: number
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ lines }) => {
  const _lines = lines || 1
  return <Skeleton className="w-full">{_lines && _lines > 0 && [...Array(_lines).keys()].map(() => <SkeletonItem />)}</Skeleton>
}

export { BaseSkeleton }
